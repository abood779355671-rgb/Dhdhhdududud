'use client';

import React from 'react';
import { ImageElement as ImgEl } from '@/lib/templates/types';

interface Props {
  element: ImgEl;
}

export default function ImageElement({ element }: Props) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: element.borderRadius,
        overflow: 'hidden',
        border:
          element.borderWidth > 0
            ? `${element.borderWidth}px solid ${element.borderColor}`
            : 'none'
      }}
    >
      {element.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={element.src}
          alt={element.alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: element.objectFit,
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(245,215,142,0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#C9A84C',
            fontSize: 14
          }}
        >
          أضف صورة
        </div>
      )}
    </div>
  );
}
