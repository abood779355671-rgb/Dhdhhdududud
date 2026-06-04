import type { Metadata } from 'next';
  export const metadata: Metadata = { title: 'دعوة زفاف' };
  export default function InvitationLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }
  