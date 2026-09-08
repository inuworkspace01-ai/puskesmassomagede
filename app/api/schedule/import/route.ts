import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as XLSX from 'xlsx';
import { ensureDatabase, db } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export const runtime = 'nodejs';

async function session() {
  const c = await cookies();
  return verifySession(c.get('ps_session')?.value || '');
}

function text(v: unknown, max = 1000) {
  return String(v ?? '').trim().slice(0, max);
}

function normalizeKey(v: unknown) {
  return text(v, 100).toLowerCase().replace(/[\s_./()-]+/g, '');
}

function pick(row: Record<string, unknown>, names: string[]) {
  const wanted = names.map(normalizeKey);
  const key = Object.keys(row).find((k) => wanted.includes(normalizeKey(k)));
  return key ? row[key] : '';
}

function category(v: unknown) {
  const x = text(v, 100).toLowerCase();
  if (x.includes('bidan') || x.includes('jaga')) return 'Bidan Jaga';
  if (x.includes('vk') || x.includes('mtbs')) return 'VK / MTBS';
  if (x.includes('rujuk') || x.includes('poli')) return 'Rujukan / Poli';
  if (x.includes('skrining') || x.includes('bpjs')) return 'Skrining BPJS';
  return text(v, 100) || 'Lainnya';
}

export async function POST(req: Request) {
  try {
    const s = await session();
    if (!s || s.role === 'staf_informasi') {
      return NextResponse.json({ error: 'Akses ditolak. Import jadwal hanya untuk Admin dan Super Admin.' }, { status: 403 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File Excel belum dipilih.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran Excel maksimal 5 MB.' }, { status: 413 });
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith('.xlsx') && !name.endsWith('.xls') && !name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Format harus .xlsx, .xls, atau .csv.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: 'array', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) return NextResponse.json({ error: 'Sheet pertama tidak ditemukan.' }, { status: 400 });

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
    if (!rows.length) return NextResponse.json({ error: 'Excel tidak berisi data.' }, { status: 400 });

    const parsed = rows.map((row) => ({
      title: text(pick(row, ['judul', 'nama jadwal', 'nama', 'layanan', 'kegiatan']), 180),
      category: category(pick(row, ['kategori', 'category', 'jenis'])),
      day: text(pick(row, ['hari', 'tanggal', 'hari/shift', 'shift']), 100),
      time: text(pick(row, ['jam', 'waktu', 'jam pelayanan', 'time']), 100),
      staff: text(pick(row, ['petugas', 'bidan', 'dokter', 'nama petugas', 'tim']), 160),
      notes: text(pick(row, ['keterangan', 'catatan', 'notes']), 1000),
    })).filter((r) => r.title && r.day && r.time);

    if (!parsed.length) {
      return NextResponse.json({
        error: 'Tidak ada baris valid. Gunakan kolom minimal: Judul/Nama Jadwal, Hari/Shift, dan Jam.',
      }, { status: 400 });
    }

    if (parsed.length > 500) {
      return NextResponse.json({ error: 'Maksimal 500 jadwal sekali import.' }, { status: 400 });
    }

    await ensureDatabase();
    const sql = db();

    for (const r of parsed) {
      const id = `schedule-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      await sql`INSERT INTO site_schedules (id,title,category,day,time,staff,notes,published) VALUES (${id},${r.title},${r.category},${r.day},${r.time},${r.staff},${r.notes},TRUE)`;
    }

    return NextResponse.json({ ok: true, imported: parsed.length, skipped: rows.length - parsed.length });
  } catch (error) {
    console.error('SCHEDULE_IMPORT_ERROR', error);
    return NextResponse.json({ error: 'Gagal membaca atau menyimpan Excel.' }, { status: 500 });
  }
}
