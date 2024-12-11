import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('Received POST request to /api/shorten');
    const { url } = await req.json();
    console.log('Received URL:', url);

    if (!url) {
      console.log('No URL provided');
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      console.log('Invalid URL format:', url);
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Generate a short unique identifier
    const shortId = nanoid(8);
    console.log('Generated shortId:', shortId);

    // Save to database
    try {
      const shortUrl = await prisma.shortUrl.create({
        data: {
          shortId,
          originalUrl: url,
          clicks: 0,
        },
      });
      console.log('Saved to database:', shortUrl);
    } catch (e) {
      console.error('Database error:', e);
      return NextResponse.json(
        { error: 'Failed to save URL to database' },
        { status: 500 }
      );
    }

    // Construct the shortened URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shortenedUrl = `${baseUrl}/${shortId}`;
    console.log('Generated shortened URL:', shortenedUrl);

    return NextResponse.json({
      shortUrl: shortenedUrl,
      shortId,
    });
  } catch (error) {
    console.error('Error in /api/shorten:', error);
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    );
  }
}
