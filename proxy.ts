import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
export async function proxy(req: NextRequest) { const path = req.nextUrl.pathname; if (!path.startsWith('/admin')) return NextResponse.next(); const token = req.cookies.get('ps_session')?.value; const session = token ? await verifySession(token) : null; if (!session) return NextResponse.redirect(new URL('/login', req.url)); if (session.role === 'staf_informasi' && path === '/admin/users') return NextResponse.redirect(new URL('/admin', req.url)); return NextResponse.next() }
export const config = { matcher: ['/admin/:path*'] };
