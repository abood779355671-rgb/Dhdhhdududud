'use client';

import React, { useState } from 'react';
import { Check, X, Trash2, MessageSquare, Phone, Calendar, Search, Download } from 'lucide-react';

export interface Rsvp {
  id: string;
  guestName: string;
  phone: string | null;
  attending: boolean;
  guestsCount: number;
  note: string | null;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  rsvps: Rsvp[];
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function RsvpTable({ rsvps, onMarkRead, onDelete }: Props) {
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined' | 'unread'>('all');
  const [query, setQuery] = useState('');

  const filtered = rsvps.filter((r) => {
    if (filter === 'attending' && !r.attending) return false;
    if (filter === 'declined' && r.attending) return false;
    if (filter === 'unread' && r.isRead) return false;
    if (query && !r.guestName.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const exportCSV = () => {
    const rows = [
      ['الاسم', 'الجوال', 'الحضور', 'المرافقون', 'ملاحظة', 'التاريخ'],
      ...filtered.map((r) => [
        r.guestName,
        r.phone || '',
        r.attending ? 'حاضر' : 'معتذر',
        String(r.guestsCount),
        r.note || '',
        new Date(r.createdAt).toLocaleString('ar-EG')
      ])
    ];
    const csv = '\uFEFF' + rows.map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvps-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
          <Search size={14} className="text-gold-100/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم..."
            className="input-gold flex-1"
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {(
            [
              ['all', `الكل (${rsvps.length})`],
              ['attending', `حاضرون (${rsvps.filter((r) => r.attending).length})`],
              ['declined', `معتذرون (${rsvps.filter((r) => !r.attending).length})`],
              ['unread', `غير مقروء (${rsvps.filter((r) => !r.isRead).length})`]
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1.5 rounded-lg text-xs font-naskh transition ${
                filter === k
                  ? 'bg-gold-gradient text-navy-900 font-bold'
                  : 'border border-gold-500/30 text-gold-100/70 hover:bg-gold-500/10'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={exportCSV}
          className="px-3 py-1.5 rounded-lg border border-gold-500/30 text-gold-100 hover:bg-gold-500/10 flex items-center gap-1 text-xs font-naskh"
        >
          <Download size={12} /> CSV
        </button>
      </div>

      <div className="card-dark overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-gold-100/50 font-naskh">لا توجد ردود</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-500/20 text-gold-100/70">
                  <th className="text-right py-3 px-4 font-naskh">الضيف</th>
                  <th className="text-right py-3 px-4 font-naskh">الحضور</th>
                  <th className="text-right py-3 px-4 font-naskh">المرافقون</th>
                  <th className="text-right py-3 px-4 font-naskh">ملاحظة</th>
                  <th className="text-right py-3 px-4 font-naskh">التاريخ</th>
                  <th className="text-right py-3 px-4 font-naskh">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className={`border-b border-gold-500/10 hover:bg-gold-500/5 ${
                      !r.isRead ? 'bg-gold-500/5' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {!r.isRead && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                        <div>
                          <div className="text-gold-100 font-naskh font-bold">{r.guestName}</div>
                          {r.phone && (
                            <div className="text-xs text-gold-100/50 flex items-center gap-1 mt-0.5">
                              <Phone size={10} />
                              <a href={`tel:${r.phone}`} className="hover:text-gold-300">
                                {r.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {r.attending ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-200 text-xs font-naskh">
                          <Check size={12} /> حاضر
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/20 text-red-200 text-xs font-naskh">
                          <X size={12} /> معتذر
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gold-100/80 font-naskh">
                      {r.attending ? r.guestsCount : '—'}
                    </td>
                    <td className="py-3 px-4 text-gold-100/70 text-xs max-w-xs">
                      {r.note ? (
                        <div className="flex items-start gap-1">
                          <MessageSquare size={11} className="mt-0.5 flex-shrink-0" />
                          <span className="font-naskh line-clamp-2">{r.note}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-gold-100/60 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(r.createdAt).toLocaleDateString('ar-EG')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {!r.isRead && onMarkRead && (
                          <button
                            onClick={() => onMarkRead(r.id)}
                            className="p-1.5 rounded-lg bg-gold-500/10 text-gold-200 hover:bg-gold-500/20"
                            title="تمييز كمقروء"
                          >
                            <Check size={12} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(r.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-200 hover:bg-red-500/20"
                            title="حذف"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
