import PageTransition from '@/components/PageTransition';
import { HeartHandshake, Target, Users, ShieldCheck, Accessibility, Stethoscope, Leaf, ArrowRight, HeartPulse } from 'lucide-react';
import { Logo } from '@/components/Logo';

const missions = [
  ['Promotif & preventif', 'Menguatkan promosi kesehatan dan pencegahan penyakit sebagai bagian dari pelayanan kesehatan primer.', Leaf],
  ['Pemberdayaan masyarakat', 'Mendorong keluarga, kader, dan masyarakat berperan aktif dalam menjaga serta meningkatkan derajat kesehatan.', Users],
  ['Pelayanan bermutu', 'Mendukung pelayanan yang bermutu, aman, merata, terjangkau, dan berorientasi pada kebutuhan masyarakat.', Stethoscope],
  ['Pelayanan berkesinambungan', 'Menghubungkan upaya promotif, preventif, pemeriksaan, tindak lanjut, dan rujukan sesuai kebutuhan pelayanan.', Accessibility],
] as const;

export default function Profil(){
  return <PageTransition><main>
    <section className="pageHero profileHero">
      <div className="container profileHeroGrid">
        <div>
          <div className="eyebrow">PROFIL PUSKESMAS</div>
          <h1>Pelayanan kesehatan primer yang dekat dengan masyarakat.</h1>
          <p>Puskesmas merupakan fasilitas pelayanan kesehatan tingkat pertama yang menyelenggarakan dan mengoordinasikan pelayanan kesehatan di wilayah kerjanya, dengan pendekatan promotif, preventif, kuratif, rehabilitatif, dan/atau paliatif sesuai ketentuan pelayanan kesehatan primer.</p>
          <div className="heroMetaRow"><span><ShieldCheck size={15}/> Pelayanan kesehatan primer</span><span><Users size={15}/> 9 desa wilayah kerja</span></div>
        </div>
        <div className="profileLogoStage"><div className="profileLogoGlow"/><div className="profileLogoCard"><Logo/></div><span>PUSKESMAS<br/>SOMAGEDE</span></div>
      </div>
    </section>

    <section className="section"><div className="container"><div className="visionCard">
      <div className="visionVisual"><div className="healthScene" aria-label="Ilustrasi tenaga kesehatan"><div className="healthGrid"/><div className="healthTeam">
        <div className="healthPerson doctor"><div className="personHair"/><div className="personHead"/><div className="personBody"/><div className="personCollar"/><div className="personBadge"/><div className="personArm left"/><div className="personArm right"/><div className="personLeg left"/><div className="personLeg right"/><div className="stethoscope"/></div>
        <div className="healthPerson nurse"><div className="personHair"/><div className="personHead"/><div className="personBody"/><div className="personCollar"/><div className="personBadge"/><div className="personArm left"/><div className="personArm right"/><div className="personLeg left"/><div className="personLeg right"/></div>
      </div><HeartPulse className="sceneHeart" size={25}/><div className="sceneLabel">Tenaga kesehatan · melayani bersama</div></div></div>
      <div className="visionCopy"><div className="eyebrow">VISI</div><h2>Terwujudnya masyarakat Kecamatan Somagede yang sehat, mandiri, dan mampu mengakses pelayanan kesehatan yang bermutu.</h2><p>Visi ini menjadi ringkasan arah pelayanan untuk mendukung kesehatan individu, keluarga, dan masyarakat di wilayah kerja Puskesmas Somagede.</p></div>
    </div></div></section>

    <section className="section profileMissionSection"><div className="container"><div className="sectionHead profileSectionHead"><div><div className="eyebrow">ARAH PELAYANAN</div><h2>Empat prinsip penyelenggaraan</h2><p>Ringkasan ini mengikuti kerangka penguatan pelayanan kesehatan primer yang menekankan promotif, preventif, pemberdayaan masyarakat, mutu, serta kesinambungan pelayanan.</p></div></div><div className="missionGrid">{missions.map(([title,desc,Icon],i)=><article className="missionCard" key={title}><div className="missionIndex">0{i+1}</div><div className="icon"><Icon size={21}/></div><h3>{title}</h3><p>{desc}</p><div className="missionLine"/></article>)}</div></div></section>

    <section className="section"><div className="container"><div className="profileInfoGrid"><div className="profileStory"><div className="eyebrow">TENTANG PUSKESMAS</div><h2>Pusat pelayanan primer di wilayah Kecamatan Somagede.</h2><p>Pelayanan kesehatan primer mengutamakan akses masyarakat, promosi kesehatan, pencegahan penyakit, skrining, penanganan sesuai kewenangan, serta tindak lanjut dan rujukan bila diperlukan.</p><p>Portal digital ini digunakan sebagai media informasi publik mengenai layanan, agenda, jadwal petugas, wilayah kerja, edukasi kesehatan, kontak, serta penyampaian saran dan keluhan.</p><a className="textLink" href="/layanan">Lihat layanan <ArrowRight size={16}/></a></div>
      <div className="profileValues"><div className="valueRow"><strong>01</strong><div><b>Akses</b><span>Informasi pelayanan disusun agar mudah ditemukan oleh masyarakat.</span></div></div><div className="valueRow"><strong>02</strong><div><b>Promotif & preventif</b><span>Pencegahan dan deteksi dini menjadi bagian penting pelayanan primer.</span></div></div><div className="valueRow"><strong>03</strong><div><b>Mutu & keselamatan</b><span>Informasi dan pelayanan diarahkan untuk mendukung layanan yang aman dan bermutu.</span></div></div><div className="valueRow"><strong>04</strong><div><b>Pemberdayaan</b><span>Masyarakat dan jejaring wilayah dilibatkan dalam upaya meningkatkan kesehatan.</span></div></div></div>
    </div></div></section>
  </main></PageTransition>
}
