const puskesmasLogo='/assets/logo-puskesmas-somagede.jpeg';
export function Logo(){return <img className="crest puskesmasCrest" src={puskesmasLogo} alt="Logo Puskesmas Somagede"/>}
export function LogoLockup({dark=false}:{dark?:boolean}){return <div className="brand"><Logo/><div><strong style={dark?{color:'#fff'}:undefined}>Puskesmas Somagede</strong><small style={dark?{color:'#b9d2ca'}:undefined}>Kabupaten Banyumas · Jawa Tengah</small></div></div>}
