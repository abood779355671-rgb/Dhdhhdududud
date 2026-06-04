'use client';

import React, { useRef, useState } from 'react';
import { useEditorStore } from '@/lib/editor/store';
import ElementWrapper from './ElementWrapper';
import SmartGuides from './SmartGuides';
import { AlignmentGuide } from '@/lib/editor/utils';

export default function EditorCanvas() {
  const data = useEditorStore((s) => s.data);
  const zoom = useEditorStore((s) => s.zoom);
  const showGrid = useEditorStore((s) => s.showGrid);
  const gridSize = useEditorStore((s) => s.gridSize);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);

  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedElements = [...data.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-auto flex items-start justify-center p-8 bg-navy-900/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) clearSelection();
      }}
    >
      <div
        style={{
          width: data.canvas.width * zoom,
          height: data.canvas.height * zoom,
          flexShrink: 0
        }}
      >
        <div
          style={{
            position: 'relative',
            width: data.canvas.width,
            height: data.canvas.height,
            background: data.canvas.background,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) clearSelection();
          }}
        >
          {/* Grid */}
          {showGrid && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(to right, rgba(201,168,76,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,168,76,0.15) 1px, transparent 1px)',
                backgroundSize: `${gridSize}px ${gridSize}px`,
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
          )}

          {sortedElements.map((el) => (
            <ElementWrapper
              key={el.id}
              element={el}
              selected={selectedIds.includes(el.id)}
              zoom={zoom}
              onGuides={setGuides}
            />
          ))}

          <SmartGuides
            guides={guides}
            canvasWidth={data.canvas.width}
            canvasHeight={data.canvas.height}
          />
        </div>
      </div>
    </div>
  );
}
