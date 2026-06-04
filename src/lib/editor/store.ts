import { create } from 'zustand';
import { produce } from 'immer';
import { AnyElement, TemplateData } from '@/lib/templates/types';
import { HistoryStack, createHistory, push, undo, redo, canUndo, canRedo } from './history';
import { cloneElement, genId } from './utils';

export interface EditorState {
  // البيانات
  data: TemplateData;
  history: HistoryStack;
  invitationId: string | null;
  invitationTitle: string;

  // التحديد
  selectedIds: string[];

  // العرض
  zoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  showGuides: boolean;

  // الحفظ
  dirty: boolean;
  saving: boolean;
  lastSavedAt: number | null;

  // Clipboard
  clipboard: AnyElement[] | null;

  // Actions
  init: (data: TemplateData, invitationId: string | null, title: string) => void;
  setData: (data: TemplateData, record?: boolean) => void;
  updateElement: (id: string, patch: Partial<AnyElement>) => void;
  updateElements: (ids: string[], patch: Partial<AnyElement>) => void;
  addElement: (el: AnyElement) => void;
  removeElements: (ids: string[]) => void;
  duplicateElements: (ids: string[]) => void;
  bringForward: (ids: string[]) => void;
  sendBackward: (ids: string[]) => void;
  bringToFront: (ids: string[]) => void;
  sendToBack: (ids: string[]) => void;
  toggleLock: (id: string) => void;
  toggleVisible: (id: string) => void;
  reorderLayer: (fromIndex: number, toIndex: number) => void;

  setSelected: (ids: string[]) => void;
  addToSelection: (id: string) => void;
  clearSelection: () => void;

  setZoom: (z: number) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  toggleGuides: () => void;
  setGridSize: (n: number) => void;

  copy: () => void;
  paste: () => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  setCanvasBackground: (bg: string) => void;

  setSaving: (saving: boolean) => void;
  setSaved: () => void;
  setDirty: () => void;
  setTitle: (title: string) => void;
}

function commit(state: EditorState, mutator: (data: TemplateData) => void): Partial<EditorState> {
  const next = produce(state.data, mutator);
  next.meta.updatedAt = new Date().toISOString();
  return {
    data: next,
    history: push(state.history, next),
    dirty: true
  };
}

