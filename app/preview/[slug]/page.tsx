// import { kv } from '@vercel/kv';
// import Head from 'next/head';
import { Metadata } from 'next';

const host = 'https://farcaster-frame-inscriptions.vercel.app';

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
    'fc:frame:image': `${host}/preview/${slug}/opengraph-image`,
    'fc:frame:button:1': 'Create My Own',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': host,
  };

  return {
    title: 'farcaster',
    openGraph: {
      title: 'farcaster',
      images: [`${host}/preview/${slug}/opengraph-image`],
    },
    other: {
      ...fcMetadata,
    },
    metadataBase: new URL(host),
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  return <>Enjoy it</>;
}
