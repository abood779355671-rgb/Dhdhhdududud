'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  trend?: string;
}

export default function StatsCard({ label, value, icon: Icon, gradient, trend }: Props) {
  return (
    <div className="card-dark p-5 hover:border-gold-500/40 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gold-100/60 text-sm font-naskh">{label}</p>
          <p className="text-3xl font-bold gold-text mt-2">{value}</p>
          {trend && <p className="text-xs text-gold-100/50 mt-1 font-naskh">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}
