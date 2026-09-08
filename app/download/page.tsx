import Link from 'next/link';
import { ArrowLeft, Download, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Logo } from '@/components/Logo';

const apkUrl = 'https://github.com/inuworkspace01-ai/puskesmassomagede/releases/latest/download/puskesmas-somagede.apk';

export default function DownloadPage(){
  return <PageTransition><main className="section"><div className="container" style={{maxWidth:920}}>
    <Link href="/" className="textLink"><ArrowLeft size={16}/> Kembali ke beranda</Link>
    <div className="featureBand" style={{marginTop:24,alignItems:'center'}}>
      <div>
        <div className="eyebrow"><Smartphone size={15}/> APLIKASI ANDROID RESMI</div>
        <h1>Portal Puskesmas Somagede di HP kamu.</h1>
        <p>Download aplikasi Android untuk akses layanan, informasi, jadwal, wilayah kerja, dan Asisten Puskesmas dengan tampilan seperti aplikasi.</p>
        <div className="actions">
          <a className="btn primary" href={apkUrl} download><Download size={18}/> Download APK</a>
          <Link className="btn secondary" href="/">Buka versi web</Link>
        </div>
        <div className="statGrid" style={{marginTop:20}}>
          <div className="stat"><strong><Zap size={18}/></strong><span>Ringan & cepat</span></div>
          <div className="stat"><strong><ShieldCheck size={18}/></strong><span>Akses HTTPS</span></div>
          <div className="stat"><strong><Smartphone size={18}/></strong><span>Android</span></div>
        </div>
      </div>
      <div className="heroArt" style={{minHeight:280}}><div className="heroOrb orb1"/><div className="heroOrb orb2"/><div className="centerSeal"><div className="portalLogo"><div className="portalHalo"><Logo/></div><span>APLIKASI</span><small>PUSKESMAS SOMAGEDE</small></div></div></div>
    </div>
    <div className="sectionHead" style={{marginTop:34}}><div><div className="eyebrow">CARA INSTALL</div><h2>Instalasi mudah</h2></div></div>
    <div className="cards">
      <div className="card"><div className="icon"><span>1</span></div><h3>Download APK</h3><p>Tekan tombol Download APK dari halaman ini.</p></div>
      <div className="card"><div className="icon"><span>2</span></div><h3>Izinkan instalasi</h3><p>Jika Android meminta izin, aktifkan izin instalasi dari sumber ini.</p></div>
      <div className="card"><div className="icon"><span>3</span></div><h3>Buka aplikasi</h3><p>Setelah selesai, buka Portal Puskesmas Somagede dari layar HP.</p></div>
    </div>
    <p style={{marginTop:20,fontSize:13,opacity:.72}}>Catatan: APK didistribusikan langsung untuk Android. Untuk keamanan, selalu download dari halaman resmi Puskesmas Somagede.</p>
  </div></main></PageTransition>
}
