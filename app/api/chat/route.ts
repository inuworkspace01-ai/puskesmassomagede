import { NextResponse } from 'next/server';

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

  return raw
    .slice(-12)
    .map((m: any) => ({
      role: m?.role === 'assistant' ? 'assistant' : 'user',
      content: String(m?.content ?? '').trim().slice(0, 3000),
    }))
    .filter((m) => m.content);
}

const SYSTEM = `
Kamu adalah Asisten Digital resmi Portal Puskesmas Somagede.
Jawab dalam Bahasa Indonesia dengan ramah, singkat, jelas, dan membantu.
Berikan informasi umum tentang layanan Puskesmas Somagede.
Untuk kondisi medis darurat, arahkan pengguna segera ke fasilitas kesehatan
atau layanan darurat terdekat. Jangan memberikan diagnosis pasti.
`;

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

    if (!allowed(ip)) {
      return NextResponse.json(
        {
          reply:
            'Terlalu banyak permintaan. Silakan coba lagi sebentar.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const messages = cleanMessages(body?.messages);

    if (!messages.length || messages.length > 20) {
      return NextResponse.json(
        {
          reply: 'Pertanyaan belum terbaca. Silakan coba lagi.',
        },
        { status: 400 }
      );
    }

    const key = process.env.OPENAI_API_KEY?.trim();

    if (!key) {
      return NextResponse.json(
        {
          reply:
            'Asisten AI belum aktif. Pastikan OPENAI_API_KEY sudah ditambahkan di Vercel, lalu lakukan Redeploy.',
        },
        { status: 503 }
      );
    }

    const model = (
      process.env.OPENAI_MODEL || 'gpt-5.6-luna'
    ).trim();

    const input = [
      {
        role: 'developer',
        content: SYSTEM,
      },
      ...messages,
    ];

    const response = await fetch(
      'https://api.openai.com/v1/responses',
      {
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
      }
    );

    const raw = await response.text();

    let data: any = {};

    try {
      data = JSON.parse(raw);
    } catch {
      // Response bukan JSON.
    }

    if (!response.ok) {
      console.error(
        'OPENAI_API_ERROR',
        JSON.stringify({
          status: response.status,
          error: data?.error?.message || raw.slice(0, 500),
          type: data?.error?.type,
          code: data?.error?.code,
          model,
        })
      );

      const code = data?.error?.code;

      if (response.status === 401) {
        return NextResponse.json(
          {
            reply:
              'API key AI ditolak. Periksa API key di Vercel dan lakukan Redeploy.',
          },
          { status: 502 }
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          {
            reply: `Akses model ${model} ditolak oleh project API. Coba ubah OPENAI_MODEL ke model yang tersedia di project OpenAI kamu, lalu Redeploy.`,
          },
          { status: 502 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            reply:
              'Layanan AI sedang mencapai batas penggunaan atau saldo API belum tersedia. Periksa Billing/Usage project OpenAI kamu.',
          },
          { status: 502 }
        );
      }

      if (code === 'model_not_found' || response.status === 404) {
        return NextResponse.json(
          {
            reply: `Model ${model} tidak tersedia untuk API key ini. Ubah OPENAI_MODEL ke model yang tersedia di project OpenAI kamu.`,
          },
          { status: 502 }
        );
      }

      return NextResponse.json(
        {
          reply:
            'OpenAI mengembalikan error. Cek Vercel Logs untuk detail error.',
        },
        { status: 502 }
      );
    }

    // Ambil teks dari output_text terlebih dahulu.
    // Jika kosong, fallback ke struktur output[].content[].
    const reply =
      typeof data?.output_text === 'string'
        ? data.output_text.trim()
        : Array.isArray(data?.output)
          ? data.output
              .flatMap((item: any) =>
                Array.isArray(item?.content) ? item.content : []
              )
              .filter(
                (item: any) => item?.type === 'output_text'
              )
              .map((item: any) => String(item?.text || ''))
              .join('')
              .trim()
          : '';

    if (!reply) {
      console.error(
        'OPENAI_EMPTY_OUTPUT',
        JSON.stringify(data, null, 2).slice(0, 5000)
      );

      return NextResponse.json(
        {
          reply:
            'AI menerima pertanyaan, tetapi belum mengembalikan teks. Silakan coba lagi.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('CHAT_ROUTE_ERROR', error);

    return NextResponse.json(
      {
        reply:
          'Terjadi kendala pada koneksi Asisten. Silakan coba lagi.',
      },
      { status: 500 }
    );
  }
}
