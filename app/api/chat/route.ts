import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM = `Kamu adalah Asisten Digital resmi Portal Puskesmas Somagede, Banyumas.
Jawab dalam Bahasa Indonesia yang ramah, singkat, jelas, dan faktual. Jangan mengarang.
DATA RESMI PORTAL:
- Alamat: Jl. Raya Somagede No. 37, Kecamatan Somagede, Kabupaten Banyumas, Jawa Tengah.
- Pendaftaran: Senin-Kamis 07.30-12.00 WIB; Jumat 07.30-11.00 WIB; Sabtu 07.30-12.00 WIB; Minggu tutup.
- Wilayah kerja: Kanding, Kemawi, Klinting, Piasa Kulon, Plana, Sokawera, Somagede, Somakaton, Tanggeran.
- WhatsApp/Hotline: 0813-9210-0071.
- Instagram: @puskesmassomagede.
- Facebook: Puskesmas Somagede.
Jika informasi belum tersedia, katakan belum tersedia dan sarankan menghubungi Puskesmas.
Jangan memberikan diagnosis, resep, atau keputusan medis individual. Untuk keadaan darurat, sarankan mencari pertolongan medis segera.`;

const buckets = new Map<string, { count: number; at: number }>();
function allowed(ip: string) {
  const now = Date.now();
  const old = buckets.get(ip);
  if (!old || now - old.at > 60_000) {
    buckets.set(ip, { count: 1, at: now });
    return true;
  }
  if (old.count >= 30) return false;
  old.count++;
  return true;
}

function cleanMessages(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(-12).map((m: any) => ({
    role: m?.role === 'assistant' ? 'assistant' : 'user',
    content: String(m?.content ?? '').trim().slice(0, 3000),
  })).filter((m) => m.content);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!allowed(ip)) {
      return NextResponse.json({ reply: 'Terlalu banyak permintaan. Silakan coba lagi sebentar.' }, { status: 429 });
    }

    const body = await req.json();
    const messages = cleanMessages(body?.messages);
    if (!messages.length || messages.length > 20) {
      return NextResponse.json({ reply: 'Pertanyaan belum terbaca. Silakan coba lagi.' }, { status: 400 });
    }

    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key) {
      return NextResponse.json({
        reply: 'Asisten AI belum aktif. Pastikan OPENAI_API_KEY sudah ditambahkan di Vercel, lalu lakukan Redeploy.',
      }, { status: 503 });
    }

    const model = (process.env.OPENAI_MODEL || 'gpt-5.6-luna').trim();
    const input = [
      { role: 'developer', content: SYSTEM },
      ...messages,
    ];

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        input,
        max_output_tokens: 600,
      }),
      cache: 'no-store',
    });

    const raw = await response.text();
    let data: any = {};
    try { data = JSON.parse(raw); } catch { /* keep empty */ }

    if (!response.ok) {
      console.error('OPENAI_API_ERROR', JSON.stringify({
        status: response.status,
        error: data?.error?.message || raw.slice(0, 500),
        type: data?.error?.type,
        code: data?.error?.code,
        model,
      }));

      const code = data?.error?.code;
      if (response.status === 401) {
        return NextResponse.json({ reply: 'API key AI ditolak. Periksa API key di Vercel dan lakukan Redeploy.' }, { status: 502 });
      }
      if (response.status === 403) {
        return NextResponse.json({ reply: `Akses model ${model} ditolak oleh project API. Coba ubah OPENAI_MODEL ke model yang tersedia di project OpenAI kamu, lalu Redeploy.` }, { status: 502 });
      }
      if (response.status === 429) {
        return NextResponse.json({ reply: 'Layanan AI sedang mencapai batas penggunaan atau saldo API belum tersedia. Periksa Billing/Usage project OpenAI kamu.' }, { status: 502 });
      }
      if (code === 'model_not_found' || response.status === 404) {
        return NextResponse.json({ reply: `Model ${model} tidak tersedia untuk API key ini. Ubah OPENAI_MODEL ke model yang tersedia di project OpenAI kamu.` }, { status: 502 });
      }
      return NextResponse.json({ reply: 'OpenAI mengembalikan error. Cek Vercel Logs untuk detail error.' }, { status: 502 });
    }

    const reply = typeof data?.output_text === 'string' ? data.output_text.trim() : '';
    if (!reply) {
      console.error('OPENAI_EMPTY_OUTPUT', JSON.stringify(data).slice(0, 2000));
      return NextResponse.json({ reply: 'AI menerima pertanyaan, tetapi belum mengembalikan teks. Silakan coba lagi.' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('CHAT_ROUTE_ERROR', error);
    return NextResponse.json({ reply: 'Terjadi kendala pada koneksi Asisten. Silakan coba lagi.' }, { status: 500 });
  }
}
