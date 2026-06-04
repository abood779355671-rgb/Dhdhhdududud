'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  danger = false,
  onConfirm,
  onCancel
}: Props) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancel}
    >
      <div
        className="card-dark p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-xl flex-shrink-0 ${
              danger ? 'bg-red-500/20' : 'bg-gold-500/20'
            }`}
          >
            <AlertTriangle
              size={20}
              className={danger ? 'text-red-300' : 'text-gold-300'}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold gold-text font-amiri">{title}</h3>
            <p className="text-sm text-gold-100/70 mt-2 font-naskh leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gold-500/10 text-gold-100/60"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-gold-500/30 text-gold-100 hover:bg-gold-500/10 font-naskh"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 rounded-xl font-bold font-naskh transition ${
              danger
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:opacity-90'
                : 'btn-gold !rounded-xl !py-2'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
