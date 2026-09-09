import Link from 'next/link';
import { ArrowLeft, Download, QrCode, ShieldCheck, Smartphone, Zap, Globe2 } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Logo } from '@/components/Logo';
import InstallPWA from '@/components/InstallPWA';

const apkUrl = 'https://github.com/inuworkspace01-ai/puskesmassomagede/releases/latest/download/puskesmas-somagede.apk';
const qrSrc = '/assets/qr-download-puskesmas-somagede.svg';

export default function DownloadPage(){
  return <PageTransition><main className="downloadPage section"><div className="container downloadContainer">
    <Link href="/" className="textLink"><ArrowLeft size={16}/> Kembali ke beranda</Link>

    <section className="downloadHero featureBand">
      <div className="downloadHeroCopy">
        <div className="eyebrow"><Smartphone size={15}/> APLIKASI MOBILE & WEBSITE</div>
        <h1>Portal Puskesmas Somagede di HP kamu.</h1>
        <p>Gunakan portal seperti aplikasi Android untuk mengakses informasi, layanan, jadwal, wilayah kerja, dan Asisten Puskesmas dalam satu tempat.</p>
        <div className="actions">
          <InstallPWA />
          <a className="btn secondary" href={apkUrl}><Download size={18}/> Download APK</a>
        </div>
        <div className="statGrid downloadStats">
          <div className="stat"><strong><Zap size={18}/></strong><span>Ringan & cepat</span></div>
          <div className="stat"><strong><ShieldCheck size={18}/></strong><span>HTTPS</span></div>
          <div className="stat"><strong><Globe2 size={18}/></strong><span>Responsif</span></div>
        </div>
      </div>
      <div className="downloadHeroArt" aria-hidden="true"><div className="downloadOrb downloadOrbA"/><div className="downloadOrb downloadOrbB"/><div className="downloadPhone"><div className="downloadPhoneTop"/><div className="downloadPhoneScreen"><Logo/><b>APLIKASI</b><span>PUSKESMAS SOMAGEDE</span></div></div></div>
    </section>

    <section className="downloadQrSection section">
      <div className="sectionHead"><div><div className="eyebrow"><QrCode size={15}/> AKSES CEPAT</div><h2>Scan QR untuk membuka aplikasi</h2><p>QR dibuat secara lokal sehingga tidak bergantung pada layanan QR eksternal yang bisa gagal dimuat.</p></div></div>
      <div className="downloadQrCard featureBand">
        <div className="downloadQrWrap"><img src={qrSrc} alt="QR Code halaman aplikasi Puskesmas Somagede" width={260} height={260}/><span>puskesmas-somagede-inuu.vercel.app/download</span></div>
        <div className="downloadQrCopy"><div className="eyebrow">REKOMENDASI</div><h3>Pasang PWA langsung dari HP</h3><p>Di Chrome Android, gunakan tombol <strong>Install di HP</strong> ketika tersedia. PWA terasa seperti aplikasi dan dapat mengikuti pembaruan website.</p><p className="hint">Untuk pengguna APK, gunakan tombol Download APK dari sumber resmi Puskesmas Somagede.</p></div>
      </div>
    </section>

    <section className="downloadSteps"><div className="sectionHead"><div><div className="eyebrow">CARA INSTALL</div><h2>Pilih cara yang paling nyaman</h2></div></div><div className="cards"><div className="card"><div className="icon"><span>1</span></div><h3>PWA</h3><p>Buka portal di Chrome Android lalu pilih Install di HP.</p></div><div className="card"><div className="icon"><span>2</span></div><h3>APK</h3><p>Unduh APK resmi dan ikuti proses instalasi Android.</p></div><div className="card"><div className="icon"><span>3</span></div><h3>Gunakan</h3><p>Akses informasi, layanan, berita, jadwal, dan Asisten dari satu aplikasi.</p></div></div></section>
  </div></main></PageTransition>
}
