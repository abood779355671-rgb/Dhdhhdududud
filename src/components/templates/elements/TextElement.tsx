'use client';

import React from 'react';
import { TextElement as TextEl } from '@/lib/templates/types';
import { getFont } from '@/lib/templates/fonts';

interface Props {
  element: TextEl;
}

export default function TextElement({ element }: Props) {
  const font = getFont(element.fontKey);
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          element.textAlign === 'right'
            ? 'flex-start'
            : element.textAlign === 'left'
              ? 'flex-end'
              : 'center',
        fontFamily: font.cssFamily,
        fontSize: element.fontSize,
        fontWeight: element.fontWeight,
        color: element.color,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight,
        letterSpacing: element.letterSpacing,
        textShadow: element.textShadow,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        direction: 'rtl'
      }}
    >
      <span style={{ width: '100%' }}>{element.content}</span>
    </div>
  );
}
