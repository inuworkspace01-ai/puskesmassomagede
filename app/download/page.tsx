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
        <h1>Akses informasi Puskesmas Somagede dari perangkat Anda.</h1>
        <p>Portal digital ini menyediakan informasi layanan, jadwal pelayanan, wilayah kerja, edukasi kesehatan, serta Asisten Puskesmas dalam satu akses.</p>
        <div className="actions">
          <InstallPWA />
          <a className="btn secondary" href={apkUrl}><Download size={18}/> Download APK Resmi</a>
        </div>
        <div className="statGrid downloadStats">
          <div className="stat"><strong><Zap size={18}/></strong><span>Akses cepat</span></div>
          <div className="stat"><strong><ShieldCheck size={18}/></strong><span>Koneksi HTTPS</span></div>
          <div className="stat"><strong><Globe2 size={18}/></strong><span>Tampilan responsif</span></div>
        </div>
      </div>
      <div className="downloadHeroArt" aria-hidden="true"><div className="downloadOrb downloadOrbA"/><div className="downloadOrb downloadOrbB"/><div className="downloadPhone"><div className="downloadPhoneTop"/><div className="downloadPhoneScreen"><Logo/><b>APLIKASI</b><span>PUSKESMAS SOMAGEDE</span></div></div></div>
    </section>

    <section className="downloadQrSection section">
      <div className="sectionHead"><div><div className="eyebrow"><QrCode size={15}/> AKSES CEPAT</div><h2>Scan QR untuk membuka portal aplikasi</h2><p>Gunakan kamera ponsel untuk membuka halaman instalasi dan akses portal Puskesmas Somagede.</p></div></div>
      <div className="downloadQrCard featureBand">
        <div className="downloadQrWrap"><img src={qrSrc} alt="QR Code halaman aplikasi Puskesmas Somagede" width={260} height={260}/><span>puskesmas-somagede-inuu.vercel.app/download</span></div>
        <div className="downloadQrCopy"><div className="eyebrow">PWA</div><h3>Pasang portal dari Chrome Android</h3><p>Ketika opsi instalasi tersedia, pilih <strong>Install di HP</strong> pada Chrome Android. Portal akan tampil seperti aplikasi dan tetap terhubung ke pembaruan website.</p><p className="hint">Pengguna Android yang memerlukan paket aplikasi dapat menggunakan tombol <strong>Download APK Resmi</strong>.</p></div>
      </div>
    </section>

    <section className="downloadSteps"><div className="sectionHead"><div><div className="eyebrow">CARA AKSES</div><h2>Pilih metode penggunaan</h2><p>Akses portal sesuai perangkat dan kebutuhan Anda.</p></div></div><div className="cards"><div className="card"><div className="icon"><span>1</span></div><h3>PWA</h3><p>Buka portal melalui Chrome Android dan pilih opsi <strong>Install di HP</strong> ketika tersedia.</p></div><div className="card"><div className="icon"><span>2</span></div><h3>APK</h3><p>Unduh paket aplikasi resmi, kemudian ikuti petunjuk pemasangan pada perangkat Android.</p></div><div className="card"><div className="icon"><span>3</span></div><h3>Gunakan Portal</h3><p>Temukan informasi layanan, jadwal, wilayah kerja, edukasi, berita, dan Asisten Puskesmas.</p></div></div></section>
  </div></main></PageTransition>
}
