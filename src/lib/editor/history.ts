import { TemplateData } from '@/lib/templates/types';

const MAX_HISTORY = 50;

export interface HistoryStack {
  past: TemplateData[];
  present: TemplateData;
  future: TemplateData[];
}

export function createHistory(initial: TemplateData): HistoryStack {
  return { past: [], present: initial, future: [] };
}

export function push(stack: HistoryStack, next: TemplateData): HistoryStack {
  const past = [...stack.past, stack.present].slice(-MAX_HISTORY);
  return { past, present: next, future: [] };
}

export function undo(stack: HistoryStack): HistoryStack {
  if (stack.past.length === 0) return stack;
  const prev = stack.past[stack.past.length - 1];
  const past = stack.past.slice(0, -1);
  return { past, present: prev, future: [stack.present, ...stack.future] };
}

export function redo(stack: HistoryStack): HistoryStack {
  if (stack.future.length === 0) return stack;
  const next = stack.future[0];
  const future = stack.future.slice(1);
  return { past: [...stack.past, stack.present], present: next, future };
}

export function canUndo(stack: HistoryStack): boolean {
  return stack.past.length > 0;
}

export function canRedo(stack: HistoryStack): boolean {
  return stack.future.length > 0;
}