export const useEditorStore = create<EditorState>((set, get) => ({
  data: {
    version: 1,
    designKey: '',
    colorKey: '',
    fontKey: '',
    canvas: { width: 800, height: 1200, background: '#FBF6E6' },
    elements: [],
    content: {
      brideName: '',
      groomName: '',
      weddingDate: '',
      venueName: '',
      venueAddress: '',
      message: '',
      parents: ''
    },
    meta: {
      name: 'دعوة جديدة',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  history: createHistory({
    version: 1,
    designKey: '',
    colorKey: '',
    fontKey: '',
    canvas: { width: 800, height: 1200, background: '#FBF6E6' },
    elements: [],
    content: {
      brideName: '',
      groomName: '',
      weddingDate: '',
      venueName: '',
      venueAddress: '',
      message: '',
      parents: ''
    },
    meta: {
      name: 'دعوة جديدة',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),
  invitationId: null,
  invitationTitle: 'دعوة جديدة',
  selectedIds: [],
  zoom: 0.5,
  showGrid: false,
  snapToGrid: false,
  gridSize: 10,
  showGuides: true,
  dirty: false,
  saving: false,
  lastSavedAt: null,
  clipboard: null,

  init: (data, invitationId, title) =>
    set({
      data,
      history: createHistory(data),
      invitationId,
      invitationTitle: title,
      selectedIds: [],
      dirty: false,
      lastSavedAt: Date.now()
    }),

  setData: (data, record = true) =>
    set((s) => ({
      data,
      history: record ? push(s.history, data) : s.history,
      dirty: true
    })),

  updateElement: (id, patch) =>
    set((s) =>
      commit(s, (d) => {
        const idx = d.elements.findIndex((e) => e.id === id);
        if (idx >= 0) Object.assign(d.elements[idx], patch);
      })
    ),

  updateElements: (ids, patch) =>
    set((s) =>
      commit(s, (d) => {
        for (const id of ids) {
          const idx = d.elements.findIndex((e) => e.id === id);
          if (idx >= 0) Object.assign(d.elements[idx], patch);
        }
      })
    ),

  addElement: (el) =>
    set((s) => ({
      ...commit(s, (d) => {
        const maxZ = d.elements.reduce((m, e) => Math.max(m, e.zIndex), 0);
        d.elements.push({ ...el, zIndex: maxZ + 1 });
      }),
      selectedIds: [el.id]
    })),

  removeElements: (ids) =>
    set((s) => ({
      ...commit(s, (d) => {
        d.elements = d.elements.filter((e) => !ids.includes(e.id));
      }),
      selectedIds: []
    })),

  duplicateElements: (ids) =>
    set((s) => {
      const newIds: string[] = [];
      const next = commit(s, (d) => {
        for (const id of ids) {
          const el = d.elements.find((e) => e.id === id);
          if (el) {
            const c = cloneElement(el);
            newIds.push(c.id);
            d.elements.push(c);
          }
        }
      });
      return { ...next, selectedIds: newIds };
    }),

  bringForward: (ids) =>
    set((s) =>
      commit(s, (d) => {
        for (const id of ids) {
          const el = d.elements.find((e) => e.id === id);
          if (el) el.zIndex += 1;
        }
      })
    ),

  sendBackward: (ids) =>
    set((s) =>
      commit(s, (d) => {
        for (const id of ids) {
          const el = d.elements.find((e) => e.id === id);
          if (el && el.zIndex > 0) el.zIndex -= 1;
        }
      })
    ),

  bringToFront: (ids) =>
    set((s) =>
      commit(s, (d) => {
        const maxZ = d.elements.reduce((m, e) => Math.max(m, e.zIndex), 0);
        let i = 1;
        for (const id of ids) {
          const el = d.elements.find((e) => e.id === id);
          if (el) el.zIndex = maxZ + i++;
        }
      })
    ),

  sendToBack: (ids) =>
    set((s) =>
      commit(s, (d) => {
        const minZ = d.elements.reduce((m, e) => Math.min(m, e.zIndex), 0);
        let i = 1;
        for (const id of ids) {
          const el = d.elements.find((e) => e.id === id);
          if (el) el.zIndex = minZ - i++;
        }
      })
    ),

  toggleLock: (id) =>
    set((s) =>
      commit(s, (d) => {
        const el = d.elements.find((e) => e.id === id);
        if (el) el.locked = !el.locked;
      })
    ),

  toggleVisible: (id) =>
    set((s) =>
      commit(s, (d) => {
        const el = d.elements.find((e) => e.id === id);
        if (el) el.visible = !el.visible;
      })
    ),

  reorderLayer: (fromIndex, toIndex) =>
    set((s) =>
      commit(s, (d) => {
        const sorted = [...d.elements].sort((a, b) => b.zIndex - a.zIndex);
        const [moved] = sorted.splice(fromIndex, 1);
        sorted.splice(toIndex, 0, moved);
        // إعادة تعيين zIndex
        sorted.forEach((el, i) => {
          const orig = d.elements.find((e) => e.id === el.id);
          if (orig) orig.zIndex = sorted.length - i;
        });
      })
    ),

  setSelected: (ids) => set({ selectedIds: ids }),
  addToSelection: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id]
    })),
  clearSelection: () => set({ selectedIds: [] }),

  setZoom: (z) => set({ zoom: Math.max(0.1, Math.min(3, z)) }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnap: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
  toggleGuides: () => set((s) => ({ showGuides: !s.showGuides })),
  setGridSize: (n) => set({ gridSize: Math.max(2, n) }),

  copy: () => {
    const s = get();
    const items = s.data.elements.filter((e) => s.selectedIds.includes(e.id));
    if (items.length) set({ clipboard: items });
  },

  paste: () =>
    set((s) => {
      if (!s.clipboard || s.clipboard.length === 0) return s;
      const newIds: string[] = [];
      const next = commit(s, (d) => {
        let maxZ = d.elements.reduce((m, e) => Math.max(m, e.zIndex), 0);
        for (const el of s.clipboard!) {
          const c = { ...cloneElement(el, 30), id: genId(el.type), zIndex: ++maxZ };
          newIds.push(c.id);
          d.elements.push(c);
        }
      });
      return { ...next, selectedIds: newIds };
    }),

  undo: () =>
    set((s) => {
      if (!canUndo(s.history)) return s;
      const h = undo(s.history);
      return { history: h, data: h.present, dirty: true };
    }),

  redo: () =>
    set((s) => {
      if (!canRedo(s.history)) return s;
      const h = redo(s.history);
      return { history: h, data: h.present, dirty: true };
    }),

  canUndo: () => canUndo(get().history),
  canRedo: () => canRedo(get().history),

  setCanvasBackground: (bg) =>
    set((s) =>
      commit(s, (d) => {
        d.canvas.background = bg;
      })
    ),

  setSaving: (saving) => set({ saving }),
  setSaved: () => set({ dirty: false, saving: false, lastSavedAt: Date.now() }),
  setDirty: () => set({ dirty: true }),
  setTitle: (title) => set({ invitationTitle: title })
}));
