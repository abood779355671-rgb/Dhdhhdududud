'use client';

import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export default function SplashScreen({ onFinish, duration = 2500 }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit' | 'done'>('enter');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 100);
    const t2 = setTimeout(() => setPhase('exit'), duration - 500);
    const t3 = setTimeout(() => {
      setPhase('done');
      onFinish?.();
    }, duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [duration, onFinish]);

  if (phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ${
        phase === 'exit' ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at center, #1B2347 0%, #0a0e20 60%, #050813 100%)'
      }}
    >
      {/* زخارف بصرية متحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* دوائر ضوئية ذهبية */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] animate-pulse"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent 60%)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, #F5D78E, transparent 60%)',
            animationDelay: '1s'
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-10 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }}
        />

        {/* جسيمات ذهبية متطايرة */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-50"
            style={{
              width: `${2 + (i % 4)}px`,
              height: `${2 + (i % 4)}px`,
              background: i % 2 ? '#C9A84C' : '#F5D78E',
              top: `${(i * 7) % 100}%`,
              left: `${(i * 13) % 100}%`,
              animation: `floatParticle ${4 + (i % 5)}s ease-in-out ${i * 0.2}s infinite`
            }}
          />
        ))}
      </div>

      {/* المحتوى الرئيسي */}
      <div
        className={`relative flex flex-col items-center gap-8 transition-all duration-700 ${
          phase === 'enter'
            ? 'opacity-0 scale-90 translate-y-4'
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* إطار ذهبي مزخرف حول اللوجو */}
        <div className="relative">
          {/* زخرفة علوية */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <svg width="120" height="20" viewBox="0 0 120 20">
              <defs>
                <linearGradient id="splash-orn-top" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#F5D78E" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M 0 10 Q 60 0, 120 10"
                stroke="url(#splash-orn-top)"
                strokeWidth="1.2"
                fill="none"
              />
              <circle cx="60" cy="6" r="2" fill="#F5D78E" />
            </svg>
          </div>

          <Logo size={130} showTagline={false} />

          {/* زخرفة سفلية */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <svg width="120" height="20" viewBox="0 0 120 20">
              <defs>
                <linearGradient id="splash-orn-bot" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#C9A84C" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M 0 10 Q 60 20, 120 10"
                stroke="url(#splash-orn-bot)"
                strokeWidth="1.2"
                fill="none"
              />
              <circle cx="60" cy="14" r="2" fill="#C9A84C" />
            </svg>
          </div>
        </div>

        {/* الوسم */}
        <div className="text-center space-y-2 mt-6">
          <p
            className="text-base md:text-lg font-naskh tracking-[0.4em] font-light"
            style={{
              background: 'linear-gradient(90deg, #C9A84C 0%, #F5D78E 50%, #C9A84C 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite'
            }}
          >
            دعوات أعراس بلمسة فاخرة
          </p>
        </div>

        {/* مؤشر التحميل */}
        <div className="flex gap-2 items-center mt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #F5D78E)',
                animation: `splashDot 1.4s ease-in-out ${i * 0.15}s infinite`
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(20px, -30px);
            opacity: 0.8;
          }
        }
        @keyframes splashDot {
          0%, 80%, 100% {
            transform: scale(0.7);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
