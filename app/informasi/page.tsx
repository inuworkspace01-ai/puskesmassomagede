import PageTransition from '@/components/PageTransition';
import NewsClient from '@/components/NewsClient';
export default function Informasi(){return <PageTransition><main><section className="pageHero"><div className="container"><div className="eyebrow">INFORMASI TERKINI</div><h1>Berita, edukasi & agenda</h1><p>Temukan pengumuman, kegiatan lapangan, edukasi kesehatan, dan konten publik Puskesmas Somagede.</p></div></section><section className="section"><div className="container"><NewsClient/></div></section></main></PageTransition>}
