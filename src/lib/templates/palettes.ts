import { Palette } from './types';

export const PALETTES: Palette[] = [
  {
    key: 'gold-ivory',
    name: 'ذهبي عاجي',
    primary: '#C9A84C',
    secondary: '#F5D78E',
    accent: '#8C6D1F',
    background: '#FBF6E6',
    text: '#3D3013',
    muted: '#A88A3A'
  },
  {
    key: 'emerald-gold',
    name: 'زمردي ذهبي',
    primary: '#0F5132',
    secondary: '#C9A84C',
    accent: '#1B6E47',
    background: '#F4F1E8',
    text: '#0A2F1E',
    muted: '#4A7C5C'
  },
  {
    key: 'mono-noir',
    name: 'أسود وأبيض',
    primary: '#0A0A0A',
    secondary: '#FFFFFF',
    accent: '#7A7A7A',
    background: '#FAFAFA',
    text: '#0A0A0A',
    muted: '#5A5A5A'
  },
  {
    key: 'rose-blush',
    name: 'وردي ذهبي',
    primary: '#C2185B',
    secondary: '#F5D7C5',
    accent: '#E0A87E',
    background: '#FFF5F0',
    text: '#5C1E3C',
    muted: '#B07A82'
  },
  {
    key: 'boho-copper',
    name: 'بوهيمي نحاسي',
    primary: '#A0522D',
    secondary: '#E8C9A0',
    accent: '#704214',
    background: '#F5EBDA',
    text: '#4A2C18',
    muted: '#8B6F47'
  },
  {
    key: 'royal-navy',
    name: 'كحلي ملكي',
    primary: '#0A1A3F',
    secondary: '#C9A84C',
    accent: '#1B2D5C',
    background: '#F5F0E1',
    text: '#0A1226',
    muted: '#3D4F7A'
  },
  {
    key: 'nature-sage',
    name: 'طبيعي أخضر',
    primary: '#5A7A52',
    secondary: '#D9C9A8',
    accent: '#3F5A37',
    background: '#F3EFE3',
    text: '#2D3F26',
    muted: '#7D8F6F'
  },
  {
    key: 'silver-grey',
    name: 'فضي راقي',
    primary: '#5A6573',
    secondary: '#C0C5CC',
    accent: '#8A95A3',
    background: '#F0F2F5',
    text: '#2D333F',
    muted: '#7A828F'
  },
  {
    key: 'burgundy-gold',
    name: 'بورجوندي شرقي',
    primary: '#7B1F2C',
    secondary: '#C9A84C',
    accent: '#5C141F',
    background: '#F8F0E3',
    text: '#3D0F18',
    muted: '#A85060'
  },
  {
    key: 'azure-white',
    name: 'أزرق معاصر',
    primary: '#1E5B8C',
    secondary: '#E8F0F7',
    accent: '#0F3E66',
    background: '#FFFFFF',
    text: '#0A2440',
    muted: '#5A7F9F'
  }
];

export function getPalette(key: string): Palette {
  return PALETTES.find((p) => p.key === key) || PALETTES[0];
}
