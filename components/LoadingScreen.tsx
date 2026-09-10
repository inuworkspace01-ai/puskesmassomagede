'use client';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const hideTimer = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(hideTimer);
  }, []);

  if (!visible) return null;
  return <div className="bootSplash" role="status" aria-live="polite" aria-label="Memuat Portal Puskesmas Somagede">
    <div className="bootCenter">
      <div className="bootEyebrow">PORTAL DIGITAL • PUSKESMAS SOMAGEDE</div>
      <div className="bootLogoShell">
        <div className="bootLogoCard"><img src="/assets/logo-puskesmas-somagede.jpeg" alt="Logo Puskesmas Somagede" /></div>
      </div>
      <h1><span>PUSKESMAS</span><strong>SOMAGEDE</strong></h1>
      <p>Melayani dengan Hati, Sehat Bersama Kami</p>
      <div className="bootLoader"><div className="bootLoaderTop"><span>MENYIAPKAN PORTAL</span><b>100%</b></div><div className="bootTrack"><i /></div><div className="bootDots"><i/><i/><i/></div></div>
    </div>
    <div className="bootFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
  </div>;
}
