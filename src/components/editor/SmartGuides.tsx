'use client';

import React from 'react';
import { AlignmentGuide } from '@/lib/editor/utils';

interface Props {
  guides: AlignmentGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

export default function SmartGuides({ guides, canvasWidth, canvasHeight }: Props) {
  return (
    <>
      {guides.map((g, i) =>
        g.type === 'v' ? (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: g.position,
              top: 0,
              width: 1,
              height: canvasHeight,
              background: '#FF3D71',
              pointerEvents: 'none',
              zIndex: 9999
            }}
          />
        ) : (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: g.position,
              left: 0,
              height: 1,
              width: canvasWidth,
              background: '#FF3D71',
              pointerEvents: 'none',
              zIndex: 9999
            }}
          />
        )
      )}
    </>
  );
}
