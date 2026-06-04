'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TemplateData } from '@/lib/templates/types';
import TemplateRenderer from './TemplateRenderer';

interface Props {
  data: TemplateData;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

export default function TemplatePreview({
  data,
  maxWidth = 320,
  maxHeight = 480,
  className = ''
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const sw = maxWidth / data.canvas.width;
    const sh = maxHeight / data.canvas.height;
    setScale(Math.min(sw, sh));
  }, [maxWidth, maxHeight, data.canvas.width, data.canvas.height]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: data.canvas.width * scale,
        height: data.canvas.height * scale
      }}
    >
      <TemplateRenderer data={data} scale={scale} />
    </div>
  );
}
