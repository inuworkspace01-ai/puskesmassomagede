'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const started = performance.now();
    const duration = 2200;
    let frame = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      const ratio = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      setProgress(Math.round(eased * 100));
      if (ratio < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    const hideTimer = window.setTimeout(() => setVisible(false), 2850);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="bootSplash" role="status" aria-live="polite" aria-label="Memuat Portal Puskesmas Somagede">
      <div className="bootAurora bootAuroraA" />
      <div className="bootAurora bootAuroraB" />
      <div className="bootGrid" />
      <div className="bootOrbit bootOrbitA" />
      <div className="bootOrbit bootOrbitB" />
      <div className="bootPlus bootPlusA">+</div>
      <div className="bootPlus bootPlusB">+</div>

      <div className="bootCenter">
        <div className="bootEyebrow">PORTAL DIGITAL • PUSKESMAS SOMAGEDE</div>
        <div className="bootLogoShell">
          <div className="bootOrbitRing"><span /></div>
          <div className="bootLogoGlow" />
          <div className="bootLogoCard">
            <img src="/assets/logo-puskesmas-somagede.jpeg" alt="Logo Puskesmas Somagede" />
          </div>
        </div>
        <h1><span>PUSKESMAS</span><strong>SOMAGEDE</strong></h1>
        <p>Melayani dengan Hati, Sehat Bersama Kami</p>
        <div className="bootLoader">
          <div className="bootLoaderTop"><span>MENYIAPKAN PORTAL</span><b className="bootPercent">{progress}%</b></div>
          <div className="bootTrack"><i style={{ width: `${progress}%` }} /></div>
          <div className="bootDots"><i /><i /><i /></div>
        </div>
      </div>

      <div className="bootFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
      <div className="bootWave bootWaveA" />
      <div className="bootWave bootWaveB" />
      <div className="bootWave bootWaveC" />
    </div>
  );
}
