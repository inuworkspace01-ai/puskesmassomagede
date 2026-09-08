import { NextResponse } from 'next/server';
import { ensureDatabase, db } from '@/lib/db';
export const runtime='nodejs';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){try{await ensureDatabase();const {id}=await params;const rows=await db()`SELECT id,title,description,category,image_url,status,published_at,created_at FROM site_content WHERE id=${decodeURIComponent(id)} AND status='published' LIMIT 1`;if(!rows.length)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.json({item:rows[0]},{headers:{'Cache-Control':'no-store'}})}catch(error){console.error('CONTENT_DETAIL_ERROR',error);return NextResponse.json({error:'Database belum terhubung.'},{status:503})}}
