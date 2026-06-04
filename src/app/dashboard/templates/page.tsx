'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TemplateGallery from '@/components/templates/TemplateGallery';
import TemplatePreview from '@/components/templates/TemplatePreview';
import { TemplateData } from '@/lib/templates/types';
import { Sparkles, Upload, Layers, Trash2, Edit3, Download } from 'lucide-react';

interface SavedTemplate {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  isBuiltIn: boolean;
  data: TemplateData;
  updatedAt: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'gallery' | 'saved'>('gallery');
  const [templates, setTemplates] = useState<SavedTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const loadTemplates = async () => {
    setLoading(true);
    const res = await fetch('/api/templates');
    const json = await res.json();
    if (json.templates) setTemplates(json.templates);
    setLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSeedBuiltins = async () => {
    setSeeding(true);
    try {
      await fetch('/api/templates/builtin', { method: 'POST' });
      await loadTemplates();
    } finally {
      setSeeding(false);
    }
  };

  const handleSelect = (designKey: string, colorKey: string, fontKey: string) => {
    router.push(
      `/dashboard/templates/new?design=${designKey}&color=${colorKey}&font=${fontKey}`
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل تريد حذف هذا القالب؟')) return;
    await fetch(`/api/templates/${id}`, { method: 'DELETE' });
    await loadTemplates();
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      const res = await fetch('/api/templates/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, name: file.name.replace('.json', '') })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      await loadTemplates();
      setTab('saved');
    } catch (e) {
      alert('فشل استيراد الملف: ' + (e instanceof Error ? e.message : 'خطأ'));
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gold-text font-amiri">القوالب</h1>
          <p className="text-gold-100/60 mt-2 font-naskh">
            1000 تركيبة جاهزة + قوالبك المخصصة
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <label className="px-4 py-2 rounded-xl border border-gold-500/40 text-gold-100 hover:bg-gold-500/10 cursor-pointer flex items-center gap-2 font-naskh">
            <Upload size={16} />
            استيراد JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
              }}
            />
          </label>
          <button
            onClick={handleSeedBuiltins}
            disabled={seeding}
            className="px-4 py-2 rounded-xl border border-gold-500/40 text-gold-100 hover:bg-gold-500/10 flex items-center gap-2 font-naskh"
          >
            <Sparkles size={16} />
            {seeding ? 'جاري...' : 'توليد القوالب المدمجة'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('gallery')}
          className={`px-5 py-2 rounded-xl font-naskh transition-all ${
            tab === 'gallery'
              ? 'bg-gold-gradient text-navy-900 font-bold'
              : 'border border-gold-500/30 text-gold-100/80 hover:bg-gold-500/10'
          }`}
        >
          معرض القوالب (1000 تركيبة)
        </button>
        <button
          onClick={() => setTab('saved')}
          className={`px-5 py-2 rounded-xl font-naskh transition-all ${
            tab === 'saved'
              ? 'bg-gold-gradient text-navy-900 font-bold'
              : 'border border-gold-500/30 text-gold-100/80 hover:bg-gold-500/10'
          }`}
        >
          القوالب المحفوظة ({templates.length})
        </button>
      </div>

      {tab === 'gallery' && <TemplateGallery onSelect={handleSelect} />}

      {tab === 'saved' && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-gold-100/60 font-naskh">جاري التحميل...</div>
          ) : templates.length === 0 ? (
            <div className="card-dark p-12 text-center">
              <Layers className="mx-auto text-gold-300 mb-4" size={48} />
              <p className="text-gold-100/70 font-naskh mb-4">
                لا توجد قوالب محفوظة بعد. يمكنك توليد القوالب المدمجة أو إنشاء قالب مخصص.
              </p>
              <button
                onClick={handleSeedBuiltins}
                disabled={seeding}
                className="btn-gold"
              >
                توليد القوالب المدمجة الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {templates.map((t) => (
                <div key={t.id} className="card-dark p-3 group">
                  <div className="flex items-center justify-center bg-black/30 rounded-lg overflow-hidden mb-3 p-2">
                    <TemplatePreview data={t.data} maxWidth={200} maxHeight={300} />
                  </div>
                  <div className="text-sm text-gold-100 font-naskh truncate mb-1">
                    {t.name}
                  </div>
                  <div className="text-xs text-gold-100/50 mb-3">
                    {t.isBuiltIn ? 'مدمج' : t.category}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        router.push(
                          `/dashboard/templates/new?design=${t.data.designKey}&color=${t.data.colorKey}&font=${t.data.fontKey}`
                        )
                      }
                      className="flex-1 p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-200 hover:bg-gold-500/20 flex items-center justify-center"
                      title="تخصيص"
                    >
                      <Edit3 size={14} />
                    </button>
                    <a
                      href={`/api/templates/export/${t.id}`}
                      className="flex-1 p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-200 hover:bg-blue-500/20 flex items-center justify-center"
                      title="تصدير"
                    >
                      <Download size={14} />
                    </a>
                    {!t.isBuiltIn && (
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="flex-1 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 hover:bg-red-500/20 flex items-center justify-center"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
