'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string | null;
  location: string | null;
  order: number;
}

interface Props {
  invitationId: string;
}

export default function EventsEditor({ invitationId }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: ''
  });

  const load = async () => {
    setLoading(true);
    const res = await fetch(`/api/invitations/${invitationId}/events`);
    const json = await res.json();
    if (json.events) setEvents(json.events);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [invitationId]);

  const handleAdd = async () => {
    if (!newEvent.title || !newEvent.startTime) {
      alert('العنوان والوقت مطلوبان');
      return;
    }
    await fetch(`/api/invitations/${invitationId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    setNewEvent({ title: '', description: '', startTime: '', endTime: '', location: '' });
    setShowForm(false);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('حذف هذه الفعالية؟')) return;
    await fetch(`/api/invitations/${invitationId}/events/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold gold-text font-amiri">فعاليات الحفل</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 rounded-lg bg-gold-500/20 text-gold-100 text-xs flex items-center gap-1 font-naskh"
        >
          <Plus size={12} /> إضافة فعالية
        </button>
      </div>

      {showForm && (
        <div className="card-dark p-4 space-y-3">
          <input
            placeholder="عنوان الفعالية *"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            className="input-gold"
          />
          <textarea
            placeholder="وصف اختياري"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            className="input-gold"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">يبدأ *</label>
              <input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                className="input-gold"
              />
            </div>
            <div>
              <label className="block text-gold-100/70 text-xs mb-1 font-naskh">ينتهي</label>
              <input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                className="input-gold"
              />
            </div>
          </div>
          <input
            placeholder="المكان (اختياري)"
            value={newEvent.location}
            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            className="input-gold"
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-gold flex-1 !py-2">
              إضافة
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl border border-gold-500/30 text-gold-100"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gold-100/50 py-4 font-naskh">جاري التحميل...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gold-100/50 py-4 font-naskh text-sm">
          لا توجد فعاليات. أضف فعالية مثل عقد القران، حفل الزفاف، أو حفل الاستقبال.
        </p>
      ) : (
        <div className="space-y-2">
          {events.map((ev) => (
            <div key={ev.id} className="card-dark p-3 flex items-start gap-3">
              <div className="flex-1">
                <div className="font-bold text-gold-100 font-naskh text-sm">{ev.title}</div>
                {ev.description && (
                  <div className="text-xs text-gold-100/60 mt-1 font-naskh">{ev.description}</div>
                )}
                <div className="text-xs text-gold-100/50 mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(ev.startTime).toLocaleString('ar-EG')}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={10} /> {ev.location}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(ev.id)}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-300 hover:bg-red-500/20"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
