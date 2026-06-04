import { AnyElement } from '@/lib/templates/types';
import { nanoid } from 'nanoid';

export function genId(prefix = 'el'): string {
  return `${prefix}_${nanoid(8)}`;
}

export function cloneElement<T extends AnyElement>(el: T, offset = 20): T {
  return {
    ...el,
    id: genId(el.type),
    x: el.x + offset,
    y: el.y + offset
  };
}

export function snapValue(value: number, gridSize: number, enabled: boolean): number {
  if (!enabled) return value;
  return Math.round(value / gridSize) * gridSize;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getElementCenter(el: AnyElement) {
  return { cx: el.x + el.width / 2, cy: el.y + el.height / 2 };
}

export function getElementBounds(el: AnyElement) {
  return {
    left: el.x,
    top: el.y,
    right: el.x + el.width,
    bottom: el.y + el.height,
    cx: el.x + el.width / 2,
    cy: el.y + el.height / 2
  };
}

/**
 * يحسب أقرب خطوط محاذاة بين العنصر المسحوب وبقية العناصر
 */
export interface AlignmentGuide {
  type: 'v' | 'h';
  position: number;
  offset?: number;
}

const SNAP_THRESHOLD = 6;

export function computeAlignmentGuides(
  active: AnyElement,
  others: AnyElement[],
  canvasW: number,
  canvasH: number
): { guides: AlignmentGuide[]; snapX: number | null; snapY: number | null } {
  const guides: AlignmentGuide[] = [];
  const a = getElementBounds(active);

  let snapX: number | null = null;
  let snapY: number | null = null;

  // مركز الكنفاس
  const canvasCx = canvasW / 2;
  const canvasCy = canvasH / 2;
  if (Math.abs(a.cx - canvasCx) < SNAP_THRESHOLD) {
    guides.push({ type: 'v', position: canvasCx });
    snapX = canvasCx - active.width / 2;
  }
  if (Math.abs(a.cy - canvasCy) < SNAP_THRESHOLD) {
    guides.push({ type: 'h', position: canvasCy });
    snapY = canvasCy - active.height / 2;
  }

  for (const o of others) {
    if (o.id === active.id) continue;
    const b = getElementBounds(o);

    // محاذاة عمودية
    const vTargets = [
      { source: a.left, target: b.left },
      { source: a.right, target: b.right },
      { source: a.cx, target: b.cx },
      { source: a.left, target: b.right },
      { source: a.right, target: b.left }
    ];
    for (const t of vTargets) {
      if (Math.abs(t.source - t.target) < SNAP_THRESHOLD) {
        guides.push({ type: 'v', position: t.target });
        if (snapX === null) snapX = active.x + (t.target - t.source);
        break;
      }
    }

    // محاذاة أفقية
    const hTargets = [
      { source: a.top, target: b.top },
      { source: a.bottom, target: b.bottom },
      { source: a.cy, target: b.cy },
      { source: a.top, target: b.bottom },
      { source: a.bottom, target: b.top }
    ];
    for (const t of hTargets) {
      if (Math.abs(t.source - t.target) < SNAP_THRESHOLD) {
        guides.push({ type: 'h', position: t.target });
        if (snapY === null) snapY = active.y + (t.target - t.source);
        break;
      }
    }
  }

  return { guides, snapX, snapY };
}

export function createElement(type: AnyElement['type'], x = 100, y = 100): AnyElement {
  const base = {
    id: genId(type),
    x,
    y,
    rotation: 0,
    opacity: 1,
    zIndex: 10,
    locked: false,
    visible: true,
    flipH: false,
    flipV: false
  };

  switch (type) {
    case 'text':
      return {
        ...base,
        type: 'text',
        width: 300,
        height: 60,
        content: 'نص جديد',
        fontKey: 'amiri',
        fontSize: 28,
        fontWeight: 400,
        color: '#C9A84C',
        textAlign: 'center',
        lineHeight: 1.4,
        letterSpacing: 0
      };
    case 'image':
      return {
        ...base,
        type: 'image',
        width: 200,
        height: 200,
        src: '',
        alt: 'صورة',
        borderRadius: 0,
        borderWidth: 0,
        borderColor: '#C9A84C',
        objectFit: 'cover'
      };
    case 'shape':
      return {
        ...base,
        type: 'shape',
        width: 150,
        height: 150,
        shape: 'rect',
        fill: '#C9A84C',
        stroke: 'transparent',
        strokeWidth: 0,
        borderRadius: 0
      };
    case 'divider':
      return {
        ...base,
        type: 'divider',
        width: 240,
        height: 30,
        style: 'ornament-1',
        color: '#C9A84C',
        thickness: 2
      };
    case 'icon':
      return {
        ...base,
        type: 'icon',
        width: 60,
        height: 60,
        name: 'Heart',
        color: '#C9A84C'
      };
    case 'countdown':
      return {
        ...base,
        type: 'countdown',
        width: 500,
        height: 100,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        color: '#C9A84C',
        labelColor: '#888888',
        fontKey: 'amiri',
        fontSize: 48
      };
    default:
      return {
        ...base,
        type: 'shape',
        width: 100,
        height: 100,
        shape: 'rect',
        fill: '#C9A84C',
        stroke: 'transparent',
        strokeWidth: 0,
        borderRadius: 0
      } as AnyElement;
  }
}
