'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MessageCircle } from 'lucide-react';
import { LogoLockup } from '@/components/Logo';
import { useState } from 'react';
const items=[['/','Beranda'],['/informasi','Informasi'],['/layanan','Layanan'],['/profil','Profil'],['/kontak','Kontak'],['/wilayah','Wilayah']];
export default function SiteHeader(){const path=usePathname();const [open,setOpen]=useState(false);return <header className="nav"><div className="container navinner"><Link href="/" onClick={()=>setOpen(false)}><LogoLockup/></Link><button className="menu" aria-label="Menu" onClick={()=>setOpen(!open)}><Menu/></button><nav className={`links ${open?'open':''}`}>{items.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)} className={path===href?'navActive':''}>{label}</Link>)}<Link href="/chatbot" onClick={()=>setOpen(false)} className="navBot"><MessageCircle size={16}/> Asisten</Link><Link href="/login" onClick={()=>setOpen(false)} className="pill">Admin</Link></nav></div></header>}
