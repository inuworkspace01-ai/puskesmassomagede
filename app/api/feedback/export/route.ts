import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {verifySession} from '@/lib/auth';
import {ensureDatabase,db} from '@/lib/db';
import * as XLSX from 'xlsx';
export const runtime='nodejs';
export async function GET(){const c=await cookies();const s=await verifySession(c.get('ps_session')?.value||'');if(!s||s.role==='staf_informasi')return NextResponse.json({error:'Akses ditolak'},{status:403});try{await ensureDatabase();const rows=await db()`SELECT created_at,name,category,service,rating,message,contact FROM visitor_feedback ORDER BY created_at DESC`;const data=rows.map((r:any)=>({'Tanggal':new Date(r.created_at).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'}),'Nama':r.name||'Anonim','Jenis':r.category,'Layanan':r.service||'','Rating':Number(r.rating),'Saran / Keluhan':r.message,'Kontak':r.contact||''}));const ws=XLSX.utils.json_to_sheet(data);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Pengunjung');const out=XLSX.write(wb,{type:'buffer',bookType:'xlsx'});return new NextResponse(out,{status:200,headers:{'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','Content-Disposition':'attachment; filename="hasil-pengunjung-puskesmas-somagede.xlsx"'}})}catch(e){console.error('FEEDBACK_EXPORT_ERROR',e);return NextResponse.json({error:'Export gagal.'},{status:500})}}
