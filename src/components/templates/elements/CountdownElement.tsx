'use client';

import React, { useEffect, useState } from 'react';
import { CountdownElement as CDEl } from '@/lib/templates/types';
import { getFont } from '@/lib/templates/fonts';

interface Props {
  element: CDEl;
}

function diffParts(target: Date) {
  const now = Date.now();
  const ms = Math.max(0, target.getTime() - now);
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;
  return { days, hours, minutes, seconds };
}

export default function CountdownElement({ element }: Props) {
  const target = new Date(element.targetDate);
  const [t, setT] = useState(() => diffParts(target));
  const font = getFont(element.fontKey);

  useEffect(() => {
    const id = setInterval(() => setT(diffParts(target)), 1000);
    return () => clearInterval(id);
  }, [element.targetDate]);

  const Box = ({ value, label }: { value: number; label: string }) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
      }}
    >
      <div
        style={{
          fontFamily: font.cssFamily,
          fontSize: element.fontSize,
          fontWeight: 700,
          color: element.color,
          lineHeight: 1
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: font.cssFamily,
          fontSize: Math.max(12, element.fontSize * 0.3),
          color: element.labelColor,
          marginTop: 4
        }}
      >
        {label}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: 16,
        direction: 'rtl'
      }}
    >
      <Box value={t.days} label="يوم" />
      <Box value={t.hours} label="ساعة" />
      <Box value={t.minutes} label="دقيقة" />
      <Box value={t.seconds} label="ثانية" />
    </div>
  );
}
