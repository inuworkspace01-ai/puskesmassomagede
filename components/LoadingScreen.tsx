'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const LOGO_SRC = '/assets/logo-puskesmas-somagede.jpeg?v=20260911';

const support = [
  { key: 'banyumas', label: 'Kabupaten Banyumas', src: '/assets/loading-support/banyumas-logo.svg' },
  { key: 'germas', label: 'GERMAS', src: '/assets/loading-support/germas-logo.svg' },
  { key: 'kemenkes', label: 'Kementerian Kesehatan', src: '/assets/loading-support/kemenkes-logo.svg' },
  { key: 'dinkominfo', label: 'Dinkominfo Banyumas', src: '/assets/loading-support/dinkominfo-logo.svg' },
] as const;

function SupportLogo({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="bootSupportLogo" width={150} height={54} loading="eager" decoding="async" />;
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logoReady, setLogoReady] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const preload = new Image();
    preload.decoding = 'sync';
    preload.src = LOGO_SRC;
    const done = () => setLogoReady(true);
    const fail = () => setLogoFailed(true);
    preload.addEventListener('load', done);
    preload.addEventListener('error', fail);
    return () => {
      preload.removeEventListener('load', done);
      preload.removeEventListener('error', fail);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let frame = 0;
    const started = performance.now();
    const duration = 2400;
    const tick = (now: number) => {
      if (!alive) return;
      const value = Math.min(100, Math.round(((now - started) / duration) * 100));
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const hide = window.setTimeout(() => setVisible(false), 1900);
    return () => window.clearTimeout(hide);
  }, [progress]);

  if (!visible) return null;
  const done = progress >= 100;

  return (
    <div className={`bootSplash${done ? ' bootDone' : ''}`} role="status" aria-live="polite" aria-label="Memuat Portal Puskesmas Somagede">
      <div className="bootCenter">
        <div className="bootEyebrow">PORTAL DIGITAL • PUSKESMAS SOMAGEDE</div>

        <div className={`bootLogoShell${logoReady ? ' logoReady' : ''}`}>
          <div className="bootLogoOrbit" aria-hidden="true" />
          <div className="bootLogoCard">
            {logoFailed ? (
              <div className="bootPuskesmasFallback" aria-label="Logo Puskesmas Somagede" role="img">
                <span>♥</span><b>PUSKESMAS</b><strong>SOMAGEDE</strong>
              </div>
            ) : (
              <img
                src={LOGO_SRC}
                alt="Logo Puskesmas Somagede"
                width={96}
                height={96}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                onLoad={() => setLogoReady(true)}
                onError={() => setLogoFailed(true)}
              />
            )}
          </div>
        </div>

        <h1><span>PUSKESMAS</span><strong>SOMAGEDE</strong></h1>
        <p>Melayani dengan Hati, Sehat Bersama Kami</p>

        <div className="bootLoader">
          <div className="bootLoaderTop"><span>{done ? 'PORTAL SIAP' : 'MENYIAPKAN PORTAL'}</span><b>{progress}%</b></div>
          <div className="bootTrack"><i style={{ transform: `translate3d(${progress - 100}%,0,0)` }} /></div>
          {!done && <div className="bootDots"><i /><i /><i /></div>}
        </div>

        <div className={`bootSupport${done ? ' isVisible' : ''}`} aria-hidden={!done}>
          <div className="bootSupportTitle"><span className="bootSupportRule" /><span>DIDUKUNG OLEH</span><span className="bootSupportRule" /></div>
          <div className="bootSupportGrid">
            {support.map((item, index) => (
              <div className="bootSupportItem isLoaded" key={item.key} style={{ '--support-delay': `${index * 120}ms` } as CSSProperties}>
                <div className="bootSupportHalo" />
                <div className="bootSupportLogoFrame">
                  <SupportLogo src={item.src} alt={item.label} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bootFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
    </div>
  );
}
