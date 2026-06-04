'use client';

import React from 'react';
import Logo from './Logo';

interface Props {
  fullScreen?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ fullScreen = false, label, size = 'md' }: Props) {
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`${dotSize} rounded-full`}
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #F5D78E)',
              animation: `loadingBounce 1.2s ease-in-out ${i * 0.12}s infinite`
            }}
          />
        ))}
      </div>
      {label && (
        <p className="text-sm text-gold-100/70 font-naskh tracking-wider">{label}</p>
      )}
      <style jsx>{`
        @keyframes loadingBounce {
          0%, 80%, 100% {
            transform: translateY(0) scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: translateY(-8px) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
        style={{
          background:
            'radial-gradient(circle at center, #121833 0%, #0a0e20 70%, #050813 100%)'
        }}
      >
        <Logo size={70} />
        {spinner}
      </div>
    );
  }

  return spinner;
}
