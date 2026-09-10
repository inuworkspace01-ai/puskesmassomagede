import Link from 'next/link';
import ServiceSchedule from '@/components/ServiceSchedule';
import PageTransition from '@/components/PageTransition';
import { Activity, CalendarDays, HeartPulse, MapPin, Stethoscope, Syringe, Users, ArrowRight } from 'lucide-react';

const data=[
  ['Pendaftaran & pemeriksaan','Informasi alur kunjungan, pemeriksaan awal, dan persiapan sebelum menerima pelayanan.',Stethoscope],
  ['Cek Kesehatan Gratis','Informasi program CKG, jadwal kegiatan, persiapan pemeriksaan, dan informasi pelaksanaan.',Activity],
  ['Kesehatan ibu & anak','Informasi kesehatan ibu dan anak, imunisasi, pemantauan tumbuh kembang, serta edukasi keluarga.',Users],
  ['Pencegahan TBC','Informasi edukasi, skrining, penelusuran kontak, serta tindak lanjut sesuai program pengendalian TBC.',HeartPulse],
  ['Imunisasi','Informasi kegiatan imunisasi dan edukasi pencegahan penyakit yang diselenggarakan di wilayah kerja.',Syringe],
  ['Agenda lapangan','Informasi jadwal penyuluhan, kegiatan desa, skrining, serta kegiatan kesehatan Puskesmas di masyarakat.',CalendarDays]
] as const;

export default function Layanan(){
  return <PageTransition><main>
    <section className="pageHero"><div className="container"><div className="eyebrow">LAYANAN PUSKESMAS</div><h1>Informasi pelayanan dalam satu portal.</h1><p>Halaman ini memuat ringkasan layanan dan informasi kesehatan yang tersedia. Buka setiap layanan untuk melihat penjelasan, jadwal, serta informasi yang berkaitan dengan pelaksanaannya.</p></div></section>
    <section className="section"><div className="container">
      <div className="cards serviceGrid">{data.map(([t,p,I])=>{const Icon=I;return <Link href={`/layanan/${String(t).toLowerCase().replaceAll(' ','-').replaceAll('&','dan')}`} className="card interactive" key={String(t)}><div className="icon"><Icon size={21}/></div><h3>{t}</h3><p>{p}</p><span className="cardArrow" aria-hidden="true"><ArrowRight size={16}/></span></Link>})}</div>
      <ServiceSchedule/>
      <div className="infoBanner"><MapPin size={22}/><div><b>Perlu memastikan jadwal atau lokasi pelayanan?</b><p>Gunakan halaman Kontak untuk memperoleh alamat, nomor telepon, WhatsApp, dan kanal informasi Puskesmas Somagede.</p></div><Link className="btn primary" href="/kontak">Lihat kontak</Link></div>
    </div></section>
  </main></PageTransition>
}
