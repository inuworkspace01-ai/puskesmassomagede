'use client';
import PageTransition from '@/components/PageTransition';
import { MapPin, ExternalLink, Navigation, Layers3, LocateFixed, Compass, Stethoscope, ArrowUpRight, Building2 } from 'lucide-react';
import { useState } from 'react';

const villages=[
  ['Kanding','-7.51656,109.35211'],['Kemawi','-7.5351,109.3652'],['Klinting','-7.5397,109.3387'],
  ['Piasa Kulon','-7.5130,109.3612'],['Plana','-7.4948,109.3618'],['Sokawera','-7.5306,109.3188'],
  ['Somagede','-7.5250,109.3330'],['Somakaton','-7.4918,109.3394'],['Tanggeran','-7.5456,109.3126']
] as const;
const points=[{x:16,y:52},{x:31,y:29},{x:46,y:46},{x:58,y:30},{x:73,y:48},{x:22,y:76},{x:50,y:62},{x:83,y:25},{x:69,y:76}];
const balaiQueries=['Balai Desa Kanding, Somagede, Banyumas','Kantor Desa Kemawi, Somagede, Banyumas','Balai Desa Klinting, Somagede, Banyumas','Balai Desa Piasa Kulon, Somagede, Banyumas','Kantor Desa Plana, Somagede, Banyumas','Kantor Desa Sokawera, Somagede, Banyumas','Kantor Desa Somagede, Somagede, Banyumas','Kantor Desa Somakaton, Somagede, Banyumas','Balai Desa Tanggeran, Somagede, Banyumas'];
const mapsUrl=(q:string)=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export default function Wilayah(){
  const [selected,setSelected]=useState<number|null>(null);
  const target=selected===null?null:points[selected];
  const routePath=target?`M 50 54 C 50 49 ${(50+target.x)/2} ${(54+target.y)/2-7} ${target.x} ${target.y}`:'';
  return <PageTransition><main>
    <section className="pageHero regionHero"><div className="container"><div className="eyebrow"><MapPin size={15}/> WILAYAH KERJA</div><h1>9 desa, satu wilayah pelayanan.</h1><p>Jelajahi wilayah kerja Puskesmas Somagede dengan peta visual 3D ringan. Klik titik Balai Desa untuk melihat animasi perjalanan dari Puskesmas.</p></div></section>
    <section className="section"><div className="container"><div className="mapShell3d">
      <div className="mapCopy3d"><div className="eyebrow">PETA INTERAKTIF</div><div className="mapTitleRow"><div><h2>Dari Puskesmas menuju Balai Desa.</h2><p>Peta utama berjalan sepenuhnya lokal, tanpa iframe yang bisa diblokir. Klik titik desa untuk menjalankan animasi rute; tombol Navigasi membuka pencarian lokasi Balai Desa di Google Maps.</p></div><div className="mapBadge"><LocateFixed size={15}/> 9 desa</div></div>
        <div className="mapActions"><a className="btn primary" href={mapsUrl('Puskesmas Somagede, Banyumas')} target="_blank" rel="noreferrer"><Navigation size={17}/> Buka lokasi Puskesmas</a><a className="btn secondary" href={mapsUrl('Kantor Desa Somagede, Somagede, Banyumas')} target="_blank" rel="noreferrer"><Building2 size={16}/> Balai Desa</a></div>
        <div className="mapLegend"><span><i className="legendDot"/> 9 titik Balai Desa</span><span><Layers3 size={14}/> Visual 3D</span><span><Compass size={14}/> Navigasi nyata</span></div>
        {selected!==null&&target&&<div className="mapRouteInfo"><div><strong>Rute aktif: Puskesmas → Balai Desa {villages[selected][0]}</strong><span>Animasi rute bergerak dari titik Puskesmas ke tujuan. Jalur visual bersifat skematik.</span></div><a className="btn primary" href={mapsUrl(balaiQueries[selected])} target="_blank" rel="noreferrer">Navigasi <ArrowUpRight size={14}/></a></div>}
      </div>
      <div className="mapStage"><div className="mapPlatform"><div className="mapCanvas3d"><div className="mapHud"><span className="mapHudChip"><Layers3 size={12}/> HEALTH MAP</span><span className="mapCompass"><Compass size={15}/></span></div>
        <div className="mapTerrain"><div className="road r1"/><div className="road r2"/><div className="road r3"/><div className="road r4"/>
          {selected!==null&&target&&<svg key={`route-${selected}`} className="mapRouteLayer" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true"><path className="mapRouteGlow" d={routePath} pathLength="100"/><path className="mapRouteLine" d={routePath} pathLength="100"/><circle className="mapRouteRunner" r="1.8"><animateMotion dur="1.35s" fill="freeze" repeatCount="1" path={routePath}/></circle></svg>}
          {villages.map(([name],i)=>{const p=points[i];return <button key={name} type="button" className={`mapPin mapPinButton p${i+1} ${selected===i?'isSelected':''}`} style={{left:`${p.x}%`,top:`${p.y}%`}} onClick={()=>setSelected(i)} aria-label={`Tampilkan rute ke Balai Desa ${name}`}><span className="mapPinDot"/><span className="mapPinLabel"><Building2 size={10}/> {name}</span></button>})}
          <div className="mapCore"><Stethoscope size={26}/><span>PUSKESMAS</span></div>
          {selected!==null&&target&&<div key={`pulse-${selected}`} className="mapRoutePulse" style={{left:`${target.x}%`,top:`${target.y}%`}}/>}
        </div><div className="mapFallbackNote">Klik titik Balai Desa untuk memulai rute</div>
      </div></div><div className="mapFloorGlow"/></div>
    </div></div>
      <div className="villageHeader"><div><div className="eyebrow">DESA WILAYAH KERJA</div><h2>Pilih desa tujuan</h2></div><span>9 lokasi</span></div>
      <div className="villageGrid3d">{villages.map(([name],i)=><button type="button" className="villageCard mapCardAction" key={name} onClick={()=>setSelected(i)}><div className="villageNumber">{String(i+1).padStart(2,'0')}</div><div className="villageText"><b>Desa {name}</b><span>Balai desa · tampilkan rute animasi</span></div><ExternalLink size={17}/></button>)}</div>
    </div></section>
  </main></PageTransition>
}
