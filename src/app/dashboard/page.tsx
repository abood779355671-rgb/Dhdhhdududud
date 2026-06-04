'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import StatsCard from '@/components/dashboard/StatsCard';
import {
  FileText, Users, Eye, CheckCircle, XCircle, Palette,
  Plus, Bell, ArrowLeft
} from 'lucide-react';

interface Stats {
  invitations: number;
  templates: number;
  totalViews: number;
  totalRsvps: number;
  attending: number;
  declined: number;
  totalGuests: number;
  unread: number;
}

export default function DashboardHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) setStats(data);
      });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold gold-text font-amiri">لوحة التحكم</h1>
          <p className="text-gold-100/60 mt-2 font-naskh">
            نظرة عامة على جميع دعواتك وضيوفك
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats && stats.unread > 0 && (
            <button
              onClick={() => router.push('/dashboard/guests')}
              className="relative p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-200 hover:bg-gold-500/20"
              title={`${stats.unread} رد غير مقروء`}
            >
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.unread}
              </span>
            </button>
          )}
          <Logo size={60} />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatsCard
          label="إجمالي الدعوات"
          value={stats?.invitations ?? '...'}
          icon={FileText}
          gradient="from-gold-500 to-gold-300"
        />
        <StatsCard
          label="المشاهدات"
          value={stats?.totalViews ?? '...'}
          icon={Eye}
          gradient="from-purple-500 to-purple-300"
        />
        <StatsCard
          label="الردود"
          value={stats?.totalRsvps ?? '...'}
          icon={Users}
          gradient="from-blue-500 to-blue-300"
          trend={stats ? `${stats.unread} غير مقروء` : ''}
        />
        <StatsCard
          label="إجمالي الحضور"
          value={stats?.totalGuests ?? '...'}
          icon={CheckCircle}
          gradient="from-green-500 to-green-300"
          trend={stats ? `${stats.attending} مؤكد + المرافقون` : ''}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatsCard
          label="تأكيدات الحضور"
          value={stats?.attending ?? '...'}
          icon={CheckCircle}
          gradient="from-emerald-500 to-emerald-300"
        />
        <StatsCard
          label="الاعتذارات"
          value={stats?.declined ?? '...'}
          icon={XCircle}
          gradient="from-red-500 to-red-300"
        />
        <StatsCard
          label="القوالب المخصصة"
          value={stats?.templates ?? '...'}
          icon={Palette}
          gradient="from-yellow-500 to-amber-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card-dark p-6">
          <h3 className="text-lg font-bold gold-text font-amiri mb-3">إجراءات سريعة</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/dashboard/invitations')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 transition text-gold-100 font-naskh"
            >
              <span className="flex items-center gap-2">
                <Plus size={16} /> إنشاء دعوة جديدة
              </span>
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => router.push('/dashboard/templates')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 transition text-gold-100 font-naskh"
            >
              <span className="flex items-center gap-2">
                <Palette size={16} /> تصفح القوالب
              </span>
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => router.push('/dashboard/guests')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 transition text-gold-100 font-naskh"
            >
              <span className="flex items-center gap-2">
                <Users size={16} /> إدارة الضيوف
              </span>
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>

        <div className="card-dark p-6">
          <h3 className="text-lg font-bold gold-text font-amiri mb-3">نصائح</h3>
          <ul className="space-y-2 text-sm text-gold-100/70 font-naskh">
            <li className="flex gap-2">
              <span className="text-gold-300">•</span>
              استخدم القوالب الجاهزة كنقطة بداية ثم خصّصها بحرية
            </li>
            <li className="flex gap-2">
              <span className="text-gold-300">•</span>
              فعّل كلمة المرور للدعوات الخاصة جداً
            </li>
            <li className="flex gap-2">
              <span className="text-gold-300">•</span>
              أضف الإحداثيات (Lat/Lng) لخريطة دقيقة
            </li>
            <li className="flex gap-2">
              <span className="text-gold-300">•</span>
              صدّر CSV لردود الضيوف للأرشفة
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
