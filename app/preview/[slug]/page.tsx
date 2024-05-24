// import { kv } from '@vercel/kv';
// import Head from 'next/head';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  const fcMetadata: Record<string, string> = {
    'fc:frame': 'vNext',
    // 'fc:frame:post_url': `${process.env['HOST']}/api/vote?id=${id}`,
    'fc:frame:image': `/preview/${slug}/opengraph-image`,
    'fc:frame:button:1': 'Create My Own',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': process.env['HOST']!,
  };

  return {
    title: 'farcaster',
    openGraph: {
      title: 'farcaster',
      images: [`/preview/${slug}/opengraph-image`],
    },
    other: {
      ...fcMetadata,
    },
    // metadataBase: new URL('/'),
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  return <>Enjoy it</>;
}
