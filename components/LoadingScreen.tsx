'use client';

import { useEffect, useState } from 'react';

/**
 * Full-screen splash shown on every fresh document load.
 * The first render is intentionally visible before hydration, so the splash
 * does not depend on Next.js navigation or a network loading state.
 */
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const started = Date.now();
    const duration = 5000;
    let interval: ReturnType<typeof setInterval> | undefined;
    let closeTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const update = () => {
      const elapsed = Date.now() - started;
      const ratio = Math.min(elapsed / duration, 1);
      // Slow cinematic start, then a confident finish.
      const eased = 1 - Math.pow(1 - ratio, 2.2);
      setProgress(Math.round(eased * 100));

      if (ratio >= 1) {
        if (interval) clearInterval(interval);
        closeTimer = setTimeout(() => setClosing(true), 260);
        hideTimer = setTimeout(() => setHidden(true), 1100);
      }
    };

    interval = setInterval(update, 40);
    update();

    return () => {
      if (interval) clearInterval(interval);
      if (closeTimer) clearTimeout(closeTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`loadingScreen ${closing ? 'loadingScreenExit' : ''}`}
      role="status"
      aria-label="Memuat Portal Puskesmas Somagede"
      aria-live="polite"
    >
      <div className="loadingNoise" aria-hidden="true" />
      <div className="loadingGlow loadingGlowA" aria-hidden="true" />
      <div className="loadingGlow loadingGlowB" aria-hidden="true" />

      <div className="loadingHexes" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>
      <div className="loadingPlus plusA" aria-hidden="true">+</div>
      <div className="loadingPlus plusB" aria-hidden="true">+</div>
      <div className="loadingRings" aria-hidden="true"><i /><i /><i /></div>

      <main className="loadingContent">
        <div className="loadingLogoWrap">
          <div className="loadingLogoOrbit" aria-hidden="true"><span /></div>
          <div className="loadingLogoHalo" aria-hidden="true" />
          <div className="loadingLogoCard">
            <img src="/assets/logo-puskesmas-somagede.jpeg" alt="Logo Puskesmas Somagede" />
          </div>
        </div>

        <div className="loadingEyebrow">PORTAL INFORMASI &amp; LAYANAN PUBLIK</div>
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
          <div className="loadingTrack" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="loadingMicro" aria-hidden="true"><span /><span /><span /></div>
        </div>
      </main>

      <div className="loadingFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
      <div className="loadingWave loadingWaveBack" aria-hidden="true" />
      <div className="loadingWave loadingWaveMid" aria-hidden="true" />
      <div className="loadingWave loadingWaveFront" aria-hidden="true" />
    </div>
  );
}
