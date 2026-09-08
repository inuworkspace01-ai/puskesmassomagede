import Link from 'next/link';
import { ArrowLeft, Download, QrCode, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Logo } from '@/components/Logo';
import InstallPWA from '@/components/InstallPWA';

const downloadPageUrl = 'https://puskesmas-somagede-inuu.vercel.app/download';
const apkUrl = 'https://github.com/inuworkspace01-ai/puskesmassomagede/releases/latest/download/puskesmas-somagede.apk';
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(downloadPageUrl)}`;

export default function DownloadPage(){
  return <PageTransition><main className="section"><div className="container" style={{maxWidth:980}}>
    <Link href="/" className="textLink"><ArrowLeft size={16}/> Kembali ke beranda</Link>

    <div className="featureBand" style={{marginTop:24,alignItems:'center'}}>
      <div>
        <div className="eyebrow"><Smartphone size={15}/> APLIKASI ANDROID RESMI</div>
        <h1>Portal Puskesmas Somagede di HP kamu.</h1>
        <p>Gunakan portal Puskesmas Somagede seperti aplikasi Android untuk mengakses informasi, layanan, jadwal, wilayah kerja, dan Asisten Puskesmas.</p>
        <div className="actions">
          <InstallPWA />
          <a className="btn secondary" href={apkUrl}><Download size={18}/> Download APK</a>
        </div>
        <div className="statGrid" style={{marginTop:20}}>
          <div className="stat"><strong><Zap size={18}/></strong><span>Ringan & cepat</span></div>
          <div className="stat"><strong><ShieldCheck size={18}/></strong><span>Akses HTTPS</span></div>
          <div className="stat"><strong><Smartphone size={18}/></strong><span>Android</span></div>
        </div>
      </div>
      <div className="heroArt" style={{minHeight:280}}><div className="heroOrb orb1"/><div className="heroOrb orb2"/><div className="centerSeal"><div className="portalLogo"><div className="portalHalo"><Logo/></div><span>APLIKASI</span><small>PUSKESMAS SOMAGEDE</small></div></div></div>
    </div>

    <section className="section" style={{paddingBottom:0}}>
      <div className="sectionHead"><div><div className="eyebrow"><QrCode size={15}/> AKSES CEPAT</div><h2>Scan QR untuk membuka halaman aplikasi</h2><p>Scan menggunakan kamera HP. Dari halaman ini kamu bisa memasang PWA atau mengunduh APK.</p></div></div>
      <div className="featureBand" style={{marginTop:18,alignItems:'center'}}>
        <div style={{textAlign:'center'}}>
          <div style={{display:'inline-flex',padding:12,borderRadius:20,background:'#fff',boxShadow:'0 14px 35px rgba(0,0,0,.10)'}}>
            <img src={qrUrl} alt="QR Code halaman download aplikasi Puskesmas Somagede" width={240} height={240} loading="lazy" style={{display:'block',width:240,height:240}} />
          </div>
          <p style={{marginTop:10,fontSize:13,opacity:.72}}>puskesmas-somagede-inuu.vercel.app/download</p>
        </div>
        <div>
          <div className="eyebrow">REKOMENDASI</div>
          <h3>Pasang PWA tanpa APK</h3>
          <p>Di Chrome Android, gunakan tombol <strong>Install di HP</strong> jika tersedia. PWA dipasang langsung dari website dan tidak membutuhkan Play Store.</p>
          <p style={{fontSize:13,opacity:.75}}>Jika tombol install belum muncul, buka halaman ini melalui Chrome Android dan tunggu beberapa detik setelah halaman selesai dimuat.</p>
        </div>
      </div>
    </section>

    <div className="sectionHead" style={{marginTop:34}}><div><div className="eyebrow">CARA INSTALL APK</div><h2>Instalasi manual</h2></div></div>
    <div className="cards">
      <div className="card"><div className="icon"><span>1</span></div><h3>Download APK</h3><p>Tekan tombol Download APK dari halaman resmi ini.</p></div>
      <div className="card"><div className="icon"><span>2</span></div><h3>Izinkan instalasi</h3><p>Jika Android meminta izin, aktifkan izin instalasi dari sumber ini.</p></div>
      <div className="card"><div className="icon"><span>3</span></div><h3>Buka aplikasi</h3><p>Setelah selesai, buka Portal Puskesmas Somagede dari layar HP.</p></div>
    </div>
    <p style={{marginTop:20,fontSize:13,opacity:.72}}>Catatan keamanan: unduh APK hanya dari halaman resmi Puskesmas Somagede. Untuk pembaruan konten website, PWA dapat menerima perubahan tanpa memasang APK baru.</p>
  </div></main></PageTransition>
}
