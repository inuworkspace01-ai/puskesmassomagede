'use client';

import { useEffect, useState } from 'react';

const KEY = 'somagede-last-release-version';

type ReleaseInfo = { version?: string; playStoreUrl?: string };

export default function PWARegister() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const checkRelease = async () => {
      try {
        const response = await fetch(`/app-version.json?t=${Date.now()}`, {
          cache: 'no-store',
        });
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
      } catch {
        // Non-critical update check; ignore offline/network errors.
      }
    };

    checkRelease();
    const timer = window.setInterval(checkRelease, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!visible || !release?.version) return null;

  const dismiss = () => {
    localStorage.setItem(KEY, release.version!);
    setVisible(false);
  };

  return (
    <div role="status" aria-live="polite" style={{position:'fixed',left:16,right:16,bottom:16,zIndex:99998,maxWidth:560,margin:'0 auto',padding:'14px 16px',borderRadius:18,background:'rgba(6,46,43,.96)',color:'#fff',boxShadow:'0 16px 40px rgba(0,0,0,.24)',backdropFilter:'blur(16px)',display:'flex',gap:12,alignItems:'center'}}>
      <div style={{flex:1}}>
        <strong style={{display:'block',marginBottom:3}}>🔔 Versi baru tersedia</strong>
        <span style={{fontSize:13,opacity:.88}}>Puskesmas Somagede versi {release.version} sudah tersedia.</span>
      </div>
      <a href={release.playStoreUrl || 'https://play.google.com/store/apps/details?id=id.go.puskesmassomagede.portal'} target="_blank" rel="noopener noreferrer" onClick={dismiss} style={{background:'#22c55e',color:'#052e16',fontWeight:800,textDecoration:'none',padding:'9px 13px',borderRadius:12,whiteSpace:'nowrap',fontSize:13}}>Update</a>
      <button type="button" onClick={dismiss} aria-label="Tutup notifikasi update" style={{border:0,background:'transparent',color:'#fff',opacity:.7,fontSize:18,cursor:'pointer'}}>×</button>
    </div>
  );
}
