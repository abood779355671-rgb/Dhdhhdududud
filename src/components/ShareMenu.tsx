'use client';

import React, { useState } from 'react';
import {
  buildWhatsappLink,
  buildTelegramLink,
  buildSmsLink,
  buildEmailLink,
  buildXLink,
  buildFacebookLink,
  copyToClipboard,
  ShareData
} from '@/lib/share';
import {
  MessageCircle, Send, MessageSquare, Mail, Twitter,
  Facebook, Link as LinkIcon, Check
} from 'lucide-react';

interface Props {
  data: ShareData;
  layout?: 'grid' | 'list';
}

export default function ShareMenu({ data, layout = 'grid' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(data.url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const channels = [
    {
      key: 'whatsapp',
      label: 'واتساب',
      Icon: MessageCircle,
      url: buildWhatsappLink(data),
      color: 'bg-green-500/15 text-green-300 hover:bg-green-500/25 border-green-500/30'
    },
    {
      key: 'telegram',
      label: 'تليجرام',
      Icon: Send,
      url: buildTelegramLink(data),
      color: 'bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border-sky-500/30'
    },
    {
      key: 'sms',
      label: 'SMS',
      Icon: MessageSquare,
      url: buildSmsLink(data),
      color: 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border-amber-500/30'
    },
    {
      key: 'email',
      label: 'بريد',
      Icon: Mail,
      url: buildEmailLink(data),
      color: 'bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border-purple-500/30'
    },
    {
      key: 'x',
      label: 'X',
      Icon: Twitter,
      url: buildXLink(data),
      color: 'bg-gray-500/15 text-gray-200 hover:bg-gray-500/25 border-gray-500/30'
    },
    {
      key: 'facebook',
      label: 'فيسبوك',
      Icon: Facebook,
      url: buildFacebookLink(data),
      color: 'bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 border-blue-500/30'
    }
  ];

  if (layout === 'list') {
    return (
      <div className="space-y-2">
        <button
          onClick={handleCopy}
          className="w-full p-3 rounded-xl border border-gold-500/30 text-gold-100 hover:bg-gold-500/10 flex items-center justify-between font-naskh"
        >
          <span className="flex items-center gap-2">
            {copied ? <Check size={16} /> : <LinkIcon size={16} />}
            {copied ? 'تم النسخ!' : 'نسخ الرابط'}
          </span>
          <span className="text-xs text-gold-100/50 truncate max-w-[200px]">{data.url}</span>
        </button>
        {channels.map((c) => (
          <a
            key={c.key}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block p-3 rounded-xl border flex items-center gap-2 transition font-naskh ${c.color}`}
          >
            <c.Icon size={16} />
            {c.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="card-dark p-3 flex items-center gap-2">
        <input
          readOnly
          value={data.url}
          className="input-gold flex-1 text-xs"
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={handleCopy}
          className="px-3 py-2 rounded-lg bg-gold-gradient text-navy-900 font-bold text-xs flex items-center gap-1 font-naskh"
        >
          {copied ? <Check size={14} /> : <LinkIcon size={14} />}
          {copied ? 'تم' : 'نسخ'}
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {channels.map((c) => (
          <a
            key={c.key}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition font-naskh text-xs ${c.color}`}
          >
            <c.Icon size={20} />
            <span>{c.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
