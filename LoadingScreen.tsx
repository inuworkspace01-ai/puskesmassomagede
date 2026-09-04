'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const started = performance.now();
    const duration = 1850;

    const tick = (now: number) => {
      const elapsed = now - started;
      const raw = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.round(eased * 100));
      if (raw < 1) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setVisible(false), 180);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;

  return (
    <div className="loadingScreen" role="status" aria-label="Memuat Puskesmas Somagede">
      <div className="loadingGlow loadingGlowA" />
      <div className="loadingGlow loadingGlowB" />
      <div className="loadingHexes" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>
      <div className="loadingPlus plusA">+</div>
      <div className="loadingPlus plusB">+</div>
      <div className="loadingRings" aria-hidden="true"><i /><i /><i /></div>

      <main className="loadingContent">
        <div className="loadingLogoWrap">
          <div className="loadingLogoHalo" />
          <div className="loadingLogoCard">
            <img src="/assets/logo-puskesmas-somagede.jpeg" alt="Logo Puskesmas Somagede" />
          </div>
        </div>

        <div className="loadingTitle">
          <span>PUSKESMAS</span>
          <strong>SOMAGEDE</strong>
        </div>
        <p className="loadingTagline">Melayani dengan Hati, Sehat Bersama Kami</p>

        <div className="loadingStatus">
          <div className="loadingStatusTop">
            <span>MEMUAT<span className="loadingDots">...</span></span>
            <b>{progress}%</b>
          </div>
          <div className="loadingTrack"><span style={{ width: `${progress}%` }} /></div>
          <div className="loadingMicro"><span /><span /><span /></div>
        </div>
      </main>

      <div className="loadingFooter">PORTAL INFORMASI &amp; LAYANAN PUBLIK</div>
      <div className="loadingWave loadingWaveBack" />
      <div className="loadingWave loadingWaveMid" />
      <div className="loadingWave loadingWaveFront" />
    </div>
  );
}
