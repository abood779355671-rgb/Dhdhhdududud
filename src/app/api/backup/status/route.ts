import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const user = await getCurrentUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const [invs, tpls, rsvps, evs] = await Promise.all([
    prisma.invitation.count({ where: { userId: user.userId } }),
    prisma.template.count({ where: { userId: user.userId } }),
    prisma.rsvp.count(),
    prisma.weddingEvent.count()
  ]);

  // قائمة النسخ الاحتياطية التلقائية المحفوظة
  const backupsDir = path.join(process.cwd(), 'backups');
  let autoBackups: { name: string; size: number; createdAt: string }[] = [];
  try {
    if (fs.existsSync(backupsDir)) {
      autoBackups = fs
        .readdirSync(backupsDir)
        .filter((f) => f.endsWith('.zip'))
        .map((f) => {
          const stat = fs.statSync(path.join(backupsDir, f));
          return {
            name: f,
            size: stat.size,
            createdAt: stat.mtime.toISOString()
          };
        })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 20);
    }
  } catch {
    autoBackups = [];
  }

  return NextResponse.json({
    counts: { invitations: invs, templates: tpls, rsvps, events: evs },
    autoBackups
  });
}
