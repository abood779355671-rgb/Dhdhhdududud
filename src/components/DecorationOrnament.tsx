'use client';

import React from 'react';

interface Props {
  variant?: 'top' | 'bottom' | 'divider' | 'corner';
  color?: string;
  width?: number;
  className?: string;
}

export default function DecorationOrnament({
  variant = 'divider',
  color = '#C9A84C',
  width = 200,
  className = ''
}: Props) {
  if (variant === 'divider') {
    return (
      <svg
        width={width}
        height={24}
        viewBox="0 0 200 24"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="20" y1="12" x2="80" y2="12" stroke={color} strokeWidth="1" opacity="0.6" />
        <line x1="120" y1="12" x2="180" y2="12" stroke={color} strokeWidth="1" opacity="0.6" />
        <path
          d="M 100 4 L 104 12 L 100 20 L 96 12 Z"
          fill={color}
        />
        <circle cx="85" cy="12" r="2" fill={color} opacity="0.8" />
        <circle cx="115" cy="12" r="2" fill={color} opacity="0.8" />
      </svg>
    );
  }

  if (variant === 'top') {
    return (
      <svg
        width={width}
        height={30}
        viewBox="0 0 200 30"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 20 Q 100 5, 190 20"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="100" cy="12" r="3" fill={color} />
        <circle cx="10" cy="20" r="2" fill={color} />
        <circle cx="190" cy="20" r="2" fill={color} />
      </svg>
    );
  }

  if (variant === 'bottom') {
    return (
      <svg
        width={width}
        height={30}
        viewBox="0 0 200 30"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 10 10 Q 100 25, 190 10"
          stroke={color}
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="100" cy="18" r="3" fill={color} />
        <circle cx="10" cy="10" r="2" fill={color} />
        <circle cx="190" cy="10" r="2" fill={color} />
      </svg>
    );
  }

  // corner
  return (
    <svg
      width={width}
      height={width}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M 5 5 L 5 35 M 5 5 L 35 5"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 10 10 L 10 25 M 10 10 L 25 10"
        stroke={color}
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      <circle cx="5" cy="5" r="2" fill={color} />
    </svg>
  );
}
