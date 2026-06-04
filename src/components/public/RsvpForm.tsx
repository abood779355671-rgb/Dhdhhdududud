'use client';

import React, { useState } from 'react';
import { Check, X, Users, MessageSquare, Phone, User } from 'lucide-react';

interface Props {
  slug: string;
  onSuccess?: () => void;
}

export default function RsvpForm({ slug, onSuccess }: Props) {
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestsCount, setGuestsCount] = useState(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attending === null) {
      setError('يرجى اختيار حضور أو اعتذار');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/public/invitation/${slug}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName, phone, attending, guestsCount, note })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'فشل الإرسال');
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطأ');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/95 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="text-green-600" size={32} />
        </div>
        <h3 className="text-2xl font-amiri font-bold text-gray-800 mb-2">
          شكراً لردك!
        </h3>
        <p className="text-gray-600 font-naskh">
          {attending
            ? 'يسعدنا حضورك معنا في هذه المناسبة الخاصة'
            : 'نقدر تواصلك معنا'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-2xl font-amiri font-bold text-gray-800 mb-1">
          تأكيد الحضور
        </h3>
        <p className="text-gray-500 text-sm font-naskh">يسعدنا تأكيد حضوركم معنا</p>
      </div>

      <div>
        <label className="text-xs text-gray-600 font-naskh mb-1 flex items-center gap-1">
          <User size={12} /> الاسم الكامل *
        </label>
        <input
          required
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold-500 outline-none text-gray-800 transition"
          placeholder="اسمك..."
        />
      </div>

      <div>
        <label className="text-xs text-gray-600 font-naskh mb-1 flex items-center gap-1">
          <Phone size={12} /> رقم الجوال (اختياري)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold-500 outline-none text-gray-800 transition"
          placeholder="05xxxxxxxx"
        />
      </div>

      <div>
        <label className="text-xs text-gray-600 font-naskh mb-2 block">هل ستحضر؟ *</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition font-naskh ${
              attending === true
                ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <Check size={16} /> سأحضر
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition font-naskh ${
              attending === false
                ? 'border-red-500 bg-red-50 text-red-700 font-bold'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <X size={16} /> أعتذر
          </button>
        </div>
      </div>

      {attending === true && (
        <div>
          <label className="text-xs text-gray-600 font-naskh mb-1 flex items-center gap-1">
            <Users size={12} /> عدد المرافقين
          </label>
          <input
            type="number"
            min={0}
            max={20}
            value={guestsCount}
            onChange={(e) => setGuestsCount(Number(e.target.value))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold-500 outline-none text-gray-800 transition"
          />
        </div>
      )}

      <div>
        <label className="text-xs text-gray-600 font-naskh mb-1 flex items-center gap-1">
          <MessageSquare size={12} /> ملاحظة (اختياري)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-gold-500 outline-none text-gray-800 transition resize-none"
          placeholder="رسالة..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-naskh">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50 font-naskh"
        style={{
          background: 'linear-gradient(135deg, #C9A84C 0%, #8C6D1F 100%)'
        }}
      >
        {loading ? 'جاري الإرسال...' : 'إرسال الرد'}
      </button>
    </form>
  );
}
