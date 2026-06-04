import { DESIGNS, getDesign } from './designs';
import { PALETTES, getPalette } from './palettes';
import { FONTS, getFont } from './fonts';
import { DEFAULT_CONTENT } from './defaults';
import { TemplateContent, TemplateData, AnyElement } from './types';

export interface BuildOptions {
  designKey: string;
  colorKey: string;
  fontKey: string;
  content?: Partial<TemplateContent>;
  name?: string;
  description?: string;
}

export function buildTemplate(options: BuildOptions): TemplateData {
  const design = getDesign(options.designKey);
  const palette = getPalette(options.colorKey);
  const font = getFont(options.fontKey);
  const content: TemplateContent = { ...DEFAULT_CONTENT, ...options.content };

  const elements = design.build(palette, font, content);

  const now = new Date().toISOString();
  return {
    version: 1,
    designKey: design.key,
    colorKey: palette.key,
    fontKey: font.key,
    canvas: { ...design.canvas, background: design.canvas.background },
    elements,
    content,
    meta: {
      name: options.name || `${design.name} — ${palette.name} — ${font.name}`,
      description: options.description || design.description,
      createdAt: now,
      updatedAt: now
    }
  };
}

export function rebuildElements(data: TemplateData): AnyElement[] {
  const design = getDesign(data.designKey);
  const palette = getPalette(data.colorKey);
  const font = getFont(data.fontKey);
  return design.build(palette, font, data.content);
}

export function listAllCombinations() {
  const combos: { designKey: string; colorKey: string; fontKey: string }[] = [];
  for (const d of DESIGNS) {
    for (const p of PALETTES) {
      for (const f of FONTS) {
        combos.push({ designKey: d.key, colorKey: p.key, fontKey: f.key });
      }
    }
  }
  return combos;
}

export function validateTemplateData(data: unknown): data is TemplateData {
  if (!data || typeof data !== 'object') return false;
  const d = data as TemplateData;
  return (
    typeof d.version === 'number' &&
    typeof d.designKey === 'string' &&
    typeof d.colorKey === 'string' &&
    typeof d.fontKey === 'string' &&
    Array.isArray(d.elements) &&
    !!d.canvas &&
    !!d.content
  );
}

export function serializeTemplate(data: TemplateData): string {
  return JSON.stringify(data, null, 2);
}

export function parseTemplate(json: string): TemplateData {
  const parsed = JSON.parse(json);
  if (!validateTemplateData(parsed)) {
    throw new Error('بنية القالب غير صالحة');
  }
  return parsed;
}
