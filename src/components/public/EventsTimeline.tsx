'use client';

import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string | null;
  startTime: string | Date;
  endTime: string | Date | null;
  location: string | null;
}

interface Props {
  events: Event[];
}

export default function EventsTimeline({ events }: Props) {
  if (!events || events.length === 0) return null;

  const formatTime = (d: string | Date) =>
    new Date(d).toLocaleString('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit'
    });

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
      <h3 className="text-xl font-amiri font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calendar size={20} /> فعاليات الحفل
      </h3>
      <div className="space-y-4">
        {events.map((ev, i) => (
          <div key={ev.id} className="relative pr-6">
            <div
              className="absolute right-0 top-2 w-3 h-3 rounded-full"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #F5D78E)' }}
            />
            {i < events.length - 1 && (
              <div
                className="absolute right-[5px] top-5 bottom-[-16px] w-px"
                style={{ background: 'rgba(201,168,76,0.3)' }}
              />
            )}
            <div className="font-bold text-gray-800 font-naskh">{ev.title}</div>
            {ev.description && (
              <div className="text-sm text-gray-600 font-naskh mt-1">{ev.description}</div>
            )}
            <div className="text-xs text-gray-500 mt-1 font-naskh flex items-center gap-1">
              <Clock size={11} /> {formatTime(ev.startTime)}
            </div>
            {ev.location && (
              <div className="text-xs text-gray-500 mt-0.5 font-naskh flex items-center gap-1">
                <MapPin size={11} /> {ev.location}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
