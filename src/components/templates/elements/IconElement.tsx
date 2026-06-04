'use client';

import React from 'react';
import { IconElement as IconEl } from '@/lib/templates/types';
import { Heart, Crown, Leaf, Star, Flower, Gem, Sparkles, Music } from 'lucide-react';

interface Props {
  element: IconEl;
}

const ICONS: Record<string, React.ComponentType<any>> = {
  Heart,
  Crown,
  Leaf,
  Star,
  Flower,
  Gem,
  Sparkles,
  Music
};

export default function IconElement({ element }: Props) {
  const Icon = ICONS[element.name] || Heart;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Icon size={Math.min(element.width, element.height)} color={element.color} />
    </div>
  );
}
