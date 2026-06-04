'use client';
  import { Save, Eye, Undo, Redo, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

  interface EditorToolbarProps {
    onSave: () => void;
    onPreview?: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    canUndo: boolean;
    canRedo: boolean;
    isSaving?: boolean;
    zoom: number;
  }

  export default function EditorToolbar({
    onSave, onPreview, onUndo, onRedo, onZoomIn, onZoomOut, onResetZoom,
    canUndo, canRedo, isSaving, zoom
  }: EditorToolbarProps) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-navy-900 border-b border-navy-700">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1 px-3 py-1.5 bg-gold-500 text-navy-950 rounded text-sm font-medium hover:bg-gold-400 disabled:opacity-50"
        >
          <Save size={14} /> {isSaving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
        {onPreview && (
          <button onClick={onPreview} className="flex items-center gap-1 px-3 py-1.5 bg-navy-700 text-white rounded text-sm hover:bg-navy-600">
            <Eye size={14} /> معاينة
          </button>
        )}
        <div className="w-px h-6 bg-navy-700 mx-1" />
        <button onClick={onUndo} disabled={!canUndo} className="p-1.5 text-navy-300 hover:text-white disabled:opacity-30 rounded hover:bg-navy-700">
          <Undo size={16} />
        </button>
        <button onClick={onRedo} disabled={!canRedo} className="p-1.5 text-navy-300 hover:text-white disabled:opacity-30 rounded hover:bg-navy-700">
          <Redo size={16} />
        </button>
        <div className="w-px h-6 bg-navy-700 mx-1" />
        <button onClick={onZoomOut} className="p-1.5 text-navy-300 hover:text-white rounded hover:bg-navy-700"><ZoomOut size={16} /></button>
        <span className="text-xs text-navy-300 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
        <button onClick={onZoomIn} className="p-1.5 text-navy-300 hover:text-white rounded hover:bg-navy-700"><ZoomIn size={16} /></button>
        <button onClick={onResetZoom} className="p-1.5 text-navy-300 hover:text-white rounded hover:bg-navy-700" title="إعادة تعيين التكبير"><RotateCcw size={14} /></button>
      </div>
    );
  }
  