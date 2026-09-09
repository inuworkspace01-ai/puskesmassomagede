import PageTransition from '@/components/PageTransition';
import { HeartHandshake, Target, Users, ShieldCheck, Accessibility, Stethoscope, Leaf, ArrowRight, HeartPulse } from 'lucide-react';
import { Logo } from '@/components/Logo';

const missions = [
  ['Promotif & preventif', 'Menggerakkan pembangunan berwawasan kesehatan dan memperkuat pencegahan penyakit bersama masyarakat.', Leaf],
  ['Kemandirian sehat', 'Mendorong keluarga dan masyarakat agar mampu menjaga, meningkatkan, dan mengambil peran dalam kesehatan.', Users],
  ['Pelayanan bermutu', 'Meningkatkan mutu, pemerataan, keterjangkauan, keselamatan, serta kenyamanan pelayanan kesehatan.', Stethoscope],
  ['Kesehatan menyeluruh', 'Memelihara dan meningkatkan kesehatan individu, keluarga, masyarakat, serta lingkungan.', Accessibility],
] as const;

export default function Profil(){
  return <PageTransition><main>
    <section className="pageHero profileHero">
      <div className="container profileHeroGrid">
        <div>
          <div className="eyebrow">PROFIL PUSKESMAS</div>
          <h1>Melayani dengan hati, tumbuh bersama masyarakat.</h1>
          <p>Puskesmas Somagede merupakan fasilitas pelayanan kesehatan tingkat pertama yang mendukung pembangunan kesehatan masyarakat di wilayah Kecamatan Somagede, Kabupaten Banyumas.</p>
          <div className="heroMetaRow"><span><ShieldCheck size={15}/> Pelayanan kesehatan primer</span><span><Users size={15}/> 9 desa wilayah kerja</span></div>
        </div>
        <div className="profileLogoStage"><div className="profileLogoGlow"/><div className="profileLogoCard"><Logo/></div><span>PUSKESMAS<br/>SOMAGEDE</span></div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="visionCard">
          <div className="visionVisual">
            <div className="healthScene" aria-label="Ilustrasi tenaga kesehatan">
              <div className="healthGrid" />
              <div className="healthTeam">
                <div className="healthPerson doctor">
                  <div className="personHair"/><div className="personHead"/><div className="personBody"/><div className="personCollar"/><div className="personBadge"/>
                  <div className="personArm left"/><div className="personArm right"/><div className="personLeg left"/><div className="personLeg right"/><div className="stethoscope"/>
                </div>
                <div className="healthPerson nurse">
                  <div className="personHair"/><div className="personHead"/><div className="personBody"/><div className="personCollar"/><div className="personBadge"/>
                  <div className="personArm left"/><div className="personArm right"/><div className="personLeg left"/><div className="personLeg right"/>
                </div>
              </div>
              <HeartPulse className="sceneHeart" size={25}/>
              <div className="sceneLabel">Tenaga kesehatan • melayani bersama</div>
            </div>
          </div>
          <div className="visionCopy">
            <div className="eyebrow">VISI</div>
            <h2>Terwujudnya masyarakat Kecamatan Somagede yang sehat, mandiri, dan mampu mengakses pelayanan kesehatan yang bermutu.</h2>
            <p>Rumusan profil publik ini disusun sebagai ringkasan arah pelayanan Puskesmas berdasarkan kerangka tugas dan perencanaan kesehatan daerah.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="section profileMissionSection">
      <div className="container">
        <div className="sectionHead profileSectionHead">
          <div><div className="eyebrow">MISI</div><h2>Empat fokus pelayanan</h2><p>Menerjemahkan orientasi Puskesmas menjadi pengalaman layanan yang mudah dipahami masyarakat.</p></div>
        </div>
        <div className="missionGrid">{missions.map(([title,desc,Icon],i)=><article className="missionCard" key={title}><div className="missionIndex">0{i+1}</div><div className="icon"><Icon size={21}/></div><h3>{title}</h3><p>{desc}</p><div className="missionLine"/></article>)}</div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="profileInfoGrid">
          <div className="profileStory">
            <div className="eyebrow">TENTANG KAMI</div>
            <h2>Pusat layanan primer yang dekat dengan warga.</h2>
            <p>Puskesmas berperan menyelenggarakan upaya kesehatan masyarakat dan kesehatan perorangan tingkat pertama, dengan perhatian kuat pada promosi kesehatan dan pencegahan penyakit.</p>
            <p>Portal digital ini menjadi pintu informasi untuk layanan, agenda, edukasi, jadwal, wilayah kerja, kontak, serta kanal saran dan keluhan.</p>
            <a className="textLink" href="/layanan">Lihat layanan <ArrowRight size={16}/></a>
          </div>
          <div className="profileValues">
            <div className="valueRow"><strong>01</strong><div><b>Ramah</b><span>Bahasa layanan jelas dan dekat dengan masyarakat.</span></div></div>
            <div className="valueRow"><strong>02</strong><div><b>Terbuka</b><span>Informasi publik ditata agar mudah ditemukan dan diperbarui.</span></div></div>
            <div className="valueRow"><strong>03</strong><div><b>Responsif</b><span>Mengutamakan akses cepat untuk informasi dan kebutuhan layanan.</span></div></div>
            <div className="valueRow"><strong>04</strong><div><b>Berbasis masyarakat</b><span>Pelayanan kesehatan berjalan bersama warga dan jejaring wilayah.</span></div></div>
          </div>
        </div>
      </div>
    </section>
  </main></PageTransition>
}
