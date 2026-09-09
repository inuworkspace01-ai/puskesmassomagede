import PageTransition from '@/components/PageTransition';
import { MapPin, ExternalLink, Navigation, Layers3, Map, LocateFixed, Compass } from 'lucide-react';

const villages=[['Kanding','-7.51656,109.35211'],['Kemawi','-7.5351,109.3652'],['Klinting','-7.5397,109.3387'],['Piasa Kulon','-7.5130,109.3612'],['Plana','-7.4948,109.3618'],['Sokawera','-7.5306,109.3188'],['Somagede','-7.5250,109.3330'],['Somakaton','-7.4918,109.3394'],['Tanggeran','-7.5456,109.3126']] as const;

export default function Wilayah(){
  return <PageTransition><main>
    <section className="pageHero regionHero"><div className="container"><div className="eyebrow"><MapPin size={15}/> WILAYAH KERJA</div><h1>9 desa, satu wilayah pelayanan.</h1><p>Jelajahi wilayah kerja Puskesmas Somagede dan buka lokasi desa langsung dari perangkatmu.</p></div></section>
    <section className="section"><div className="container">
      <div className="mapShell3d">
        <div className="mapCopy3d"><div className="eyebrow">PETA AREA</div><div className="mapTitleRow"><div><h2>Wilayah kerja Somagede</h2><p>Peta interaktif memakai OpenStreetMap agar tampil konsisten di browser dan APK. Panel dibuat dengan perspektif 3D ringan, sedangkan navigasi dan eksplorasi 3D penuh tersedia lewat Google Maps.</p></div><div className="mapBadge"><LocateFixed size={15}/> 9 desa</div></div><div className="mapActions"><a className="btn primary" href="https://www.google.com/maps/search/?api=1&query=Kecamatan+Somagede+Banyumas" target="_blank" rel="noreferrer"><Navigation size={17}/> Buka Google Maps</a><a className="btn secondary" href="https://www.google.com/maps/search/?api=1&query=Puskesmas+Somagede+Banyumas" target="_blank" rel="noreferrer"><Map size={17}/> Puskesmas</a></div><div className="mapLegend"><span><i className="legendDot"/> Area layanan</span><span><Layers3 size={14}/> Perspektif 3D</span><span><Compass size={14}/> Navigasi</span></div></div>
        <div className="mapStage"><div className="mapPlatform"><iframe title="Peta Kecamatan Somagede" src="https://www.openstreetmap.org/export/embed.html?bbox=109.3000%2C-7.5600%2C109.3900%2C-7.4750&layer=mapnik&marker=-7.5250%2C109.3330" loading="eager" referrerPolicy="no-referrer-when-downgrade" /></div><div className="mapFloorGlow"/></div>
      </div>
      <div className="villageHeader"><div><div className="eyebrow">DESA WILAYAH KERJA</div><h2>Pilih desa tujuan</h2></div><span>9 lokasi</span></div>
      <div className="villageGrid3d">{villages.map(([name,coord],i)=><a className="villageCard" key={name} href={`https://www.google.com/maps/search/?api=1&query=${coord}`} target="_blank" rel="noreferrer"><div className="villageNumber">{String(i+1).padStart(2,'0')}</div><div className="villageText"><b>Desa {name}</b><span>Wilayah kerja Puskesmas</span></div><ExternalLink size={17}/></a>)}</div>
    </div></section>
  </main></PageTransition>
}
