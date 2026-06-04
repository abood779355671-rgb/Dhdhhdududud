import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'تحفة — دعوات أعراس بلمسة فاخرة',
    template: '%s | تحفة'
  },
  description: 'منصة شخصية فاخرة لتصميم وإدارة دعوات الأعراس الرقمية',
  applicationName: 'تحفة',
  keywords: ['دعوات', 'زفاف', 'أعراس', 'بطاقات', 'دعوة رقمية', 'تحفة'],
  authors: [{ name: 'تحفة' }],
  creator: 'تحفة',
  publisher: 'تحفة',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url:
          'data:image/svg+xml,' +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#C9A84C"/><stop offset="100%" stop-color="#F5D78E"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="#0A0E20" stroke="url(#g)" stroke-width="2"/><text x="50" y="68" text-anchor="middle" font-family="Amiri,serif" font-size="56" font-weight="700" fill="url(#g)">ت</text></svg>'
          ),
        type: 'image/svg+xml'
      }
    ]
  },
  openGraph: {
    title: 'تحفة — دعوات أعراس بلمسة فاخرة',
    description: 'صمّم دعوات زفاف رقمية أنيقة وفاخرة بسهولة',
    type: 'website',
    locale: 'ar_SA'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0E20'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
