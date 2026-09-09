'use client';
import Link from 'next/link';
import { Search, ArrowRight, CalendarDays, X, Sparkles, BookOpen, Megaphone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
type News={id:string;title:string;description:string;category:string;image_url?:string;created_at?:string;published_at?:string};
const categories=['Semua','Berita','Edukasi','Kegiatan','Pengumuman'];
function dateLabel(n:News){const d=n.published_at||n.created_at;return d?new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'long',year:'numeric'}).format(new Date(d)):''}
function categoryIcon(category:string){const c=category.toLowerCase();return c.includes('edukasi')?<BookOpen size={14}/>:c.includes('kegiatan')?<Sparkles size={14}/>:<Megaphone size={14}/>}
export default function NewsClient(){
  const[q,setQ]=useState('');const[cat,setCat]=useState('Semua');const[items,setItems]=useState<News[]>([]);const[loading,setLoading]=useState(true);
  useEffect(()=>{fetch('/api/content',{cache:'no-store'}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||'Gagal memuat');setItems(Array.isArray(d.items)?d.items:[])}).catch(()=>setItems([])).finally(()=>setLoading(false))},[]);
  const ordered=useMemo(()=>[...items].sort((a,b)=>new Date(b.published_at||b.created_at||0).getTime()-new Date(a.published_at||a.created_at||0).getTime()),[items]);
  const filtered=useMemo(()=>ordered.filter(x=>(cat==='Semua'||x.category?.toLowerCase()===cat.toLowerCase())&&(`${x.title} ${x.description} ${x.category}`.toLowerCase().includes(q.toLowerCase()))),[ordered,cat,q]);
  const featured=filtered[0];
  if(loading)return <div className="newsLoading"><div className="skeletonHero"/><div className="newsSkeletonGrid"><i/><i/><i/></div></div>;
  return <div className="newsExperience">
    <div className="newsToolbar"><div className="newsSearchPro"><Search size={20}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari berita, edukasi, kegiatan..." aria-label="Cari informasi"/>{q&&<button type="button" onClick={()=>setQ('')} aria-label="Hapus pencarian"><X size={16}/></button>}</div><div className="newsResult">{filtered.length} konten</div></div>
    <div className="newsCategories">{categories.map(c=><button key={c} className={cat===c?'active':''} onClick={()=>setCat(c)}>{c}</button>)}</div>
    {featured?<><Link href={`/informasi/${encodeURIComponent(featured.id)}`} className="newsFeatured"><div className="featuredVisual">{featured.image_url?<img src={featured.image_url} alt=""/>:<div className="featuredFallback"><span>{categoryIcon(featured.category)}</span><b>Puskesmas<br/>Somagede</b></div>}<span className="featuredBadge">{featured.category}</span></div><div className="featuredBody"><div className="newsMeta"><span>{categoryIcon(featured.category)} {featured.category}</span><span><CalendarDays size={13}/>{dateLabel(featured)}</span></div><h2>{featured.title}</h2><p>{featured.description}</p><span className="readMore">Baca selengkapnya <ArrowRight size={16}/></span></div></Link>
    <div className="newsSectionLabel"><div><span>TERBARU</span><h3>Informasi lainnya</h3></div><span>{filtered.length} hasil</span></div>
    <div className="newsGrid">{filtered.map(n=><article className="newsCard" key={n.id}><Link href={`/informasi/${encodeURIComponent(n.id)}`} className="newsVisual">{n.image_url?<img src={n.image_url} alt=""/>:<div className="newsVisualText"><span>{n.category}</span><strong>Puskesmas<br/>Somagede</strong></div>}<span className="newsCardArrow"><ArrowRight size={15}/></span></Link><div className="newsBody"><div className="newsMeta"><span>{categoryIcon(n.category)} {n.category}</span><span><CalendarDays size={13}/>{dateLabel(n)}</span></div><h3>{n.title}</h3><p>{n.description}</p><Link href={`/informasi/${encodeURIComponent(n.id)}`} className="readMore">Baca selengkapnya <ArrowRight size={15}/></Link></div></article>)}</div></>:<div className="emptyState newsEmpty"><Search size={30}/><h3>Tidak ada konten yang cocok</h3><p>Coba kata kunci lain atau pilih kategori “Semua”.</p><button className="btn secondary" onClick={()=>{setQ('');setCat('Semua')}}>Reset pencarian</button></div>}
  </div>
}
