'use client';

import { useEffect, useState } from 'react';
import RsvpTable, { Rsvp } from '@/components/dashboard/RsvpTable';
import { Users, FileText } from 'lucide-react';

interface InvSummary {
  id: string;
  title: string;
  rsvps: Rsvp[];
}

export default function GuestsPage() {
  const [invitations, setInvitations] = useState<InvSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const invRes = await fetch('/api/invitations');
    const invJson = await invRes.json();
    if (!invJson.invitations) {
      setLoading(false);
      return;
    }

    const detailed: InvSummary[] = await Promise.all(
      invJson.invitations.map(async (i: { id: string; title: string }) => {
        const r = await fetch(`/api/invitations/${i.id}/rsvps`);
        const rj = await r.json();
        return { id: i.id, title: i.title, rsvps: rj.rsvps || [] };
      })
    );
    setInvitations(detailed);
    if (detailed.length && !activeId) setActiveId(detailed[0].id);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarkRead = async (rid: string) => {
    if (!activeId) return;
    await fetch(`/api/invitations/${activeId}/rsvps/${rid}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead: true })
    });
    await load();
  };

  const handleDelete = async (rid: string) => {
    if (!activeId) return;
    if (!confirm('حذف هذا الرد؟')) return;
    await fetch(`/api/invitations/${activeId}/rsvps/${rid}`, { method: 'DELETE' });
    await load();
  };

  const active = invitations.find((i) => i.id === activeId);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold gold-text font-amiri">الضيوف والردود</h1>
        <p className="text-gold-100/60 mt-2 font-naskh">
          إدارة جميع ردود الضيوف لكل دعوة
        </p>
      </header>

      {loading ? (
        <div className="text-center py-12 text-gold-100/60 font-naskh">جاري التحميل...</div>
      ) : invitations.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <FileText className="mx-auto text-gold-300 mb-4" size={48} />
          <p className="text-gold-100/70 font-naskh">
            لا توجد دعوات بعد. أنشئ دعوة من صفحة الدعوات.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <aside className="card-dark p-3 h-fit">
            <h3 className="text-sm font-bold gold-text font-amiri mb-3 px-2">
              <Users size={14} className="inline mr-1" />
              الدعوات ({invitations.length})
            </h3>
            <div className="space-y-1">
              {invitations.map((i) => (
                <button
                  key={i.id}
                  onClick={() => setActiveId(i.id)}
                  className={`w-full text-right p-2 rounded-lg text-sm transition font-naskh ${
                    activeId === i.id
                      ? 'bg-gold-gradient text-navy-900 font-bold'
                      : 'text-gold-100/80 hover:bg-gold-500/10'
                  }`}
                >
                  <div className="truncate">{i.title}</div>
                  <div className={`text-xs ${activeId === i.id ? 'text-navy-900/70' : 'text-gold-100/50'}`}>
                    {i.rsvps.length} رد
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main>
            {active ? (
              <>
                <h2 className="text-xl font-bold gold-text font-amiri mb-4">
                  {active.title}
                </h2>
                <RsvpTable
                  rsvps={active.rsvps}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              </>
            ) : (
              <p className="text-center text-gold-100/50 py-12 font-naskh">
                اختر دعوة لعرض الردود
              </p>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
