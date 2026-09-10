'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div key={pathname} className="pageTransition pageTransitionEnter">
      {children}
    </div>
  );
}
