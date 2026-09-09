'use client';

import PageTransition from '@/components/PageTransition';
import { ArrowUpRight, Building2, Compass, ExternalLink, Layers3, LocateFixed, MapPin, Navigation, Stethoscope } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Village = { name: string; coord: [number, number]; query: string; visual: { x: number; y: number } };
type GeoPoint = [number, number];

const origin: GeoPoint = [109.33203964, -7.52164729];
const villages: Village[] = [
  { name: 'Kanding', coord: [109.35211, -7.51656], query: 'Balai Desa Kanding, Somagede, Banyumas', visual: { x: 16, y: 52 } },
  { name: 'Kemawi', coord: [109.3546621, -7.534797756], query: 'Balai Desa Kemawi, Somagede, Banyumas', visual: { x: 31, y: 29 } },
  { name: 'Klinting', coord: [109.343889, -7.530278], query: 'Balai Desa Klinting, Somagede, Banyumas', visual: { x: 46, y: 46 } },
  { name: 'Piasa Kulon', coord: [109.3613313, -7.507858828], query: 'Balai Desa Piasa Kulon, Somagede, Banyumas', visual: { x: 58, y: 30 } },
  { name: 'Plana', coord: [109.3618, -7.4948], query: 'Balai Desa Plana, Somagede, Banyumas', visual: { x: 73, y: 48 } },
  { name: 'Sokawera', coord: [109.3188, -7.5306], query: 'Balai Desa Sokawera, Somagede, Banyumas', visual: { x: 22, y: 76 } },
  { name: 'Somagede', coord: [109.333, -7.525], query: 'Balai Desa Somagede, Somagede, Banyumas', visual: { x: 50, y: 62 } },
  { name: 'Somakaton', coord: [109.3394, -7.4918], query: 'Balai Desa Somakaton, Somagede, Banyumas', visual: { x: 83, y: 25 } },
  { name: 'Tanggeran', coord: [109.3126, -7.5456], query: 'Balai Desa Tanggeran, Somagede, Banyumas', visual: { x: 69, y: 76 } },
];

