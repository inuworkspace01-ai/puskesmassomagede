import { neon } from '@neondatabase/serverless';
import { SEPTEMBER_PERAWAT_SCHEDULES } from './perawatSeptember';

let initialized: Promise<void> | null = null;

export function db() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

export async function ensureDatabase() {
  if (initialized) return initialized;
  initialized = (async () => {
    const sql = db();
    await sql`CREATE TABLE IF NOT EXISTS site_content (id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT NOT NULL,category TEXT NOT NULL DEFAULT 'Berita',image_url TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),published_at TIMESTAMPTZ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS site_schedules (id TEXT PRIMARY KEY,title TEXT NOT NULL,category TEXT NOT NULL,day TEXT NOT NULL,time TEXT NOT NULL,staff TEXT NOT NULL DEFAULT '',notes TEXT NOT NULL DEFAULT '',published BOOLEAN NOT NULL DEFAULT TRUE,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS visitor_feedback (id TEXT PRIMARY KEY,name TEXT NOT NULL DEFAULT '',category TEXT NOT NULL DEFAULT 'Saran',message TEXT NOT NULL,rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),service TEXT NOT NULL DEFAULT '',contact TEXT NOT NULL DEFAULT '',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    const existing = await sql`SELECT COUNT(*)::int AS count FROM site_content`;
    if (Number(existing[0]?.count || 0) === 0) await sql`INSERT INTO site_content (id,title,description,category,image_url,status,published_at) VALUES ('seed-tbc-ckg','Jadwal tracing TBC & integrasi CKG','Informasi kegiatan lapangan dan integrasi CKG di wilayah kerja Puskesmas Somagede.','Kegiatan','', 'published', NOW()),('seed-germas','Edukasi GERMAS: hidup aktif dan sehat','Ayo biasakan aktivitas fisik, konsumsi pangan sehat, dan cek kesehatan secara berkala.','Edukasi','', 'published', NOW())`;
    const schedules = await sql`SELECT COUNT(*)::int AS count FROM site_schedules`;
    if (Number(schedules[0]?.count || 0) === 0) {
      const rows = [['sched-rujukan','Rujukan & poli','Rujukan / Poli','Sesuai pelayanan','Belum diatur','Belum diatur','Hubungi petugas untuk jadwal dan alur rujukan.'],['sched-vk-mtbs','Pelayanan VK / MTBS','VK / MTBS','Sesuai jadwal','Belum diatur','Belum diatur','Jadwal petugas diisi melalui dashboard admin.'],['sched-bidan-pagi','Bidan jaga pagi','Bidan Jaga','Pagi','Belum diatur','Belum diatur','Nama petugas diisi melalui dashboard admin.'],['sched-bidan-sore','Bidan jaga sore','Bidan Jaga','Sore','Belum diatur','Belum diatur','Nama petugas diisi melalui dashboard admin.'],['sched-bidan-malam','Bidan jaga malam','Bidan Jaga','Malam','Belum diatur','Belum diatur','Nama petugas diisi melalui dashboard admin.'],['sched-skrining-bpjs','Skrining BPJS','Skrining BPJS','Belum diatur','Belum diatur','Belum diatur','Hari, jam, dan petugas diisi melalui dashboard admin.']];
      for (const [id,title,category,day,time,staff,notes] of rows) await sql`INSERT INTO site_schedules (id,title,category,day,time,staff,notes,published) VALUES (${id},${title},${category},${day},${time},${staff},${notes},TRUE)`;
    }
    const perawat = await sql`SELECT COUNT(*)::int AS count FROM site_schedules WHERE category='Perawat' AND id LIKE 'perawat-2026-09-%'`;
    if (Number(perawat[0]?.count || 0) === 0) for (const [id,title,category,day,time,staff,notes] of SEPTEMBER_PERAWAT_SCHEDULES) await sql`INSERT INTO site_schedules (id,title,category,day,time,staff,notes,published) VALUES (${id},${title},${category},${day},${time},${staff},${notes},TRUE) ON CONFLICT (id) DO NOTHING`;
  })();
  return initialized;
}
