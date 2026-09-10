'use client';

import { useEffect, useState, type CSSProperties } from 'react';

const LOGO_SRC = '/assets/logo-puskesmas-somagede.jpeg?v=20260911';

type SupportItem = {
  key: string;
  label: string;
  file: string;
  fallback: string;
};

const support: SupportItem[] = [
  { key: 'banyumas', label: 'Kabupaten Banyumas', file: 'banyumas.webp.b64', fallback: 'B' },
  { key: 'germas', label: 'GERMAS', file: 'germas.jpg.b64', fallback: 'G' },
  { key: 'kemenkes', label: 'Kementerian Kesehatan', file: 'kemenkes.jpg.b64', fallback: 'K' },
  { key: 'dinkominfo', label: 'Dinkominfo Banyumas', file: 'dinkominfo.jpg.b64', fallback: 'DI' },
];

function base64ToObjectUrl(value: string, mime: string) {
  const clean = value.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logoReady, setLogoReady] = useState(false);
  const [supportSrc, setSupportSrc] = useState<Record<string, string>>({});

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
    const created: string[] = [];

    const loadSupport = async () => {
      const entries: Record<string, string> = {};
      await Promise.all(
        support.map(async (item) => {
          try {
            const response = await fetch(`/assets/loading-support/${item.file}`, { cache: 'force-cache' });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const text = await response.text();
            const mime = item.file.endsWith('.webp.b64') ? 'image/webp' : 'image/jpeg';
            const objectUrl = base64ToObjectUrl(text, mime);
            created.push(objectUrl);
            entries[item.key] = objectUrl;
          } catch {
            // Keep the polished monogram fallback instead of ever showing a broken image icon.
          }
        }),
      );
      if (alive) setSupportSrc(entries);
    };

    void loadSupport();
    return () => {
      alive = false;
      created.forEach((url) => URL.revokeObjectURL(url));
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
            {support.map((item, index) => {
              const src = supportSrc[item.key];
              return (
                <div className="bootSupportItem isLoaded" key={item.key} style={{ '--support-delay': `${index * 120}ms` } as CSSProperties}>
                  <div className="bootSupportHalo" />
                  <div className="bootSupportLogoFrame">
                    {src ? (
                      <img src={src} alt={item.label} className="bootSupportLogo" loading="eager" decoding="async" />
                    ) : (
                      <div className="bootSupportMark" aria-hidden="true">{item.fallback}</div>
                    )}
                  </div>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bootFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
    </div>
  );
}
