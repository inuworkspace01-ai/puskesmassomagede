import { NextResponse } from 'next/server';
const system = `Kamu adalah Asisten Puskesmas Somagede. Jawab dalam Bahasa Indonesia, ramah, singkat, dan hanya menyampaikan informasi yang diketahui. Puskesmas Somagede berada di Jl. Raya Somagede No. 37, Kecamatan Somagede, Kabupaten Banyumas. Pendaftaran: Senin-Kamis 07.30-12.00 WIB, Jumat 07.30-11.00 WIB, Sabtu 07.30-12.00 WIB. Jika pertanyaan membutuhkan diagnosis, resep, atau kondisi darurat, arahkan pengguna ke tenaga kesehatan/fasilitas kesehatan dan jangan membuat diagnosis. Jika informasi tidak tersedia, katakan belum tersedia dan sarankan menghubungi Puskesmas.`;
export async function POST(req:Request){
 try{
  const {messages=[]}=await req.json();
  if(!Array.isArray(messages)||messages.length>20)return NextResponse.json({error:'Permintaan tidak valid.'},{status:400});
  const key=process.env.OPENAI_API_KEY;
  if(!key)return NextResponse.json({reply:'Asisten AI belum diaktifkan. Admin perlu mengisi OPENAI_API_KEY di Vercel Environment Variables.'});
  const model=process.env.OPENAI_MODEL||'gpt-5.6-luna';
  const input=[{role:'system',content:system},...messages.slice(-12).map((m:any)=>({role:m.role==='assistant'?'assistant':'user',content:String(m.content).slice(0,3000)}))];
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify({model,input,max_output_tokens:500})});
  if(!r.ok){const text=await r.text();console.error(text);return NextResponse.json({reply:'Maaf, Asisten sedang mengalami gangguan. Silakan coba lagi atau hubungi Puskesmas Somagede.'},{status:502});}
  const data=await r.json(); return NextResponse.json({reply:data.output_text||'Maaf, saya belum dapat menjawab saat ini.'});
 }catch(e){console.error(e);return NextResponse.json({reply:'Maaf, terjadi kendala. Silakan coba lagi.'},{status:500});}
}
