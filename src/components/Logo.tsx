'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  showTagline?: boolean;
  className?: string;
  variant?: 'full' | 'minimal' | 'dark';
}

export default function Logo({
  size = 80,
  showTagline = false,
  className = '',
  variant = 'full'
}: LogoProps) {
  const id = React.useId().replace(/:/g, '');

  return (
    <div className={`flex flex-col items-center gap-2 select-none ${className}`}>
      <div
        className="flex items-center justify-center"
        style={{ height: size, width: size * 2.4 }}
      >
        <svg
          viewBox="0 0 240 110"
          width={size * 2.4}
          height={size}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="تحفة"
        >
          <defs>
            <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C9A84C">
                <animate
                  attributeName="stop-color"
                  values="#C9A84C; #F5D78E; #C9A84C"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#F5D78E">
                <animate
                  attributeName="stop-color"
                  values="#F5D78E; #C9A84C; #F5D78E"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#C9A84C">
                <animate
                  attributeName="stop-color"
                  values="#C9A84C; #F5D78E; #C9A84C"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            <filter id={`glow-${id}`}>
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* الزخرفة العلوية اليسرى */}
          <g opacity="0.9">
            <path
              d="M 10 25 Q 30 15, 60 22"
              stroke={`url(#grad-${id})`}
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="10" cy="25" r="1.6" fill={`url(#grad-${id})`} />
            <circle cx="60" cy="22" r="1.6" fill={`url(#grad-${id})`} />
          </g>

          {/* الزخرفة العلوية اليمنى */}
          <g opacity="0.9">
            <path
              d="M 180 22 Q 210 15, 230 25"
              stroke={`url(#grad-${id})`}
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="180" cy="22" r="1.6" fill={`url(#grad-${id})`} />
            <circle cx="230" cy="25" r="1.6" fill={`url(#grad-${id})`} />
          </g>

          {/* زخرفة المنتصف العلوية — نجمة صغيرة */}
          <g transform="translate(120, 17)">
            <path
              d="M 0 -7 L 1.5 -2 L 7 -2 L 2.5 1.5 L 4 7 L 0 4 L -4 7 L -2.5 1.5 L -7 -2 L -1.5 -2 Z"
              fill={`url(#grad-${id})`}
              opacity="0.85"
            />
          </g>

          {/* النص الرئيسي تحفة */}
          <text
            x="120"
            y="75"
            textAnchor="middle"
            fontFamily="Amiri, 'Noto Naskh Arabic', serif"
            fontSize="50"
            fontWeight="700"
            fill={`url(#grad-${id})`}
            filter={`url(#glow-${id})`}
            style={{ letterSpacing: '2px' }}
          >
            تحفة
          </text>

          {/* الزخرفة السفلية */}
          <g opacity="0.9">
            <path
              d="M 30 92 Q 120 102, 210 92"
              stroke={`url(#grad-${id})`}
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="30" cy="92" r="1.6" fill={`url(#grad-${id})`} />
            <circle cx="210" cy="92" r="1.6" fill={`url(#grad-${id})`} />
            <circle cx="120" cy="98" r="2.2" fill={`url(#grad-${id})`} />
            <circle cx="100" cy="96" r="1.2" fill={`url(#grad-${id})`} opacity="0.7" />
            <circle cx="140" cy="96" r="1.2" fill={`url(#grad-${id})`} opacity="0.7" />
          </g>
        </svg>
      </div>

      {showTagline && (
        <p
          className="text-gold-100 text-xs md:text-sm font-naskh tracking-[0.3em] opacity-80"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(245,215,142,0.9), transparent)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: variant === 'dark' ? '#8C6D1F' : undefined
          }}
        >
          دعوات أعراس بلمسة فاخرة
        </p>
      )}
    </div>
  );
}
