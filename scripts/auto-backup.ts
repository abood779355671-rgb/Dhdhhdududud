import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';

const prisma = new PrismaClient();

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  نسخ احتياطي تلقائي — تحفة');
  console.log('═══════════════════════════════════════');

  const backupsDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });

  const zip = new JSZip();

  const [users, invitations, templates, rsvps, events, versions] = await Promise.all([
    prisma.user.findMany(),
    prisma.invitation.findMany(),
    prisma.template.findMany(),
    prisma.rsvp.findMany(),
    prisma.weddingEvent.findMany(),
    prisma.invitationVersion.findMany()
  ]);

  const manifest = {
    version: 1,
    exportedAt: new Date().toISOString(),
    appName: 'تحفة',
    type: 'auto-backup',
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
    JSON.stringify(users.map((u) => ({ ...u, password: '[REDACTED]' })), null, 2)
  );
  zip.file('invitations.json', JSON.stringify(invitations, null, 2));
  zip.file('templates.json', JSON.stringify(templates, null, 2));
  zip.file('rsvps.json', JSON.stringify(rsvps, null, 2));
  zip.file('events.json', JSON.stringify(events, null, 2));
  zip.file('versions.json', JSON.stringify(versions, null, 2));

  // نسخ SQLite الخام
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  if (fs.existsSync(dbPath)) {
    const dbBuf = fs.readFileSync(dbPath);
    zip.file('dev.db', dbBuf);
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `tohfa-auto-${stamp}.zip`;
  const outPath = path.join(backupsDir, filename);
  fs.writeFileSync(outPath, buffer);

  console.log(`✓ تم إنشاء النسخة: ${filename}`);
  console.log(`  الحجم: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log(`  المسار: ${outPath}`);

  // الاحتفاظ بآخر 30 نسخة فقط
  const all = fs
    .readdirSync(backupsDir)
    .filter((f) => f.startsWith('tohfa-auto-') && f.endsWith('.zip'))
    .map((f) => ({ name: f, time: fs.statSync(path.join(backupsDir, f)).mtimeMs }))
    .sort((a, b) => b.time - a.time);

  if (all.length > 30) {
    const toDelete = all.slice(30);
    for (const f of toDelete) {
      fs.unlinkSync(path.join(backupsDir, f.name));
      console.log(`  حُذفت نسخة قديمة: ${f.name}`);
    }
  }

  console.log('═══════════════════════════════════════');
  console.log(`  ✓ النسخة جاهزة (إجمالي ${Math.min(all.length, 30)} نسخة محفوظة)`);
  console.log('═══════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('✗ فشل النسخ الاحتياطي:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