const mapsSearch = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const mapsDirections = (q: string) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent('Puskesmas Somagede, Jl. Raya Somagede No. 37, Banyumas')}&destination=${encodeURIComponent(q)}&travelmode=driving`;

function projectRoute(route: GeoPoint[], target: { x: number; y: number }) {
  if (route.length < 2) return '';
  const start = route[0];
  const end = route[route.length - 1];
  const vx = end[0] - start[0];
  const vy = end[1] - start[1];
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;
  const px = -uy;
  const py = ux;
  const mx = target.x - 50;
  const my = target.y - 54;
  const targetLen = Math.hypot(mx, my) || 1;
  const tx = mx / targetLen;
  const ty = my / targetLen;
  const nx = -ty;
  const ny = tx;
  const lateralScale = Math.max(targetLen * 0.7, 8);

  return route.map((point, index) => {
    const dx = point[0] - start[0];
    const dy = point[1] - start[1];
    const along = Math.max(0, Math.min(1, (dx * ux + dy * uy) / len));
    const side = (dx * px + dy * py) / len;
    const x = 50 + along * mx + side * lateralScale * nx;
    const y = 54 + along * my + side * lateralScale * ny;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

export default function Wilayah() {
  const [selected, setSelected] = useState<number | null>(null);
  const [route, setRoute] = useState<GeoPoint[]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [routeState, setRouteState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const active = selected === null ? null : villages[selected];

  useEffect(() => {
    if (selected === null) {
      setRoute([]);
      setRouteDistance(null);
      setRouteDuration(null);
      setRouteState('idle');
      return;
    }
    const controller = new AbortController();
    const destination = villages[selected].coord;
    setRouteState('loading');
    setRoute([]);
    setRouteDistance(null);
    setRouteDuration(null);

    const url = `https://router.project-osrm.org/route/v1/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?overview=full&geometries=geojson&steps=false`;
    fetch(url, { signal: controller.signal, cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Routing ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const first = data?.routes?.[0];
        const coordinates = first?.geometry?.coordinates as GeoPoint[] | undefined;
        if (!coordinates?.length) throw new Error('No route');
        setRoute(coordinates);
        setRouteDistance(Number(first.distance) || null);
        setRouteDuration(Number(first.duration) || null);
        setRouteState('ready');
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setRouteState('error');
      });

    return () => controller.abort();
  }, [selected]);

  const routePath = useMemo(() => active && route.length > 1 ? projectRoute(route, active.visual) : '', [active, route]);
  const formatDistance = (meters: number | null) => meters === null ? '—' : meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
  const formatDuration = (seconds: number | null) => seconds === null ? '—' : `${Math.max(1, Math.round(seconds / 60))} menit`;

  return (
    <PageTransition>
      <main>
        <section className="pageHero regionHero">
          <div className="container">
            <div className="eyebrow"><MapPin size={15} /> WILAYAH KERJA</div>
            <h1>9 desa, satu wilayah pelayanan.</h1>
            <p>Visual 3D tetap ringan, tetapi garis perjalanan sekarang dihitung berdasarkan jaringan jalan sehingga tidak lagi berupa garis lurus menembus area.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="mapShell3d">
              <div className="mapCopy3d">
                <div className="eyebrow">REAL ROAD ROUTING</div>
                <div className="mapTitleRow">
                  <div>
                    <h2>Puskesmas → Balai Desa.</h2>
                    <p>Klik desa untuk mengambil rute jalan dari Puskesmas dan menampilkannya di panel 3D. Navigasi akhirnya tetap dibuka di Google Maps.</p>
                  </div>
                  <div className="mapBadge"><LocateFixed size={15} /> 9 desa</div>
                </div>

                <div className="mapActions">
                  <a className="btn primary" href={mapsSearch('Puskesmas Somagede, Banyumas')} target="_blank" rel="noreferrer"><Navigation size={17} /> Lokasi Puskesmas</a>
                  <a className="btn secondary" href={mapsSearch('Balai Desa Somagede, Somagede, Banyumas')} target="_blank" rel="noreferrer"><Building2 size={16} /> Cari Balai Desa</a>
                </div>

                <div className="mapLegend">
                  <span><i className="legendDot" /> Jalur jalan</span>
                  <span><Layers3 size={14} /> Visual 3D</span>
                  <span><Compass size={14} /> Google Maps</span>
                </div>

                {active && (
                  <div className="mapRouteInfo" key={`route-info-${active.name}`}>
                    <div>
                      <strong>{routeState === 'loading' ? 'Mengambil rute jalan…' : `Puskesmas → Balai Desa ${active.name}`}</strong>
                      <span>{routeState === 'ready' ? `${formatDistance(routeDistance)} · estimasi ${formatDuration(routeDuration)}` : routeState === 'error' ? 'Rute tidak tersedia. Buka Google Maps untuk navigasi langsung.' : 'Menghubungkan ke jaringan jalan…'}</span>
                    </div>
                    <a className="btn primary" href={mapsDirections(active.query)} target="_blank" rel="noreferrer">Navigasi <ArrowUpRight size={14} /></a>
                  </div>
                )}
              </div>

              <div className="mapStage">
                <div className="mapPlatform">
                  <div className="mapCanvas3d">
                    <div className="mapHud">
                      <span className="mapHudChip"><Layers3 size={12} /> HEALTH MAP</span>
                      <span className="mapCompass"><Compass size={15} /></span>
                    </div>

                    <div className="mapTerrain">
                      <div className="road r1" /><div className="road r2" /><div className="road r3" /><div className="road r4" />

                      {routePath && (
                        <svg key={`route-svg-${selected}`} className="mapRouteLayer" viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
                          <path className="mapRouteGlow" d={routePath} />
                          <path className="mapRouteLine" d={routePath} />
                          <circle className="mapRouteRunner" r="1.8">
                            <animateMotion key={`runner-${selected}`} dur="1.65s" fill="freeze" repeatCount="1" path={routePath} />
                          </circle>
                        </svg>
                      )}

                      {villages.map((v, index) => (
                        <button key={v.name} type="button" className={`mapPin mapPinButton p${index + 1} ${selected === index ? 'isSelected' : ''}`} style={{ left: `${v.visual.x}%`, top: `${v.visual.y}%` }} onClick={() => setSelected(index)} aria-label={`Tampilkan rute ke Balai Desa ${v.name}`}>
                          <span className="mapPinDot" />
                          <span className="mapPinLabel"><Building2 size={10} /> {v.name}</span>
                        </button>
                      ))}

                      <div className="mapCore"><Stethoscope size={26} /><span>PUSKESMAS</span></div>
                      {active && <div key={`pulse-${active.name}`} className="mapRoutePulse" style={{ left: `${active.visual.x}%`, top: `${active.visual.y}%` }} />}
                    </div>
                    <div className="mapFallbackNote">{routeState === 'loading' ? 'Menghitung rute jalan…' : 'Klik titik Balai Desa untuk melihat rute nyata'}</div>
                  </div>
                </div>
                <div className="mapFloorGlow" />
              </div>
            </div>

            <div className="villageHeader">
              <div><div className="eyebrow">DESA WILAYAH KERJA</div><h2>Pilih desa tujuan</h2></div>
              <span>9 lokasi</span>
            </div>

            <div className="villageGrid3d">
              {villages.map((v, index) => (
                <button type="button" className="villageCard mapCardAction" key={v.name} onClick={() => setSelected(index)}>
                  <div className="villageNumber">{String(index + 1).padStart(2, '0')}</div>
                  <div className="villageText"><b>Desa {v.name}</b><span>Balai desa · tampilkan rute jalan</span></div>
                  <ExternalLink size={17} />
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PageTransition>
  );
}
