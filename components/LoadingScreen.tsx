'use client';

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exit' | 'done'>('loading');

  useEffect(() => {
    const duration = 2600;
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const raw = Math.min((now - started) / duration, 1);
      // Smooth cinematic easing, but keep the last 10% slightly longer.
      const eased = raw < 0.9
        ? (1 - Math.pow(1 - raw / 0.9, 2.6)) * 0.9
        : 0.9 + ((raw - 0.9) / 0.1) * 0.1;
      setProgress(Math.min(100, Math.round(eased * 100)));

      if (raw < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        window.setTimeout(() => setPhase('exit'), 260);
        window.setTimeout(() => setPhase('done'), 850);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      className={`loadingScreen ${phase === 'exit' ? 'loadingScreenExit' : ''}`}
      role="status"
      aria-label="Memuat Puskesmas Somagede"
      aria-live="polite"
    >
      <div className="loadingNoise" aria-hidden="true" />
      <div className="loadingGlow loadingGlowA" />
      <div className="loadingGlow loadingGlowB" />

      <div className="loadingHexes" aria-hidden="true">
        <span /><span /><span /><span /><span /><span />
      </div>
      <div className="loadingPlus plusA" aria-hidden="true">+</div>
      <div className="loadingPlus plusB" aria-hidden="true">+</div>
      <div className="loadingRings" aria-hidden="true"><i /><i /><i /></div>

      <main className="loadingContent">
        <div className="loadingLogoWrap">
          <div className="loadingLogoOrbit" aria-hidden="true"><span /></div>
          <div className="loadingLogoHalo" />
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
      <div className="loadingWave loadingWaveBack" />
      <div className="loadingWave loadingWaveMid" />
      <div className="loadingWave loadingWaveFront" />
    </div>
  );
}
