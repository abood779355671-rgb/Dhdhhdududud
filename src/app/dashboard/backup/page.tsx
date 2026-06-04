'use client';

import { useEffect, useState } from 'react';
import {
  Download, Upload, Database, FileArchive, Calendar,
  CheckCircle, AlertCircle, HardDrive
} from 'lucide-react';

interface BackupStatus {
  counts: {
    invitations: number;
    templates: number;
    rsvps: number;
    events: number;
  };
  autoBackups: { name: string; size: number; createdAt: string }[];
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function BackupPage() {
  const [status, setStatus] = useState<BackupStatus | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    const res = await fetch('/api/backup/status');
    const json = await res.json();
    if (!json.error) setStatus(json);
  };

  useEffect(() => {
    load();
  }, []);

  const handleExport = () => {
    window.location.href = '/api/backup/export';
  };

  const handleImport = async (file: File) => {
    if (
      !confirm(
        `هل تريد استعادة هذا الملف؟\n\n` +
          `سيتم إضافة جميع الدعوات والقوالب والردود الموجودة في الملف إلى حسابك. ` +
          `لن يتم حذف أي بيانات حالية.\n\n` +
          `الملف: ${file.name}\nالحجم: ${formatBytes(file.size)}`
      )
    )
      return;

    setImporting(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/backup/import', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessage({
        type: 'success',
        text: `تمت الاستعادة بنجاح: ${json.restored.invitations} دعوة، ${json.restored.templates} قالب، ${json.restored.rsvps} رد، ${json.restored.events} فعالية`
      });
      await load();
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'فشل الاستعادة'
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold gold-text font-amiri">النسخ الاحتياطي</h1>
        <p className="text-gold-100/60 mt-2 font-naskh">
          صدّر بياناتك كملف ZIP أو استعد من نسخة سابقة
        </p>
      </header>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-start gap-2 ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-200'
              : 'bg-red-500/10 border-red-500/30 text-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle size={18} className="mt-0.5" />
          ) : (
            <AlertCircle size={18} className="mt-0.5" />
          )}
          <span className="text-sm font-naskh">{message.text}</span>
        </div>
      )}

      {/* الإحصائيات */}
      {status && (
        <div className="card-dark p-5 mb-6">
          <h3 className="text-lg font-bold gold-text font-amiri mb-4 flex items-center gap-2">
            <Database size={18} /> البيانات الحالية
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-xl bg-gold-500/5">
              <div className="text-2xl font-bold gold-text">{status.counts.invitations}</div>
              <div className="text-xs text-gold-100/60 font-naskh">دعوة</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gold-500/5">
              <div className="text-2xl font-bold gold-text">{status.counts.templates}</div>
              <div className="text-xs text-gold-100/60 font-naskh">قالب</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gold-500/5">
              <div className="text-2xl font-bold gold-text">{status.counts.rsvps}</div>
              <div className="text-xs text-gold-100/60 font-naskh">رد</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-gold-500/5">
              <div className="text-2xl font-bold gold-text">{status.counts.events}</div>
              <div className="text-xs text-gold-100/60 font-naskh">فعالية</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* تصدير */}
        <div className="card-dark p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-300">
              <Download size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold gold-text font-amiri">تصدير نسخة احتياطية</h3>
              <p className="text-xs text-gold-100/60 font-naskh mt-1">
                حمّل جميع بياناتك في ملف ZIP واحد
              </p>
            </div>
          </div>
          <ul className="text-sm text-gold-100/70 font-naskh space-y-1 mb-4">
            <li>✓ جميع الدعوات والقوالب</li>
            <li>✓ ردود الضيوف وفعاليات الحفل</li>
            <li>✓ تاريخ النسخ والتعديلات</li>
            <li>✓ ملف JSON لكل دعوة على حدة</li>
          </ul>
          <button onClick={handleExport} className="btn-gold w-full flex items-center justify-center gap-2">
            <FileArchive size={16} />
            تصدير الآن (ZIP)
          </button>
        </div>

        {/* استيراد */}
        <div className="card-dark p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-300">
              <Upload size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold gold-text font-amiri">استعادة من ملف ZIP</h3>
              <p className="text-xs text-gold-100/60 font-naskh mt-1">
                ارفع ملف نسخ احتياطي سابق لاستعادة البيانات
              </p>
            </div>
          </div>
          <ul className="text-sm text-gold-100/70 font-naskh space-y-1 mb-4">
            <li>✓ تتم الإضافة دون حذف البيانات الحالية</li>
            <li>✓ روابط Slug جديدة لمنع التضارب</li>
            <li>✓ القوالب المدمجة تُتجاهل تلقائياً</li>
          </ul>
          <label className="btn-gold w-full flex items-center justify-center gap-2 cursor-pointer">
            <Upload size={16} />
            {importing ? 'جاري الاستعادة...' : 'اختر ملف ZIP'}
            <input
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              disabled={importing}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>

      {/* النسخ التلقائية */}
      {status && (
        <div className="card-dark p-6 mt-6">
          <h3 className="text-lg font-bold gold-text font-amiri mb-3 flex items-center gap-2">
            <HardDrive size={18} /> النسخ الاحتياطية التلقائية المحلية
          </h3>
          {status.autoBackups.length === 0 ? (
            <p className="text-sm text-gold-100/60 font-naskh">
              لا توجد نسخ تلقائية بعد. شغّل الأمر:
              <code className="text-gold-300 bg-navy-900/50 px-2 py-0.5 mx-1 rounded text-xs">
                npm run backup
              </code>
              لإنشاء نسخة احتياطية في مجلد <code className="text-gold-300">/backups</code>.
            </p>
          ) : (
            <div className="space-y-1">
              {status.autoBackups.map((b) => (
                <div
                  key={b.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-gold-500/5"
                >
                  <div className="flex items-center gap-2">
                    <FileArchive size={14} className="text-gold-300" />
                    <span className="text-sm text-gold-100 font-naskh font-mono">{b.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gold-100/60">
                    <span>{formatBytes(b.size)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(b.createdAt).toLocaleString('ar-EG')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gold-100/40 font-naskh mt-3 leading-relaxed">
            لتفعيل النسخ الاحتياطي اليومي التلقائي، أضف مهمة Cron إلى نظامك تشغّل
            <code className="text-gold-300 bg-navy-900/50 px-2 py-0.5 mx-1 rounded text-xs">
              npm run backup
            </code>
            يومياً. النسخ تُحفظ في مجلد <code className="text-gold-300">/backups</code>.
          </p>
        </div>
      )}
    </div>
  );
}
