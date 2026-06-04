'use client';

import React from 'react';

interface Props {
  size?: number;
  className?: string;
}

/**
 * علامة اللوجو فقط (الرمز) بدون نص — للاستخدام كأيقونة
 */
export default function LogoMark({ size = 48, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="50%" stopColor="#F5D78E" />
          <stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
        <linearGradient id="lm-grad-dark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0A0E20" />
          <stop offset="100%" stopColor="#1B2347" />
        </linearGradient>
      </defs>

      {/* خلفية دائرية */}
      <circle cx="50" cy="50" r="48" fill="url(#lm-grad-dark)" stroke="url(#lm-grad)" strokeWidth="1.5" />

      {/* زخرفة خارجية — نقاط ذهبية */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const r = 42;
        const cx = 50 + r * Math.cos(rad);
        const cy = 50 + r * Math.sin(rad);
        return <circle key={angle} cx={cx} cy={cy} r="1.2" fill="url(#lm-grad)" />;
      })}

      {/* الحرف ت بأسلوب عربي فاخر */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="Amiri, serif"
        fontSize="56"
        fontWeight="700"
        fill="url(#lm-grad)"
      >
        ت
      </text>

      {/* خطوط زخرفية تحت */}
      <path
        d="M 30 82 Q 50 88 70 82"
        stroke="url(#lm-grad)"
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
