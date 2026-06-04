'use client';

import React from 'react';
import { DividerElement as DivEl } from '@/lib/templates/types';

interface Props {
  element: DivEl;
}

export default function DividerElement({ element }: Props) {
  if (element.style === 'line') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: '100%',
            height: element.thickness,
            backgroundColor: element.color
          }}
        />
      </div>
    );
  }

  if (element.style === 'dots') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: element.color
            }}
          />
        ))}
      </div>
    );
  }

  // Ornaments via SVG
  const ornaments: Record<string, JSX.Element> = {
    'ornament-1': (
      <svg viewBox="0 0 300 30" width="100%" height="100%" preserveAspectRatio="none">
        <line x1="0" y1="15" x2="100" y2="15" stroke={element.color} strokeWidth={element.thickness} />
        <line x1="200" y1="15" x2="300" y2="15" stroke={element.color} strokeWidth={element.thickness} />
        <circle cx="150" cy="15" r="6" fill={element.color} />
        <circle cx="130" cy="15" r="2" fill={element.color} />
        <circle cx="170" cy="15" r="2" fill={element.color} />
      </svg>
    ),
    'ornament-2': (
      <svg viewBox="0 0 300 30" width="100%" height="100%" preserveAspectRatio="none">
        <path
          d="M 0 15 Q 75 0, 150 15 T 300 15"
          stroke={element.color}
          strokeWidth={element.thickness}
          fill="none"
        />
        <circle cx="150" cy="15" r="4" fill={element.color} />
      </svg>
    ),
    'ornament-3': (
      <svg viewBox="0 0 300 30" width="100%" height="100%" preserveAspectRatio="none">
        <line x1="0" y1="15" x2="120" y2="15" stroke={element.color} strokeWidth={element.thickness} />
        <line x1="180" y1="15" x2="300" y2="15" stroke={element.color} strokeWidth={element.thickness} />
        <path
          d="M 150 8 L 156 15 L 150 22 L 144 15 Z"
          fill={element.color}
        />
      </svg>
    )
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {ornaments[element.style] || ornaments['ornament-1']}
    </div>
  );
}
