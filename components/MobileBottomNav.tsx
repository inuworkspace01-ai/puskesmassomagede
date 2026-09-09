'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Newspaper, Stethoscope, MapPinned, MoreHorizontal, X, UserRound, Phone, MessageSquareHeart, MessageCircle, Download } from 'lucide-react';
import { useState } from 'react';

const extra = [
  ['/profil', 'Profil', UserRound],
  ['/kontak', 'Kontak', Phone],
  ['/masukan', 'Saran & Keluhan', MessageSquareHeart],
  ['/chatbot', 'Asisten', MessageCircle],
  ['/download', 'Aplikasi', Download],
] as const;

export default function MobileBottomNav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const active = (href: string) => href === '/' ? path === '/' : path.startsWith(href);
  return <>
    <nav className="mobileBottomNav" aria-label="Navigasi mobile">
      <Link href="/" className={active('/') ? 'navActive' : ''}><Home size={20}/><span>Beranda</span></Link>
      <Link href="/informasi" className={active('/informasi') ? 'navActive' : ''}><Newspaper size={20}/><span>Informasi</span></Link>
      <Link href="/layanan" className={active('/layanan') ? 'navActive' : ''}><Stethoscope size={20}/><span>Layanan</span></Link>
      <Link href="/wilayah" className={active('/wilayah') ? 'navActive' : ''}><MapPinned size={20}/><span>Wilayah</span></Link>
      <button type="button" className={open ? 'mobileMore mobileMoreOpen' : 'mobileMore'} aria-expanded={open} onClick={() => setOpen(v => !v)}>
        {open ? <X size={21}/> : <MoreHorizontal size={21}/>}<span>Menu</span>
      </button>
    </nav>
    {open && <div className="mobileMorePanel" role="menu">
      {extra.map(([href, label, Icon]) => <Link key={href} href={href} onClick={() => setOpen(false)} role="menuitem"><Icon size={17}/><span>{label}</span></Link>)}
    </div>}
  </>;
}