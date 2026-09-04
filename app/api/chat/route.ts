import { NextResponse } from 'next/server';

const SYSTEM = `Kamu adalah Asisten Digital resmi untuk Portal Puskesmas Somagede, Banyumas.
Gunakan Bahasa Indonesia yang ramah, jelas, ringkas, dan jangan mengarang informasi.
Informasi dasar: alamat Puskesmas Somagede adalah Jl. Raya Somagede No. 37, Kecamatan Somagede, Kabupaten Banyumas.
Jam pendaftaran: Senin-Kamis 07.30-12.00 WIB; Jumat 07.30-11.00 WIB; Sabtu 07.30-12.00 WIB; Minggu tutup.
Wilayah kerja: Kanding, Kemawi, Klinting, Piasa Kulon, Plana, Sokawera, Somagede, Somakaton, dan Tanggeran.
WhatsApp/Hotline: 0813-9210-0071. Instagram: @puskesmassomagede. Facebook: Puskesmas Somagede.
Jika informasi belum tersedia, katakan bahwa informasi belum tersedia dan arahkan ke Puskesmas.
Untuk diagnosis, resep, penentuan penyakit, atau kondisi gawat darurat, jangan mendiagnosis. Arahkan pengguna untuk diperiksa tenaga kesehatan/fasilitas kesehatan.
`;

const buckets = new Map<string,{count:number;at:number}>();
function allowed(ip:string){
  const now=Date.now(); const old=buckets.get(ip);
  if(!old || now-old.at>60_000){buckets.set(ip,{count:1,at:now});return true;}
  if(old.count>=30)return false;
  old.count++; return true;
}

export async function POST(req:Request){
  try{
    const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
    if(!allowed(ip)) return NextResponse.json({reply:'Terlalu banyak permintaan. Silakan coba lagi sebentar.'},{status:429});
    const body=await req.json();
    const messages=Array.isArray(body?.messages)?body.messages:[];
    if(!messages.length || messages.length>20) return NextResponse.json({error:'Permintaan tidak valid.'},{status:400});

    const key=process.env.OPENAI_API_KEY;
    if(!key) return NextResponse.json({reply:'Asisten AI belum aktif. Admin perlu menambahkan OPENAI_API_KEY di Vercel Environment Variables.'});

    const model=process.env.OPENAI_MODEL||'gpt-5.6-luna';
    const input=[
      {role:'system',content:SYSTEM},
      ...messages.slice(-12).map((m:any)=>({
        role:m?.role==='assistant'?'assistant':'user',
        content:String(m?.content||'').slice(0,3000)
      }))
    ];

    const response=await fetch('https://api.openai.com/v1/responses',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body:JSON.stringify({model,input,max_output_tokens:600})
    });
    if(!response.ok){
      console.error('OpenAI response error',response.status,await response.text());
      return NextResponse.json({reply:'Maaf, Asisten sedang mengalami gangguan. Silakan coba lagi atau hubungi Puskesmas Somagede.'},{status:502});
    }
    const data=await response.json();
    return NextResponse.json({reply:data.output_text||'Maaf, saya belum dapat menjawab saat ini.'});
  }catch(error){
    console.error('Chat route error',error);
    return NextResponse.json({reply:'Maaf, terjadi kendala pada Asisten. Silakan coba lagi.'},{status:500});
  }
}
