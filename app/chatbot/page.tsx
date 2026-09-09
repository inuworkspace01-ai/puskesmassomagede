'use client';
import PageTransition from '@/components/PageTransition';
import { Bot, Send, Sparkles, Clock3, MapPin, Stethoscope, MessageCircle, ExternalLink, RotateCcw, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

type Msg={role:'user'|'assistant';content:string;whatsappUrl?:string};
const quick=[
  {text:'Jam pelayanan hari ini?',icon:Clock3},
  {text:'Apa saja layanan Puskesmas?',icon:Stethoscope},
  {text:'Jadwal rujukan, VK & MTBS?',icon:MapPin},
  {text:'Kontak Puskesmas Somagede',icon:MessageCircle},
];
const welcome='Halo! Saya Asisten Puskesmas Somagede. Saya siap membantu mencari informasi layanan, jadwal, rujukan, VK/MTBS, bidan jaga, skrining BPJS, kontak, dan kegiatan Puskesmas.';

export default function Chatbot(){
  const[input,setInput]=useState('');
  const[loading,setLoading]=useState(false);
  const[msgs,setMsgs]=useState<Msg[]>([{role:'assistant',content:welcome}]);
  async function send(text=input){
    const q=text.trim();if(!q||loading)return;
    const next=[...msgs,{role:'user',content:q} as Msg];setMsgs(next);setInput('');setLoading(true);
    try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next})});const d=await r.json();setMsgs(m=>[...m,{role:'assistant',content:d.reply||'Maaf, belum ada jawaban.',whatsappUrl:d.whatsappUrl}]);}
    catch{setMsgs(m=>[...m,{role:'assistant',content:'Maaf, koneksi ke Asisten sedang bermasalah. Silakan coba lagi.'}]);}
    finally{setLoading(false)}
  }
  const reset=()=>{if(loading)return;setMsgs([{role:'assistant',content:welcome}]);setInput('')};
  return <PageTransition><main className="assistantPage">
    <section className="pageHero chatbotHero"><div className="container assistantHeroInner"><div className="eyebrow"><Sparkles size={15}/> ASISTEN DIGITAL PUSKESMAS</div><h1>Butuh informasi?<br/><span>Tanya Somagede.</span></h1><p>Asisten digital untuk membantu menemukan informasi Puskesmas dengan cepat. Untuk data pasien atau hasil pemeriksaan, silakan hubungi petugas.</p></div></section>
    <section className="section assistantSection"><div className="container">
      <div className="assistantShell">
        <div className="chatHeader"><div className="assistantAvatar"><Bot size={23}/><span/></div><div className="assistantIdentity"><b>Asisten Somagede</b><span><i/> Online · siap membantu</span></div><button className="chatReset" onClick={reset} aria-label="Mulai percakapan baru" title="Percakapan baru"><RotateCcw size={17}/></button></div>
        <div className="quickPrompts">{quick.map(({text,icon:Icon})=><button key={text} onClick={()=>send(text)} disabled={loading}><Icon size={15}/><span>{text}</span></button>)}</div>
        <div className="chatMessages" aria-live="polite">
          {msgs.map((m,i)=><div key={i} className={`chatRow ${m.role==='user'?'user':'bot'}`}><div className="chatMiniAvatar">{m.role==='assistant'?<Bot size={14}/>:<span>Anda</span>}</div><div className="chatMsg"><div className="chatBubble">{m.content}</div>{m.whatsappUrl&&<a className="chatWhatsapp" href={m.whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={15}/> Hubungi WhatsApp Puskesmas <ExternalLink size={12}/></a>}</div></div>)}
          {loading&&<div className="chatRow bot"><div className="chatMiniAvatar"><Bot size={14}/></div><div className="chatBubble typing"><i/><i/><i/><span>Mengetik…</span></div></div>}
        </div>
        <div className="chatComposerWrap"><div className="chatComposer"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Tulis pertanyaan kamu…" aria-label="Pertanyaan untuk Asisten"/><button onClick={()=>send()} aria-label="Kirim pertanyaan" disabled={loading||!input.trim()}><Send size={18}/></button></div><div className="composerHint"><ShieldCheck size={13}/> Jangan kirim NIK, nomor rekam medis, atau data pribadi.</div></div>
      </div>
      <div className="assistantFootnote"><span><Bot size={15}/> Jawaban AI dapat perlu dikonfirmasi kepada petugas.</span><span>Informasi publik Puskesmas Somagede</span></div>
    </div></section>
  </main></PageTransition>
}
