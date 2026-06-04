'use client';

import React, { useState } from 'react';

interface Props {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  '#C9A84C', '#F5D78E', '#0A0E20', '#FFFFFF', '#000000',
  '#7B1F2C', '#0F5132', '#1E5B8C', '#C2185B', '#A0522D',
  '#5A7A52', '#5A6573', '#0A1A3F', '#8C6D1F', '#704214',
  'transparent'
];

export default function ColorPicker({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);

  const handleHex = (v: string) => {
    setHex(v);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v) || v === 'transparent') {
      onChange(v);
    }
  };

  return (
    <div className="relative">
      {label && <label className="block text-gold-100/70 text-xs mb-1 font-naskh">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 rounded-lg border border-gold-500/30 flex items-center gap-2 px-2 hover:border-gold-500/60 transition"
      >
        <div
          className="w-6 h-6 rounded border border-white/20"
          style={{
            background:
              value === 'transparent'
                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%)'
                : value,
            backgroundSize: '8px 8px'
          }}
        />
        <span className="text-xs text-gold-100/80 font-mono">{value}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 p-3 rounded-xl bg-navy-800 border border-gold-500/40 shadow-2xl right-0 w-64">
          <div className="grid grid-cols-8 gap-1 mb-3">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setHex(c);
                }}
                className="w-6 h-6 rounded border border-white/20 hover:scale-110 transition"
                style={{
                  background:
                    c === 'transparent'
                      ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%)'
                      : c,
                  backgroundSize: '6px 6px'
                }}
              />
            ))}
          </div>
          <input
            type="color"
            value={value === 'transparent' ? '#ffffff' : value}
            onChange={(e) => {
              onChange(e.target.value);
              setHex(e.target.value);
            }}
            className="w-full h-8 rounded cursor-pointer mb-2"
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHex(e.target.value)}
            className="input-gold text-xs"
            placeholder="#C9A84C"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 w-full text-xs py-1 rounded bg-gold-500/20 text-gold-100 hover:bg-gold-500/30"
          >
            إغلاق
          </button>
        </div>
      )}
    </div>
  );
}
