import PageTransition from '@/components/PageTransition';
import { MapPin, ExternalLink, Navigation, Layers3, LocateFixed, Compass, Stethoscope } from 'lucide-react';

const villages=[
  ['Kanding','-7.51656,109.35211'],['Kemawi','-7.5351,109.3652'],['Klinting','-7.5397,109.3387'],
  ['Piasa Kulon','-7.5130,109.3612'],['Plana','-7.4948,109.3618'],['Sokawera','-7.5306,109.3188'],
  ['Somagede','-7.5250,109.3330'],['Somakaton','-7.4918,109.3394'],['Tanggeran','-7.5456,109.3126']
] as const;
const pins=[16,31,46,58,73,22,50,83,69];
function mapsUrl(q:string){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}
export default function Wilayah(){
  return <PageTransition><main>
    <section className="pageHero regionHero"><div className="container"><div className="eyebrow"><MapPin size={15}/> WILAYAH KERJA</div><h1>9 desa, satu wilayah pelayanan.</h1><p>Jelajahi wilayah kerja Puskesmas Somagede dalam visual peta 3D ringan. Setiap titik dan kartu desa dapat dibuka untuk navigasi nyata.</p></div></section>
    <section className="section"><div className="container">
      <div className="mapShell3d">
        <div className="mapCopy3d"><div className="eyebrow">PETA INTERAKTIF</div><div className="mapTitleRow"><div><h2>Wilayah Somagede dalam satu pandangan.</h2><p>Peta eksternal yang sebelumnya diblokir oleh browser/aplikasi kami hilangkan dari area utama. Sebagai gantinya, tampilan ini sepenuhnya lokal, cepat, responsif, dan setiap titik membuka Google Maps untuk lokasi sebenarnya.</p></div><div className="mapBadge"><LocateFixed size={15}/> 9 desa</div></div><div className="mapActions"><a className="btn primary" href={mapsUrl('Kecamatan Somagede, Banyumas')} target="_blank" rel="noreferrer"><Navigation size={17}/> Buka Google Maps</a><a className="btn secondary" href={mapsUrl('Puskesmas Somagede, Banyumas')} target="_blank" rel="noreferrer"><Stethoscope size={16}/> Lokasi Puskesmas</a></div><div className="mapLegend"><span><i className="legendDot"/> Titik desa</span><span><Layers3 size={14}/> Perspektif 3D</span><span><Compass size={14}/> Navigasi langsung</span></div></div>
        <div className="mapStage"><div className="mapPlatform"><div className="mapCanvas3d"><div className="mapHud"><span className="mapHudChip"><Layers3 size={12}/> MAP EXPERIENCE</span><span className="mapCompass"><Compass size={15}/></span></div><div className="mapTerrain"><div className="road r1"/><div className="road r2"/><div className="road r3"/><div className="road r4"/>{villages.map(([name,coord],i)=><a key={name} className={`mapPin p${i+1}`} href={mapsUrl(coord)} target="_blank" rel="noreferrer" aria-label={`Buka lokasi Desa ${name}`}><span className="mapPinDot"/><span className="mapPinLabel">{name}</span></a>)}<div className="mapCore"><LocateFixed size={26}/><span>PUSKESMAS</span></div></div><div className="mapFallbackNote">Klik titik atau pilih desa untuk navigasi nyata</div></div></div><div className="mapFloorGlow"/></div>
      </div>
      <div className="villageHeader"><div><div className="eyebrow">DESA WILAYAH KERJA</div><h2>Pilih desa tujuan</h2></div><span>9 lokasi</span></div>
      <div className="villageGrid3d">{villages.map(([name,coord],i)=><a className="villageCard" key={name} href={mapsUrl(coord)} target="_blank" rel="noreferrer"><div className="villageNumber">{String(i+1).padStart(2,'0')}</div><div className="villageText"><b>Desa {name}</b><span>Wilayah kerja Puskesmas · buka navigasi</span></div><ExternalLink size={17}/></a>)}</div>
    </div></section>
  </main></PageTransition>
}
