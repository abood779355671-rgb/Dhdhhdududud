export type ElementType =
  | 'text'
  | 'image'
  | 'shape'
  | 'divider'
  | 'icon'
  | 'countdown'
  | 'gallery'
  | 'map'
  | 'qrcode';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  flipH: boolean;
  flipV: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontKey: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'right' | 'center' | 'left' | 'justify';
  lineHeight: number;
  letterSpacing: number;
  textShadow?: string;
  gradient?: { from: string; to: string };
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  objectFit: 'cover' | 'contain' | 'fill';
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shape: 'rect' | 'circle' | 'ellipse' | 'frame';
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius: number;
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  style: 'line' | 'ornament-1' | 'ornament-2' | 'ornament-3' | 'dots';
  color: string;
  thickness: number;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  name: string;
  color: string;
}

export interface CountdownElement extends BaseElement {
  type: 'countdown';
  targetDate: string;
  color: string;
  labelColor: string;
  fontKey: string;
  fontSize: number;
}

export interface GalleryElement extends BaseElement {
  type: 'gallery';
  images: string[];
  columns: number;
  gap: number;
  borderRadius: number;
}

export interface MapElement extends BaseElement {
  type: 'map';
  lat: number;
  lng: number;
  zoom: number;
  borderRadius: number;
  label?: string;
}

export interface QRCodeElement extends BaseElement {
  type: 'qrcode';
  value: string;
  fg: string;
  bg: string;
}

export type AnyElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | DividerElement
  | IconElement
  | CountdownElement
  | GalleryElement
  | MapElement
  | QRCodeElement;

export interface Palette {
  key: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  muted: string;
}

export interface FontPack {
  key: string;
  name: string;
  family: string;
  cssFamily: string;
  weights: number[];
  arabic: boolean;
}

export interface DesignBlueprint {
  key: string;
  name: string;
  description: string;
  category: string;
  canvas: {
    width: number;
    height: number;
    background: string;
    backgroundPattern?: string;
  };
  /**
   * Function يبني العناصر بناءً على Palette و FontPack ومحتوى ديناميكي
   */
  build: (
    palette: Palette,
    font: FontPack,
    content: TemplateContent
  ) => AnyElement[];
  thumbnailGradient: string;
}

export interface TemplateContent {
  brideName: string;
  groomName: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  message: string;
  parents: string;
  arabicDate?: string;
  time?: string;
}

export interface TemplateData {
  version: number;
  designKey: string;
  colorKey: string;
  fontKey: string;
  canvas: {
    width: number;
    height: number;
    background: string;
    backgroundPattern?: string;
  };
  elements: AnyElement[];
  content: TemplateContent;
  meta: {
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
}
