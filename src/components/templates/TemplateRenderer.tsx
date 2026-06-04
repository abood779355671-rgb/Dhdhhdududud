'use client';

import React from 'react';
import { AnyElement, TemplateData } from '@/lib/templates/types';
import TextElement from './elements/TextElement';
import ImageElement from './elements/ImageElement';
import ShapeElement from './elements/ShapeElement';
import DividerElement from './elements/DividerElement';
import IconElement from './elements/IconElement';
import CountdownElement from './elements/CountdownElement';

interface Props {
  data: TemplateData;
  scale?: number;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  className?: string;
  interactive?: boolean;
}

function renderElement(el: AnyElement) {
  switch (el.type) {
    case 'text':
      return <TextElement element={el} />;
    case 'image':
      return <ImageElement element={el} />;
    case 'shape':
      return <ShapeElement element={el} />;
    case 'divider':
      return <DividerElement element={el} />;
    case 'icon':
      return <IconElement element={el} />;
    case 'countdown':
      return <CountdownElement element={el} />;
    default:
      return null;
  }
}

export default function TemplateRenderer({
  data,
  scale = 1,
  selectedId,
  onSelect,
  className = '',
  interactive = false
}: Props) {
  const { canvas, elements } = data;

  const sortedElements = [...elements]
    .filter((e) => e.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: canvas.width * scale,
        height: canvas.height * scale,
        background: canvas.background,
        overflow: 'hidden',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.4)',
        borderRadius: 4
      }}
      onClick={(e) => {
        if (interactive && onSelect && e.target === e.currentTarget) onSelect(null);
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: canvas.width,
          height: canvas.height,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
      >
        {sortedElements.map((el) => {
          const isSelected = interactive && selectedId === el.id;
          const flipTransform =
            (el.flipH ? 'scaleX(-1) ' : '') + (el.flipV ? 'scaleY(-1)' : '');
          return (
            <div
              key={el.id}
              data-id={el.id}
              onClick={(e) => {
                if (interactive && onSelect) {
                  e.stopPropagation();
                  onSelect(el.id);
                }
              }}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                transform: `rotate(${el.rotation}deg) ${flipTransform}`,
                opacity: el.opacity,
                zIndex: el.zIndex,
                cursor: interactive ? 'pointer' : 'default',
                outline: isSelected ? '2px dashed #C9A84C' : 'none',
                outlineOffset: 2
              }}
            >
              {renderElement(el)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
