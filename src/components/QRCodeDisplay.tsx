'use client';

import React, { useEffect, useState } from 'react';
import { generateQRDataURL } from '@/lib/qrcode';
import { Download } from 'lucide-react';

interface Props {
  value: string;
  size?: number;
  showDownload?: boolean;
  filename?: string;
  dark?: string;
  light?: string;
}

export default function QRCodeDisplay({
  value,
  size = 240,
  showDownload = true,
  filename = 'qrcode.png',
  dark = '#0A0E20',
  light = '#FFFFFF'
}: Props) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    generateQRDataURL(value, { size: size * 2, dark, light })
      .then(setDataUrl)
      .catch(() => setDataUrl(''));
  }, [value, size, dark, light]);

  const download = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="rounded-xl bg-white p-2 shadow-lg"
        />
      ) : (
        <div
          className="rounded-xl bg-navy-800 animate-pulse"
          style={{ width: size, height: size }}
        />
      )}
      {showDownload && dataUrl && (
        <button
          onClick={download}
          className="px-3 py-1.5 rounded-lg border border-gold-500/40 text-gold-100 hover:bg-gold-500/10 text-xs flex items-center gap-1 font-naskh"
        >
          <Download size={12} /> تحميل QR
        </button>
      )}
    </div>
  );
}
