'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TemplatePreview from '@/components/templates/TemplatePreview';
import { TemplateData } from '@/lib/templates/types';
import { Plus, Edit3, Trash2, Copy, Eye, FileText } from 'lucide-react';
import { DESIGNS } from '@/lib/templates/designs';
import { PALETTES } from '@/lib/templates/palettes';
import { FONTS } from '@/lib/templates/fonts';

interface Invitation {
  id: string;
  slug: string;
  title: string;
  views: number;
  isPublished: boolean;
  rsvpCount: number;
  updatedAt: string;
  data: TemplateData;
}

export default function InvitationsPage() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('دعوتي الجديدة');
  const [newDesign, setNewDesign] = useState(DESIGNS[0].key);
  const [newColor, setNewColor] = useState(PALETTES[0].key);
  const [newFont, setNewFont] = useState(FONTS[0].key);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/invitations');
    const json = await res.json();
    if (json.invitations) setInvitations(json.invitations);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          designKey: newDesign,
          colorKey: newColor,
          fontKey: newFont
        })
      });
      const json = await res.json();
      if (json.invitation) {
        router.push(`/dashboard/invitations/${json.invitation.id}/edit`);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذه الدعوة؟ سيتم حذف جميع ردود الضيوف.')) return;
    await fetch(`/api/invitations/${id}`, { method: 'DELETE' });
    await load();
  };

  const handleDuplicate = async (id: string) => {
    const res = await fetch(`/api/invitations/${id}/duplicate`, { method: 'POST' });
    if (res.ok) await load();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gold-text font-amiri">الدعوات</h1>
          <p className="text-gold-100/60 mt-2 font-naskh">
            إنشاء وتعديل دعوات الأعراس الفاخرة
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn-gold flex items-center gap-2">
          <Plus size={16} />
          دعوة جديدة
        </button>
      </header>

      {loading ? (
        <div className="text-center py-12 text-gold-100/60 font-naskh">جاري التحميل...</div>
      ) : invitations.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <FileText className="mx-auto text-gold-300 mb-4" size={48} />
          <p className="text-gold-100/70 font-naskh mb-4">
            لم تنشئ أي دعوة بعد. ابدأ بإنشاء دعوتك الأولى!
          </p>
          <button onClick={() => setShowCreate(true)} className="btn-gold">
            إنشاء دعوة جديدة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {invitations.map((inv) => (
            <div key={inv.id} className="card-dark p-4 group">
              <div className="flex items-center justify-center bg-black/30 rounded-lg overflow-hidden mb-3 p-2 cursor-pointer"
                onClick={() => router.push(`/dashboard/invitations/${inv.id}/edit`)}
              >
                <TemplatePreview data={inv.data} maxWidth={220} maxHeight={330} />
              </div>
              <h3 className="text-sm font-bold text-gold-100 font-naskh truncate mb-1">
                {inv.title}
              </h3>
              <div className="text-xs text-gold-100/50 mb-3 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Eye size={11} /> {inv.views}
                </span>
                <span>{inv.rsvpCount} رد</span>
                {inv.isPublished && (
                  <span className="text-green-400">منشورة</span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => router.push(`/dashboard/invitations/${inv.id}/edit`)}
                  className="flex-1 p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-200 hover:bg-gold-500/20 flex items-center justify-center"
                  title="تعديل"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDuplicate(inv.id)}
                  className="flex-1 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 flex items-center justify-center"
                  title="تكرار"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="flex-1 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 hover:bg-red-500/20 flex items-center justify-center"
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal إنشاء دعوة */}
      {showCreate && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-gold-500/30 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-xl font-bold gold-text font-amiri">دعوة جديدة</h3>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">عنوان الدعوة</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input-gold"
              />
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">التصميم</label>
              <select value={newDesign} onChange={(e) => setNewDesign(e.target.value)} className="input-gold">
                {DESIGNS.map((d) => <option key={d.key} value={d.key}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">اللون</label>
              <select value={newColor} onChange={(e) => setNewColor(e.target.value)} className="input-gold">
                {PALETTES.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">الخط</label>
              <select value={newFont} onChange={(e) => setNewFont(e.target.value)} className="input-gold">
                {FONTS.map((f) => <option key={f.key} value={f.key}>{f.name}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gold-500/30 text-gold-100 hover:bg-gold-500/10 font-naskh"
              >
                إلغاء
              </button>
              <button onClick={handleCreate} disabled={creating} className="btn-gold flex-1">
                {creating ? 'جاري الإنشاء...' : 'إنشاء وبدء التعديل'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}