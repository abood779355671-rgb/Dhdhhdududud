import { useEffect } from 'react';
import { useEditorStore } from './store';

export function useShortcuts(onSave?: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const isInput =
        tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;

      const s = useEditorStore.getState();
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 's') {
        e.preventDefault();
        onSave?.();
        return;
      }

      if (isInput) return;

      if (ctrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        s.undo();
        return;
      }
      if ((ctrl && e.key.toLowerCase() === 'y') || (ctrl && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        s.redo();
        return;
      }
      if (ctrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        s.copy();
        return;
      }
      if (ctrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        s.paste();
        return;
      }
      if (ctrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (s.selectedIds.length) s.duplicateElements(s.selectedIds);
        return;
      }
      if (ctrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        s.setSelected(s.data.elements.map((el) => el.id));
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (s.selectedIds.length) {
          e.preventDefault();
          s.removeElements(s.selectedIds);
        }
        return;
      }
      if (e.key === 'Escape') {
        s.clearSelection();
        return;
      }

      // الأسهم لتحريك العناصر
      const step = e.shiftKey ? 10 : 1;
      if (s.selectedIds.length) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          s.updateElements(s.selectedIds, {});
          s.selectedIds.forEach((id) => {
            const el = s.data.elements.find((x) => x.id === id);
            if (el) s.updateElement(id, { y: el.y - step });
          });
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          s.selectedIds.forEach((id) => {
            const el = s.data.elements.find((x) => x.id === id);
            if (el) s.updateElement(id, { y: el.y + step });
          });
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          s.selectedIds.forEach((id) => {
            const el = s.data.elements.find((x) => x.id === id);
            if (el) s.updateElement(id, { x: el.x - step });
          });
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          s.selectedIds.forEach((id) => {
            const el = s.data.elements.find((x) => x.id === id);
            if (el) s.updateElement(id, { x: el.x + step });
          });
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSave]);
}
