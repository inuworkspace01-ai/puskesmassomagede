'use client';
import { useEffect, useState } from 'react';

const LOGO_SRC = '/assets/logo-puskesmas-somagede.jpeg?v=20260910';
const support = [
  { key: 'banyumas', label: 'Kabupaten Banyumas', mark: 'B' },
  { key: 'germas', label: 'GERMAS', mark: 'G' },
  { key: 'kemenkes', label: 'Kementerian Kesehatan', mark: 'K' },
  { key: 'dinkominfo', label: 'Dinkominfo Banyumas', mark: 'DI' },
] as const;

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    const preload = new Image();
    preload.decoding = 'sync';
    preload.src = LOGO_SRC;
    const done = () => setLogoReady(true);
    preload.addEventListener('load', done);
    return () => preload.removeEventListener('load', done);
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
            <img
              src={LOGO_SRC}
              alt="Logo Puskesmas Somagede"
              width={96}
              height={96}
              loading="eager"
              decoding="sync"
              fetchPriority="high"
              onLoad={() => setLogoReady(true)}
            />
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
              <div className="bootSupportItem isLoaded" key={item.key} style={{ '--support-delay': `${index * 120}ms` } as React.CSSProperties}>
                <div className="bootSupportHalo" />
                <div className="bootSupportMark" aria-hidden="true">{item.mark}</div>
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
