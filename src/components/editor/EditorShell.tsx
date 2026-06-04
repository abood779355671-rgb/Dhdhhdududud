'use client';
import { useCallback } from 'react';
import { useEditorStore } from '@/lib/editor/store';
import EditorToolbar from './EditorToolbar';
import EditorCanvas from './EditorCanvas';
import LayersPanel from './LayersPanel';
import PropertiesPanel from './PropertiesPanel';
import AddElementPanel from './AddElementPanel';

interface EditorShellProps {
  invitationId: string;
}

export default function EditorShell({ invitationId }: EditorShellProps) {
  const undo = useEditorStore(s => s.undo);
  const redo = useEditorStore(s => s.redo);
  const canUndo = useEditorStore(s => s.canUndo);
  const canRedo = useEditorStore(s => s.canRedo);
  const saving = useEditorStore(s => s.saving);
  const zoom = useEditorStore(s => s.zoom);
  const setZoom = useEditorStore(s => s.setZoom);
  const dirty = useEditorStore(s => s.dirty);
  const setSaving = useEditorStore(s => s.setSaving);
  const setSaved = useEditorStore(s => s.setSaved);
  const data = useEditorStore(s => s.data);

  const handleSave = useCallback(async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await fetch(`/api/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      setSaved();
    } catch {
      setSaving(false);
    }
  }, [dirty, data, invitationId, setSaving, setSaved]);

  const handleZoomIn = useCallback(() => setZoom(Math.min(zoom + 0.1, 3)), [zoom, setZoom]);
  const handleZoomOut = useCallback(() => setZoom(Math.max(zoom - 0.1, 0.3)), [zoom, setZoom]);
  const handleResetZoom = useCallback(() => setZoom(1), [setZoom]);

  return (
    <div className="flex flex-col h-screen bg-navy-950 text-white">
      <EditorToolbar
        onSave={handleSave}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        canUndo={canUndo()}
        canRedo={canRedo()}
        isSaving={saving}
        zoom={zoom}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 border-r border-navy-700 overflow-y-auto">
          <LayersPanel />
          <AddElementPanel />
        </div>
        <div className="flex-1 overflow-auto bg-navy-900">
          <EditorCanvas />
        </div>
        <div className="w-72 flex-shrink-0 border-l border-navy-700 overflow-y-auto">
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}
