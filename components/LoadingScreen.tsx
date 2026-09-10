'use client';
import { useEffect, useState } from 'react';

type SupportLogo = { key: string; label: string; src: string };

const LOGO_SRC = '/assets/logo-puskesmas-somagede.jpeg?v=20260910';
const support: SupportLogo[] = [
  { key: 'banyumas', label: 'Kabupaten Banyumas', src: '/assets/loading-support/banyumas.webp.b64' },
  { key: 'germas', label: 'GERMAS', src: '/assets/loading-support/germas.jpg.b64' },
  { key: 'kemenkes', label: 'Kementerian Kesehatan', src: '/assets/loading-support/kemenkes.jpg.b64' },
  { key: 'dinkominfo', label: 'Dinkominfo Banyumas', src: '/assets/loading-support/dinkominfo.jpg.b64' },
];

function decodeBase64(text: string) {
  const clean = text.replace(/^\uFEFF/, '').replace(/\s+/g, '');
  const mime = clean.startsWith('iVBORw0')
    ? 'image/png'
    : clean.startsWith('UklGR')
      ? 'image/webp'
      : clean.startsWith('/9j/')
        ? 'image/jpeg'
        : 'application/octet-stream';
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [supportVisible, setSupportVisible] = useState(false);
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    // Preload the real Puskesmas logo before the splash begins animating.
    const preload = new Image();
    preload.decoding = 'sync';
    preload.src = LOGO_SRC;
    const onLoad = () => setLogoReady(true);
    const onError = () => setLogoReady(false);
    preload.addEventListener('load', onLoad);
    preload.addEventListener('error', onError);
    return () => {
      preload.removeEventListener('load', onLoad);
      preload.removeEventListener('error', onError);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    let frame = 0;
    const started = performance.now();
    const duration = 2200;
    const tick = (now: number) => {
      if (!alive) return;
      const value = Math.min(100, Math.round(((now - started) / duration) * 100));
      setProgress(value);
      if (value < 100) frame = requestAnimationFrame(tick);
      else setSupportVisible(true);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    (async () => {
      const next: Record<string, string> = {};
      for (const item of support) {
        try {
          const response = await fetch(item.src, { cache: 'no-store' });
          if (!response.ok) continue;
          const url = decodeBase64(await response.text());
          urls.push(url);
          next[item.key] = url;
        } catch {
          // Keep the splash functional even if a support logo is unavailable.
        }
      }
      if (!cancelled) setLogos(next);
    })();
    return () => {
      cancelled = true;
      urls.forEach(URL.revokeObjectURL);
    };
  }, []);

  useEffect(() => {
    if (!supportVisible) return;
    const hide = window.setTimeout(() => setVisible(false), 5600);
    return () => window.clearTimeout(hide);
  }, [supportVisible]);

  if (!visible) return null;
  const done = progress >= 100;

  return (
    <div
      className={`bootSplash${done ? ' bootDone' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat Portal Puskesmas Somagede"
    >
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
              onError={() => setLogoReady(false)}
            />
          </div>
        </div>

        <h1>
          <span>PUSKESMAS</span>
          <strong>SOMAGEDE</strong>
        </h1>
        <p>Melayani dengan Hati, Sehat Bersama Kami</p>

        <div className="bootLoader">
          <div className="bootLoaderTop">
            <span>{done ? 'PORTAL SIAP' : 'MENYIAPKAN PORTAL'}</span>
            <b>{progress}%</b>
          </div>
          <div className="bootTrack">
            <i style={{ transform: `translate3d(${progress - 100}%,0,0)` }} />
          </div>
          {!done && (
            <div className="bootDots">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>

        <div className={`bootSupport${done ? ' isVisible' : ''}`} aria-hidden={!done}>
          <div className="bootSupportTitle">
            <span className="bootSupportRule" />
            <span>DIDUKUNG OLEH</span>
            <span className="bootSupportRule" />
          </div>
          <div className="bootSupportGrid">
            {support.map((item, index) =>
              logos[item.key] ? (
                <div
                  className="bootSupportItem isLoaded"
                  key={item.key}
                  style={{ '--support-delay': `${index * 180}ms` } as React.CSSProperties}
                >
                  <div className="bootSupportHalo" />
                  <img src={logos[item.key]} alt={item.label} />
                  <span>{item.label}</span>
                </div>
              ) : null,
            )}
          </div>
        </div>
      </div>
      <div className="bootFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
    </div>
  );
}
