'use client';
import { useEffect, useState } from 'react';
import TemplateRenderer from '@/components/templates/TemplateRenderer';
import RsvpForm from './RsvpForm';
import EventsTimeline from './EventsTimeline';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ShareMenu from '@/components/ShareMenu';
import CountdownTimer from '@/components/CountdownTimer';

  interface PublicInvitationProps {
    invitation: {
      id: string;
      slug: string;
      title: string;
      brideName: string;
      groomName: string;
      weddingDate: string;
      weddingTime: string;
      venue: string;
      venueAddress: string;
      googleMapsUrl?: string;
      coverImage?: string;
      content: any;
      template: any;
      events: any[];
      showRsvp: boolean;
      rsvpDeadline?: string;
      music?: string;
      password?: string;
      expiresAt?: string;
    };
  }

  export default function PublicInvitation({ invitation }: PublicInvitationProps) {
    const [hasMusic, setHasMusic] = useState(false);
    const audioRef = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
      if (invitation.music) setHasMusic(true);
    }, [invitation.music]);

    return (
      <div className="min-h-screen" dir="rtl">
        {/* Template Render */}
        {invitation.template && (
          <TemplateRenderer data={invitation.template} />
        )}

        {/* Events Timeline */}
        {invitation.events && invitation.events.length > 0 && (
          <section className="py-12 px-4">
            <EventsTimeline events={invitation.events} />
          </section>
        )}

        {/* Countdown */}
        {invitation.weddingDate && (
          <section className="py-8 px-4">
            <CountdownTimer targetDate={invitation.weddingDate} targetTime={invitation.weddingTime} />
          </section>
        )}

        {/* RSVP */}
        {invitation.showRsvp && (
          <section className="py-12 px-4 max-w-lg mx-auto">
            <RsvpForm slug={invitation.slug} />
          </section>
        )}

        {/* Share & QR */}
        <section className="py-8 px-4 flex flex-col items-center gap-6">
          <ShareMenu data={{
            title: `دعوة زفاف — ${invitation.brideName} & ${invitation.groomName}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL || ''}/i/${invitation.slug}`,
          }} />
          <QRCodeDisplay value={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/i/${invitation.slug}`} />
        </section>

        {/* Footer */}
        <div className="text-center text-gold-100/40 text-xs pt-4 pb-8 font-naskh">
          صُنعت بـ <span className="text-gold-400 font-amiri">تحفة</span>
        </div>
      </div>
    );
  }
  