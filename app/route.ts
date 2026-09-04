import {NextResponse} from 'next/server';
export async function POST(req:Request){const url=new URL('/login',req.url);const res=NextResponse.redirect(url,{status:303});res.cookies.set('ps_session','',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:0});return res}
