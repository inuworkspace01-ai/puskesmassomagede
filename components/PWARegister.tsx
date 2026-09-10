'use client';
import { useEffect, useState } from 'react';
const KEY='somagede-last-release-version';
type ReleaseInfo={version?:string;playStoreUrl?:string};
export default function PWARegister(){
 const [release,setRelease]=useState<ReleaseInfo|null>(null),[visible,setVisible]=useState(false);
 useEffect(()=>{let cancelled=false;const boot=async()=>{
  try{if('serviceWorker'in navigator){const registration=await navigator.serviceWorker.register('/sw.js?v=1.0.11',{updateViaCache:'none'});await registration.update()}}catch{}
  try{const r=await fetch(`/app-version.json?t=${Date.now()}`,{cache:'no-store'});if(!r.ok)return;const data=await r.json() as ReleaseInfo;if(cancelled||!data.version)return;const last=localStorage.getItem(KEY);if(last!==data.version){setRelease(data);setVisible(true)}
   if('caches'in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('somagede-pwa-')&&k!=='somagede-pwa-v12').map(k=>caches.delete(k)))}
  }catch{}}
 boot();const timer=window.setInterval(boot,5*60*1000);return()=>{cancelled=true;window.clearInterval(timer)}},[]);
 if(!visible||!release?.version)return null;
 const dismiss=()=>{localStorage.setItem(KEY,release.version!);setVisible(false)};
 return <div role="status" aria-live="polite" className="releaseNotice"><div><strong>Versi baru tersedia</strong><span>Puskesmas Somagede {release.version} sudah siap digunakan.</span></div><a href={release.playStoreUrl||'https://play.google.com/store/apps/details?id=id.go.puskesmassomagede.portal'} target="_blank" rel="noopener noreferrer" onClick={dismiss}>Update</a><button type="button" onClick={dismiss} aria-label="Tutup">×</button></div>
}
