import { FontPack } from './types';

export const FONTS: FontPack[] = [
  {
    key: 'amiri',
    name: 'أميري',
    family: 'Amiri',
    cssFamily: "'Amiri', serif",
    weights: [400, 700],
    arabic: true
  },
  {
    key: 'noto-naskh',
    name: 'نسخ',
    family: 'Noto Naskh Arabic',
    cssFamily: "'Noto Naskh Arabic', serif",
    weights: [400, 500, 600, 700],
    arabic: true
  },
  {
    key: 'scheherazade',
    name: 'شهرزاد',
    family: 'Scheherazade New',
    cssFamily: "'Scheherazade New', serif",
    weights: [400, 700],
    arabic: true
  },
  {
    key: 'cairo',
    name: 'القاهرة',
    family: 'Cairo',
    cssFamily: "'Cairo', sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    arabic: true
  },
  {
    key: 'tajawal',
    name: 'تجوال',
    family: 'Tajawal',
    cssFamily: "'Tajawal', sans-serif",
    weights: [300, 400, 500, 700, 800],
    arabic: true
  },
  {
    key: 'reem-kufi',
    name: 'ريم كوفي',
    family: 'Reem Kufi',
    cssFamily: "'Reem Kufi', sans-serif",
    weights: [400, 500, 600, 700],
    arabic: true
  },
  {
    key: 'lateef',
    name: 'لطيف',
    family: 'Lateef',
    cssFamily: "'Lateef', serif",
    weights: [400, 700],
    arabic: true
  },
  {
    key: 'markazi',
    name: 'مركزي',
    family: 'Markazi Text',
    cssFamily: "'Markazi Text', serif",
    weights: [400, 500, 600, 700],
    arabic: true
  },
  {
    key: 'aref-ruqaa',
    name: 'عارف رقعة',
    family: 'Aref Ruqaa',
    cssFamily: "'Aref Ruqaa', serif",
    weights: [400, 700],
    arabic: true
  },
  {
    key: 'mada',
    name: 'مدى',
    family: 'Mada',
    cssFamily: "'Mada', sans-serif",
    weights: [300, 400, 500, 600, 700, 900],
    arabic: true
  }
];

export function getFont(key: string): FontPack {
  return FONTS.find((f) => f.key === key) || FONTS[0];
}

export const FONTS_GOOGLE_URL =
  'https://fonts.googleapis.com/css2?' +
  [
    'family=Amiri:wght@400;700',
    'family=Noto+Naskh+Arabic:wght@400;500;600;700',
    'family=Scheherazade+New:wght@400;700',
    'family=Cairo:wght@300;400;500;600;700;800',
    'family=Tajawal:wght@300;400;500;700;800',
    'family=Reem+Kufi:wght@400;500;600;700',
    'family=Lateef:wght@400;700',
    'family=Markazi+Text:wght@400;500;600;700',
    'family=Aref+Ruqaa:wght@400;700',
    'family=Mada:wght@300;400;500;600;700;900'
  ].join('&') +
  '&display=swap';
