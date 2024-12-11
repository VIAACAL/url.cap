import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  try {
    const shortId = params.shortId;

    // Get URL and its analytics
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { shortId },
      include: {
        clicks: {
          select: {
            createdAt: true,
            referrer: true,
            userAgent: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!shortUrl) {
      return NextResponse.json(
        { error: 'URL not found' },
        { status: 404 }
      );
    }

    // Calculate analytics
    const analytics = {
      totalClicks: shortUrl.clicks,
      originalUrl: shortUrl.originalUrl,
      createdAt: shortUrl.createdAt,
      clickHistory: shortUrl.clicks,
      referrerSources: shortUrl.clicks.reduce((acc: { [key: string]: number }, click) => {
        acc[click.referrer] = (acc[click.referrer] || 0) + 1;
        return acc;
      }, {}),
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
