'use client';

import React from 'react';
import { ShapeElement as ShapeEl } from '@/lib/templates/types';

interface Props {
  element: ShapeEl;
}

export default function ShapeElement({ element }: Props) {
  const isCircle = element.shape === 'circle' || element.shape === 'ellipse';
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: element.fill === 'transparent' ? 'transparent' : element.fill,
        border:
          element.strokeWidth > 0 && element.stroke !== 'transparent'
            ? `${element.strokeWidth}px solid ${element.stroke}`
            : 'none',
        borderRadius: isCircle ? '50%' : element.borderRadius
      }}
    />
  );
}
