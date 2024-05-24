'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Typography, Modal } from 'antd';
import Image from 'next/image';
import { ShareAltOutlined } from '@ant-design/icons';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';

const ExcalidrawWithoutSSR = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

export default function App() {
  const [api, setAPI] = React.useState<ExcalidrawImperativeAPI | null>(null);

  const exportWarpcast = React.useCallback(async () => {
    const exportToCanvas = (await import('@excalidraw/excalidraw'))
      .exportToCanvas;
    if (!api || !exportToCanvas) return;
    const elements = api.getSceneElements();
    const canvas = await exportToCanvas({
      elements,
      appState: {
        // ...initialData.appState,
        exportWithDarkMode: false,
        exportEmbedScene: true,
      },
      files: api.getFiles(),
      getDimensions: () => ({ width: 1200, height: 630 }),
    });
    const img = canvas.toDataURL();
    console.log(img);
    const id = nanoid();
    await kv.set(id, img);

    const targetUrl = `${window.location.origin}/preview/${id}`;

    Modal.info({
      title: 'Preview Frame',
      width: 660,
      content: (
        <div style={{ width: 600, height: 315 }}>
          <img src={img} alt="" style={{ width: 600, height: 315 }} />
          <Typography.Paragraph copyable>{targetUrl}</Typography.Paragraph>
        </div>
      ),
    });

    // const w = window.open('');
    // w!.location.href = img;
  }, [api]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ExcalidrawWithoutSSR
        excalidrawAPI={setAPI}
        renderTopRightUI={() => {
          return (
            <div
              className="sidebar-trigger default-sidebar-trigger"
              onClick={exportWarpcast}
            >
              <ShareAltOutlined style={{ fontSize: 12 }} />
              <div className="sidebar-trigger__label">Export to Warpcast</div>
            </div>
          );
          // return (
          //   <Button
          //     onClick={async () => {
          //       if (!api) {
          //         return;
          //       }
          //       const elements = api.getSceneElements();
          //       if (!elements || !elements.length) {
          //         return;
          //       }
          //       const exportToCanvas = (await import('@excalidraw/excalidraw'))
          //         .exportToCanvas;

          //       const canvas = await exportToCanvas({
          //         elements,
          //         appState: {
          //           // ...initialData.appState,
          //           exportWithDarkMode: false,
          //         },
          //         files: api.getFiles(),
          //         getDimensions: () => {
          //           return { width: 1200, height: 630 };
          //         },
          //       });
          //       const img = canvas.toDataURL();
          //       window.open(img);
          //       const id = nanoid();
          //       // console.log('save to', id);
          //       // await kv.set(id, img);
          //     }}
          //   >
          //     export
          //   </Button>
          // );
        }}
      />
    </div>
  );
}
