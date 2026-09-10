import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import ServiceSchedule from '@/components/ServiceSchedule';
import { ArrowRight, HeartPulse, Stethoscope, CalendarDays, Users, Syringe } from 'lucide-react';

const data:Record<string,{title:string;desc:string;Icon:any;points:string[]}>={
  'pendaftaran-dan-pemeriksaan':{title:'Pendaftaran & Pemeriksaan',desc:'Informasi mengenai alur kunjungan, persiapan, dan hal yang perlu diperhatikan sebelum menerima pelayanan di Puskesmas.',Icon:Stethoscope,points:['Bawa identitas dan dokumen kepesertaan yang diperlukan sesuai jenis pelayanan.','Ikuti tahapan pendaftaran dan pemeriksaan sesuai petunjuk petugas.','Untuk kebutuhan informasi tertentu, gunakan kanal kontak resmi Puskesmas.']},
  'cek-kesehatan-gratis':{title:'Cek Kesehatan Gratis',desc:'Program pemeriksaan kesehatan untuk deteksi dini risiko penyakit dan tindak lanjut hasil pemeriksaan melalui pelayanan kesehatan primer.',Icon:HeartPulse,points:['CKG mencakup sasaran sepanjang siklus hidup, dari bayi baru lahir hingga lanjut usia sesuai ketentuan program.','Pendaftaran dapat dilakukan melalui kanal yang ditetapkan pemerintah, termasuk SATUSEHAT Mobile, WhatsApp resmi Kemenkes, atau datang langsung ke Puskesmas.','Hasil pemeriksaan perlu diperhatikan dan ditindaklanjuti sesuai arahan tenaga kesehatan apabila ditemukan masalah kesehatan.']},
  'kesehatan-ibu-dan-anak':{title:'Kesehatan Ibu & Anak',desc:'Informasi kesehatan ibu dan anak, termasuk pemeriksaan, imunisasi, pemantauan tumbuh kembang, dan edukasi keluarga.',Icon:Users,points:['Perhatikan jadwal pelayanan ibu, bayi, dan anak yang diumumkan Puskesmas.','Bawa buku KIA atau catatan kesehatan dan imunisasi bila tersedia.','Konsultasikan hasil pemeriksaan, pertumbuhan, atau keluhan kesehatan kepada tenaga kesehatan.']},
  'pencegahan-tbc':{title:'Pencegahan TBC',desc:'Informasi mengenai pencegahan, skrining, penelusuran kontak, dan tindak lanjut dalam program pengendalian tuberkulosis.',Icon:HeartPulse,points:['Perhatikan gejala yang mengarah pada TBC dan segera konsultasikan kepada tenaga kesehatan.','Ikuti skrining serta pemeriksaan yang dianjurkan sesuai program Puskesmas.','Pengobatan TBC harus mengikuti petunjuk tenaga kesehatan dan tidak dihentikan sendiri.']},
  'imunisasi':{title:'Imunisasi',desc:'Informasi kegiatan imunisasi dan edukasi pencegahan penyakit melalui pelayanan kesehatan primer.',Icon:Syringe,points:['Periksa jadwal dan jenis imunisasi pada informasi resmi Puskesmas.','Bawa buku KIA atau catatan imunisasi anak bila tersedia.','Konfirmasi jadwal dan kebutuhan vaksin kepada petugas apabila terdapat perubahan kegiatan.']},
  'agenda-lapangan':{title:'Agenda Lapangan',desc:'Informasi kegiatan Puskesmas di masyarakat, termasuk penyuluhan, skrining, CKG, imunisasi, dan kegiatan desa.',Icon:CalendarDays,points:['Periksa berita atau pengumuman resmi untuk melihat waktu dan lokasi kegiatan.','Perhatikan persyaratan, sasaran, serta dokumen yang perlu dibawa.','Jadwal dapat berubah berdasarkan pelaksanaan dan pengumuman resmi Puskesmas.']}
};

export default async function Detail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const item=data[slug]; if(!item)notFound(); const Icon=item.Icon;
  return <PageTransition><main>
    <section className="pageHero"><div className="container"><Link href="/layanan" className="sideBack light">← Semua layanan</Link><div className="eyebrow"><Icon size={15}/> INFORMASI LAYANAN</div><h1>{item.title}</h1><p>{item.desc}</p></div></section>
    <section className="section"><div className="container detailGrid"><div className="detailCard"><div className="eyebrow">INFORMASI UTAMA</div><h2>Yang perlu diketahui</h2><div className="detailPoints">{item.points.map(x=><div key={x}><span>✓</span><p>{x}</p></div>)}</div><Link className="btn primary" href="/informasi">Lihat informasi terbaru <ArrowRight size={16}/></Link></div><ServiceSchedule/></div></section>
  </main></PageTransition>;
}
