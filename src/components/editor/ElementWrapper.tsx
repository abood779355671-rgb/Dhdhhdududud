'use client';

import React, { useRef, useState } from 'react';
import { AnyElement } from '@/lib/templates/types';
import { useEditorStore } from '@/lib/editor/store';
import { computeAlignmentGuides, snapValue, AlignmentGuide } from '@/lib/editor/utils';
import TextElement from '@/components/templates/elements/TextElement';
import ImageElement from '@/components/templates/elements/ImageElement';
import ShapeElement from '@/components/templates/elements/ShapeElement';
import DividerElement from '@/components/templates/elements/DividerElement';
import IconElement from '@/components/templates/elements/IconElement';
import CountdownElement from '@/components/templates/elements/CountdownElement';

interface Props {
  element: AnyElement;
  selected: boolean;
  zoom: number;
  onGuides: (guides: AlignmentGuide[]) => void;
}

type DragMode =
  | null
  | 'move'
  | 'resize-nw'
  | 'resize-ne'
  | 'resize-sw'
  | 'resize-se'
  | 'rotate';

export default function ElementWrapper({ element, selected, zoom, onGuides }: Props) {
  const store = useEditorStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);
  const dragMode = useRef<DragMode>(null);
  const dragStart = useRef<{
    mx: number;
    my: number;
    el: AnyElement;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, mode: DragMode) => {
    if (element.locked) return;
    e.stopPropagation();
    e.preventDefault();

    if (!selected) {
      if (e.shiftKey) store.addToSelection(element.id);
      else store.setSelected([element.id]);
    }

    dragMode.current = mode;
    dragStart.current = { mx: e.clientX, my: e.clientY, el: { ...element } };

    const move = (ev: MouseEvent) => {
      if (!dragStart.current || !dragMode.current) return;
      const dx = (ev.clientX - dragStart.current.mx) / zoom;
      const dy = (ev.clientY - dragStart.current.my) / zoom;
      const start = dragStart.current.el;
      const s = useEditorStore.getState();

      if (dragMode.current === 'move') {
        let nx = start.x + dx;
        let ny = start.y + dy;

        nx = snapValue(nx, s.gridSize, s.snapToGrid);
        ny = snapValue(ny, s.gridSize, s.snapToGrid);

        // Smart Guides
        if (s.showGuides) {
          const test = { ...start, x: nx, y: ny };
          const { guides, snapX, snapY } = computeAlignmentGuides(
            test,
            s.data.elements,
            s.data.canvas.width,
            s.data.canvas.height
          );
          if (snapX !== null) nx = snapX;
          if (snapY !== null) ny = snapY;
          onGuides(guides);
        }

        s.updateElement(element.id, { x: nx, y: ny });
      } else if (dragMode.current?.startsWith('resize')) {
        let nx = start.x;
        let ny = start.y;
        let nw = start.width;
        let nh = start.height;

        if (dragMode.current === 'resize-se') {
          nw = Math.max(20, start.width + dx);
          nh = Math.max(20, start.height + dy);
        } else if (dragMode.current === 'resize-sw') {
          nw = Math.max(20, start.width - dx);
          nh = Math.max(20, start.height + dy);
          nx = start.x + dx;
        } else if (dragMode.current === 'resize-ne') {
          nw = Math.max(20, start.width + dx);
          nh = Math.max(20, start.height - dy);
          ny = start.y + dy;
        } else if (dragMode.current === 'resize-nw') {
          nw = Math.max(20, start.width - dx);
          nh = Math.max(20, start.height - dy);
          nx = start.x + dx;
          ny = start.y + dy;
        }

        // قفل النسبة عند Shift
        if (ev.shiftKey) {
          const ratio = start.width / start.height;
          nh = nw / ratio;
        }

        s.updateElement(element.id, { x: nx, y: ny, width: nw, height: nh });
      } else if (dragMode.current === 'rotate') {
        const rect = wrapperRef.current?.getBoundingClientRect();
        if (rect) {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const angle = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90;
          s.updateElement(element.id, { rotation: Math.round(angle) });
        }
      }
    };

    const up = () => {
      dragMode.current = null;
      dragStart.current = null;
      onGuides([]);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const handleDoubleClick = () => {
    if (element.type === 'text' && !element.locked) {
      setEditing(true);
    }
  };

  const renderContent = () => {
    if (element.type === 'text' && editing) {
      return (
        <textarea
          autoFocus
          value={element.content}
          onChange={(e) => store.updateElement(element.id, { content: e.target.value })}
          onBlur={() => setEditing(false)}
          style={{
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: '2px solid #C9A84C',
            outline: 'none',
            resize: 'none',
            fontFamily: 'inherit',
            fontSize: element.fontSize,
            color: element.color,
            textAlign: element.textAlign,
            lineHeight: element.lineHeight,
            letterSpacing: element.letterSpacing,
            padding: 4,
            direction: 'rtl'
          }}
        />
      );
    }
    switch (element.type) {
      case 'text': return <TextElement element={element} />;
      case 'image': return <ImageElement element={element} />;
      case 'shape': return <ShapeElement element={element} />;
      case 'divider': return <DividerElement element={element} />;
      case 'icon': return <IconElement element={element} />;
      case 'countdown': return <CountdownElement element={element} />;
      default: return null;
    }
  };

  if (!element.visible) return null;

  const flipTransform =
    (element.flipH ? 'scaleX(-1) ' : '') + (element.flipV ? 'scaleY(-1)' : '');

  return (
    <div
      ref={wrapperRef}
      onMouseDown={(e) => handleMouseDown(e, 'move')}
      onDoubleClick={handleDoubleClick}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg) ${flipTransform}`,
        opacity: element.opacity,
        zIndex: element.zIndex,
        cursor: element.locked ? 'not-allowed' : selected ? 'move' : 'pointer',
        outline: selected
          ? '2px solid #C9A84C'
          : element.locked
            ? '1px dashed rgba(255,100,100,0.5)'
            : 'none',
        outlineOffset: 0
      }}
    >
      {renderContent()}

      {selected && !editing && !element.locked && (
        <>
          {/* Resize handles */}
          {(['nw', 'ne', 'sw', 'se'] as const).map((corner) => {
            const positions: Record<string, React.CSSProperties> = {
              nw: { top: -6, left: -6, cursor: 'nwse-resize' },
              ne: { top: -6, right: -6, cursor: 'nesw-resize' },
              sw: { bottom: -6, left: -6, cursor: 'nesw-resize' },
              se: { bottom: -6, right: -6, cursor: 'nwse-resize' }
            };
            return (
              <div
                key={corner}
                onMouseDown={(e) => handleMouseDown(e, `resize-${corner}` as DragMode)}
                style={{
                  position: 'absolute',
                  width: 12,
                  height: 12,
                  background: '#C9A84C',
                  border: '2px solid #fff',
                  borderRadius: '50%',
                  zIndex: 10000,
                  ...positions[corner]
                }}
              />
            );
          })}
          {/* Rotate handle */}
          <div
            onMouseDown={(e) => handleMouseDown(e, 'rotate')}
            style={{
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 14,
              height: 14,
              background: '#10B981',
              border: '2px solid #fff',
              borderRadius: '50%',
              cursor: 'grab',
              zIndex: 10000
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 1,
              height: 16,
              background: '#10B981',
              zIndex: 9999
            }}
          />
        </>
      )}
    </div>
  );
}
