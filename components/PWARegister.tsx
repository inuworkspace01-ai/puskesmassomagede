'use client';

import { useEffect, useState } from 'react';

const KEY = 'somagede-last-release-version';
type ReleaseInfo = { version?: string; playStoreUrl?: string };

export default function PWARegister() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const boot = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
          await registration.update();
        }
      } catch {}

      try {
        const response = await fetch(`/app-version.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) return;
        const data = (await response.json()) as ReleaseInfo;
        if (cancelled || !data.version) return;
        const lastSeen = localStorage.getItem(KEY);
        if (!lastSeen) {
          localStorage.setItem(KEY, data.version);
          return;
        }
        if (lastSeen !== data.version) {
          setRelease(data);
          setVisible(true);
        }
      } catch {}
    };

    boot();
    const timer = window.setInterval(boot, 5 * 60 * 1000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  if (!visible || !release?.version) return null;
  const dismiss = () => { localStorage.setItem(KEY, release.version!); setVisible(false); };
  return <div role="status" aria-live="polite" className="releaseNotice">
    <div><strong>Versi baru tersedia</strong><span>Puskesmas Somagede {release.version} sudah siap digunakan.</span></div>
    <a href={release.playStoreUrl || 'https://play.google.com/store/apps/details?id=id.go.puskesmassomagede.portal'} target="_blank" rel="noopener noreferrer" onClick={dismiss}>Update</a>
    <button type="button" onClick={dismiss} aria-label="Tutup">×</button>
  </div>;
}
