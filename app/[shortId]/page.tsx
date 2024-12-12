import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

interface Props {
  params: {
    shortId: string;
  };
}

export default async function ShortUrlRedirect({ params }: Props) {
  const { shortId } = params;

  // Look up the short URL in the database
  const shortUrl = await prisma.shortUrl.findUnique({
    where: {
      shortId: shortId,
    },
  });

  if (!shortUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">URL Not Found</h1>
        <p>The shortened URL you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  // Increment the click count
  await prisma.shortUrl.update({
    where: {
      id: shortUrl.id,
    },
    data: {
      clicks: {
        increment: 1,
      },
    },
  });

  // Redirect to the original URL
  redirect(shortUrl.originalUrl);
}
