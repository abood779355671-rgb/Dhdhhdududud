import JSZip from 'jszip';
import { prisma } from './prisma';

export interface BackupManifest {
  version: number;
  exportedAt: string;
  appName: string;
  counts: {
    users: number;
    invitations: number;
    templates: number;
    rsvps: number;
    events: number;
    versions: number;
  };
}

export async function buildBackupZip(): Promise<Buffer> {
  const zip = new JSZip();

  const [users, invitations, templates, rsvps, events, versions] = await Promise.all([
    prisma.user.findMany(),
    prisma.invitation.findMany(),
    prisma.template.findMany(),
    prisma.rsvp.findMany(),
    prisma.weddingEvent.findMany(),
    prisma.invitationVersion.findMany()
  ]);

  const manifest: BackupManifest = {
    version: 1,
    exportedAt: new Date().toISOString(),
    appName: 'تحفة',
    counts: {
      users: users.length,
      invitations: invitations.length,
      templates: templates.length,
      rsvps: rsvps.length,
      events: events.length,
      versions: versions.length
    }
  };

  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  zip.file(
    'users.json',
    JSON.stringify(
      users.map((u) => ({ ...u, password: '[REDACTED]' })),
      null,
      2
    )
  );
  zip.file('invitations.json', JSON.stringify(invitations, null, 2));
  zip.file('templates.json', JSON.stringify(templates, null, 2));
  zip.file('rsvps.json', JSON.stringify(rsvps, null, 2));
  zip.file('events.json', JSON.stringify(events, null, 2));
  zip.file('versions.json', JSON.stringify(versions, null, 2));

  // مجلد لكل دعوة (JSON منفصل للتنظيم)
  const invFolder = zip.folder('invitations');
  if (invFolder) {
    for (const inv of invitations) {
      const invRsvps = rsvps.filter((r) => r.invitationId === inv.id);
      const invEvents = events.filter((e) => e.invitationId === inv.id);
      const invVersions = versions.filter((v) => v.invitationId === inv.id);
      const safeName = inv.slug || inv.id;
      invFolder.file(
        `${safeName}.json`,
        JSON.stringify(
          { invitation: inv, rsvps: invRsvps, events: invEvents, versions: invVersions },
          null,
          2
        )
      );
    }
  }

  zip.file(
    'README.txt',
    [
      '═══════════════════════════════════════',
      '  نسخة احتياطية من تطبيق "تحفة"',
      '═══════════════════════════════════════',
      `تاريخ التصدير: ${new Date().toLocaleString('ar-EG')}`,
      `عدد الدعوات: ${invitations.length}`,
      `عدد القوالب: ${templates.length}`,
      `عدد الردود: ${rsvps.length}`,
      '',
      'لاستعادة هذه النسخة:',
      '1. سجل دخول للوحة التحكم',
      '2. اذهب إلى الإعدادات > النسخ الاحتياطي',
      '3. اضغط "استعادة من ZIP" وارفع هذا الملف',
      '',
      'ملاحظة: كلمات مرور المستخدمين لا تُصدّر لأسباب أمنية.',
      '═══════════════════════════════════════'
    ].join('\n')
  );

  return await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}

export async function restoreFromZip(
  buffer: Buffer,
  ownerId: string
): Promise<{ restored: { invitations: number; templates: number; rsvps: number; events: number } }> {
  const zip = await JSZip.loadAsync(buffer);

  const readJson = async <T>(name: string): Promise<T[]> => {
    const file = zip.file(name);
    if (!file) return [];
    const text = await file.async('string');
    return JSON.parse(text);
  };

  const invitations = await readJson<{
    id: string;
    slug: string;
    title: string;
    data: string;
    brideName?: string | null;
    groomName?: string | null;
    weddingDate?: string | null;
    venueName?: string | null;
    venueAddress?: string | null;
    venueLat?: number | null;
    venueLng?: number | null;
    views?: number;
    isPublished?: boolean;
    expiresAt?: string | null;
    password?: string | null;
  }>('invitations.json');

  const templates = await readJson<{
    name: string;
    description?: string | null;
    category: string;
    isBuiltIn?: boolean;
    designKey?: string | null;
    colorKey?: string | null;
    fontKey?: string | null;
    data: string;
  }>('templates.json');

  const rsvps = await readJson<{
    invitationId: string;
    guestName: string;
    phone?: string | null;
    attending: boolean;
    guestsCount?: number;
    note?: string | null;
    isRead?: boolean;
  }>('rsvps.json');

  const events = await readJson<{
    invitationId: string;
    title: string;
    description?: string | null;
    startTime: string;
    endTime?: string | null;
    location?: string | null;
    order?: number;
  }>('events.json');

  // map الـ IDs القديمة إلى الجديدة
  const invMap = new Map<string, string>();

  // استعادة الدعوات
  for (const inv of invitations) {
    const created = await prisma.invitation.create({
      data: {
        slug: `${inv.slug}-r${Math.random().toString(36).slice(2, 6)}`,
        title: inv.title,
        data: inv.data,
        brideName: inv.brideName ?? null,
        groomName: inv.groomName ?? null,
        weddingDate: inv.weddingDate ? new Date(inv.weddingDate) : null,
        venueName: inv.venueName ?? null,
        venueAddress: inv.venueAddress ?? null,
        venueLat: inv.venueLat ?? null,
        venueLng: inv.venueLng ?? null,
        views: 0,
        isPublished: false,
        userId: ownerId
      }
    });
    invMap.set(inv.id, created.id);
  }

  // استعادة القوالب
  let templatesRestored = 0;
  for (const t of templates) {
    if (t.isBuiltIn) continue;
    await prisma.template.create({
      data: {
        name: `${t.name} (مُستعاد)`,
        description: t.description ?? null,
        category: t.category || 'restored',
        isBuiltIn: false,
        designKey: t.designKey ?? null,
        colorKey: t.colorKey ?? null,
        fontKey: t.fontKey ?? null,
        data: t.data,
        userId: ownerId
      }
    });
    templatesRestored++;
  }

  // استعادة الردود
  let rsvpsRestored = 0;
  for (const r of rsvps) {
    const newInvId = invMap.get(r.invitationId);
    if (!newInvId) continue;
    await prisma.rsvp.create({
      data: {
        invitationId: newInvId,
        guestName: r.guestName,
        phone: r.phone ?? null,
        attending: r.attending,
        guestsCount: r.guestsCount ?? 0,
        note: r.note ?? null,
        isRead: r.isRead ?? false
      }
    });
    rsvpsRestored++;
  }

  // استعادة الفعاليات
  let eventsRestored = 0;
  for (const ev of events) {
    const newInvId = invMap.get(ev.invitationId);
    if (!newInvId) continue;
    await prisma.weddingEvent.create({
      data: {
        invitationId: newInvId,
        title: ev.title,
        description: ev.description ?? null,
        startTime: new Date(ev.startTime),
        endTime: ev.endTime ? new Date(ev.endTime) : null,
        location: ev.location ?? null,
        order: ev.order ?? 0
      }
    });
    eventsRestored++;
  }

  return {
    restored: {
      invitations: invMap.size,
      templates: templatesRestored,
      rsvps: rsvpsRestored,
      events: eventsRestored
    }
  };
}
