import { ImageResponse } from 'next/og';
import Img from 'next/image';

export const runtime = 'edge';

export const alt = 'About Acme';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export interface ImageProps {
  params: { inscriptionId: string };
}

export type InscriptionResponse = {
  id: string;
  number: number;
  address: string;
  genesis_address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: string;
  genesis_timestamp: number;
  tx_id: string;
  location: string;
  output: string;
  offset: string;
  sat_ordinal: string;
  sat_rarity: string;
  sat_coinbase_height: number;
  mime_type: string;
  content_type: string;
  content_length: number;
  timestamp: number;
};

const endpoint = `https://api.hiro.so`;

async function getInscription(
  inscriptionId: string
): Promise<InscriptionResponse> {
  const response = await fetch(
    `${endpoint}/ordinals/v1/inscriptions/${inscriptionId.toLowerCase()}`
  );
  return await response.json();
}

async function getContent(inscriptionId: string) {
  const response = await fetch(
    `${endpoint}/ordinals/v1/inscriptions/${inscriptionId.toLowerCase()}/content`
  );
  return response;
}

export default async function Image({ params }: ImageProps) {
  const inscriptionId = params.inscriptionId;
  const data = await getInscription(inscriptionId);
  console.log(data);
  // const content = await getContent(inscriptionId);

  let element: React.ReactElement = <div>hhh</div>;

  if (data.mime_type.startsWith('image/')) {
    const content = await getContent(inscriptionId)
      .then((res) => res.blob())
      .then((blob) => blob.arrayBuffer())
      .then((buffer) => Buffer.from(buffer).toString('base64'));

    element = (
      <div
        style={{
          // backgroundImage: `url(${endpoint}/ordinals/v1/inscriptions/${inscriptionId.toLowerCase()}/content)`,
          // backgroundPosition: 'center',
          // backgroundRepeat: 'no-repeat',
          // backgroundSize: 'contain',
          // imageRendering: 'pixelated',
          display: 'flex',
          width: 600,
          height: 600,
          border: '1px solid black',
        }}
      >
        <Img
          unoptimized
          src={`data:${data.mime_type};charset=utf-8;base64,${content}`}
          // src={`${endpoint}/ordinals/v1/inscriptions/${inscriptionId.toLowerCase()}/content`}
          style={{
            imageOrientation: 'from-image',
            imageRendering: 'pixelated',
          }}
          alt="Inscription image"
          height={600}
          width={600}
        />
      </div>
    );
  } else if (data.mime_type.startsWith('video/')) {
    // return html(bodyWithVideo(data));
  } else if (data.mime_type.startsWith('audio/')) {
    // return html(bodyWithAudio(data));
  } else if (data.mime_type.startsWith('text/')) {
    // todo: don't fetch content if big?
    const content = await getContent(inscriptionId).then((res) => res.text());
    element = <div style={{ display: 'flex' }}>{content}</div>;
    // if (data.mime_type.startsWith('text/html')) {
    //   return content;
    // }
    // return htmlWithFont(
    //   data.content_length < 32
    //     ? bodyWithTextShort(data, content)
    //     : bodyWithText(data, content)
    // );
  } else if (data.mime_type.startsWith('application/json')) {
    // todo: don't fetch content if big?
    // const content = await getContent(data.id);
    // return htmlWithFont(bodyWithText(data, content));
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
        }}
      >
        {element}
      </div>
    ),
    {
      ...size,
    }
  );
}
