'use client';
import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import FloatingChat from '@/components/FloatingChat';
export default function SiteChrome({children}:{children:React.ReactNode}){const p=usePathname();const bare=p.startsWith('/admin')||p==='/login';return bare?<>{children}</>:<><SiteHeader/>{children}<FloatingChat/><SiteFooter/></>}
