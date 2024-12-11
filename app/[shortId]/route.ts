import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const shortId = params.shortId;

    // Find the URL in the database
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { shortId },
    });

    if (!shortUrl) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Log the click
    await prisma.click.create({
      data: {
        shortUrlId: shortUrl.id,
        referrer: request.headers.get('referer') || 'direct',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Update click count
    await prisma.shortUrl.update({
      where: { id: shortUrl.id },
      data: { clicks: { increment: 1 } },
    });

    // Redirect to the original URL
    return NextResponse.redirect(shortUrl.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Failed to redirect' },
      { status: 500 }
    );
  }
}
