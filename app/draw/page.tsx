'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from 'antd';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';

const ExcalidrawWithoutSSR = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

export default function App() {
  const [canvasUrl, setCanvasUrl] = React.useState('');
  const [api, setAPI] = React.useState<ExcalidrawImperativeAPI | null>(null);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <ExcalidrawWithoutSSR
        excalidrawAPI={setAPI}
        renderTopRightUI={() => {
          return (
            <Button
              onClick={async () => {
                if (!api) {
                  return;
                }
                const elements = api.getSceneElements();
                if (!elements || !elements.length) {
                  return;
                }
                const exportToCanvas = (await import('@excalidraw/excalidraw'))
                  .exportToCanvas;

                const canvas = await exportToCanvas({
                  elements,
                  appState: {
                    // ...initialData.appState,
                    exportWithDarkMode: false,
                  },
                  files: api.getFiles(),
                  getDimensions: () => {
                    return { width: 1200, height: 630 };
                  },
                });
                const img = canvas.toDataURL();
                const id = nanoid();
                console.log('save to', id);
                await kv.set(id, img);
              }}
            >
              export
            </Button>
          );
        }}
      />
    </div>
  );
}
