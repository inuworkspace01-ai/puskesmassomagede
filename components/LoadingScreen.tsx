/**
 * Server-rendered, CSS-only boot splash.
 * It intentionally has no client JavaScript so it is visible on the very first paint.
 */
export default function LoadingScreen() {
  return (
    <div className="bootSplash" role="status" aria-label="Memuat Portal Puskesmas Somagede">
      <div className="bootAurora bootAuroraA" />
      <div className="bootAurora bootAuroraB" />
      <div className="bootGrid" />
      <div className="bootOrbit bootOrbitA" />
      <div className="bootOrbit bootOrbitB" />
      <div className="bootPlus bootPlusA">+</div>
      <div className="bootPlus bootPlusB">+</div>

      <div className="bootCenter">
        <div className="bootEyebrow">PORTAL DIGITAL • PUSKESMAS SOMAGEDE</div>
        <div className="bootLogoShell">
          <div className="bootOrbitRing"><span /></div>
          <div className="bootLogoGlow" />
          <div className="bootLogoCard">
            <img src="/assets/logo-puskesmas-somagede.jpeg" alt="Logo Puskesmas Somagede" />
          </div>
        </div>
        <h1><span>PUSKESMAS</span><strong>SOMAGEDE</strong></h1>
        <p>Melayani dengan Hati, Sehat Bersama Kami</p>
        <div className="bootLoader">
          <div className="bootLoaderTop"><span>MENYIAPKAN PORTAL</span><b className="bootPercent">0%</b></div>
          <div className="bootTrack"><i /></div>
          <div className="bootDots"><i /><i /><i /></div>
        </div>
      </div>

      <div className="bootFooter">KABUPATEN BANYUMAS • JAWA TENGAH • 2026</div>
      <div className="bootWave bootWaveA" />
      <div className="bootWave bootWaveB" />
      <div className="bootWave bootWaveC" />
    </div>
  );
}
