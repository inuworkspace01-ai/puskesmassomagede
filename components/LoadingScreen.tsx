'use client';
import { useEffect, useState } from 'react';

export default function LoadingScreen(){
  const [visible,setVisible]=useState(true);
  const [supportSrc,setSupportSrc]=useState('');
  const [progress,setProgress]=useState(0);

  useEffect(()=>{
    let alive=true;
    const started=performance.now();
    const duration=1900;
    const tick=()=>{
      if(!alive)return;
      const value=Math.min(100,Math.round(((performance.now()-started)/duration)*100));
      setProgress(value);
      if(value<100) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    fetch('/assets/support-by-4-logos.b64',{cache:'no-store'})
      .then(r=>r.text())
      .then(data=>{if(alive&&data.trim())setSupportSrc(`data:image/jpeg;base64,${data.trim()}`);})
      .catch(()=>{});

    const hideTimer=window.setTimeout(()=>setVisible(false),4300);
    return()=>{alive=false;window.clearTimeout(hideTimer)};
  },[]);

  if(!visible)return null;
  const done=progress>=100;
  return <div className={`bootSplash${done?' bootDone':''}`} role="status" aria-live="polite" aria-label="Memuat Portal Puskesmas Somagede">
    <div className="bootCenter">
      <div className="bootEyebrow">PORTAL DIGITAL • PUSKESMAS SOMAGEDE</div>
      <div className="bootLogoShell"><div className="bootLogoCard"><img src="/assets/logo-puskesmas-somagede.jpeg" alt="Logo Puskesmas Somagede" /></div></div>
      <h1><span>PUSKESMAS</span><strong>SOMAGEDE</strong></h1>
      <p>Melayani dengan Hati, Sehat Bersama Kami</p>
      <div className="bootLoader">
        <div className="bootLoaderTop"><span>{done?'PORTAL SIAP':'MENYIAPKAN PORTAL'}</span><b>{progress}%</b></div>
        <div className="bootTrack"><i style={{transform:`translateX(${progress-100}%)`}} /></div>
      </div>
      <div className={`bootSupport${done?' isVisible':''}`} aria-hidden={!done}>
        <span>DIDUKUNG OLEH</span>
        <div className="bootSupportStage">
          {supportSrc?<img src={supportSrc} alt="Logo Kabupaten Banyumas, GERMAS, Kementerian Kesehatan, dan Dinkominfo Banyumas" />:<div className="bootSupportFallback"><b>PEMKAB BANYUMAS</b><b>GERMAS</b><b>KEMENKES RI</b><b>DINKOMINFO BANYUMAS</b></div>}
        </div>
      </div>
    </div>
    <div className="bootFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
  </div>;
}
