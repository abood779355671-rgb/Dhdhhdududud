'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

interface NavItem {
  href: string;
  label: string;
}

interface Props {
  items?: NavItem[];
  rightSlot?: React.ReactNode;
  variant?: 'transparent' | 'solid';
}

export default function Navbar({ items = [], rightSlot, variant = 'solid' }: Props) {
  const pathname = usePathname();

  return (
    <nav
      className={`sticky top-0 z-40 border-b border-gold-500/20 backdrop-blur-md ${
        variant === 'transparent' ? 'bg-navy-900/50' : 'bg-navy-900/85'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="hover:opacity-90 transition">
          <Logo size={42} />
        </Link>

        {items.length > 0 && (
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-naskh transition ${
                    active
                      ? 'bg-gold-gradient text-navy-900 font-bold'
                      : 'text-gold-100/80 hover:bg-gold-500/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {rightSlot}
      </div>
    </nav>
  );
}
