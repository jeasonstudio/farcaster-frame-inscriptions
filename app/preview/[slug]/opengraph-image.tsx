import { ImageResponse } from 'next/og';
import { kv } from '@vercel/kv';

export const runtime = 'edge';

export const alt = 'About Acme';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export interface ImageProps {
  params: { slug: string };
}

export default async function Image({ params }: ImageProps) {
  const slug = params.slug;
  const imgSrouce = await kv.get<string>(slug);

  return new ImageResponse(
    (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imgSrouce!} alt={alt} width={size.width} height={size.height} />
    ),
    size
  );
}
