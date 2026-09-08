'use client';
import { useEffect, useRef, useState } from 'react';
import { CalendarClock, Trash2, Save, Upload, FileSpreadsheet } from 'lucide-react';

type Row={id:string;title:string;category:string;day:string;time:string;staff:string;notes:string;published:boolean};
const cats=['Rujukan / Poli','VK / MTBS','Bidan Jaga','Skrining BPJS','Lainnya'];

export default function ScheduleManager(){
  const [items,setItems]=useState<Row[]>([]);
  const [title,setTitle]=useState(''); const [category,setCategory]=useState(cats[0]);
  const [day,setDay]=useState(''); const [time,setTime]=useState('');
  const [staff,setStaff]=useState(''); const [notes,setNotes]=useState('');
  const [saved,setSaved]=useState(false); const [importing,setImporting]=useState(false);
  const [importMessage,setImportMessage]=useState('');
  const fileRef=useRef<HTMLInputElement>(null);

  async function load(){try{const r=await fetch('/api/schedule?admin=1',{cache:'no-store'});const d=await r.json();if(r.ok)setItems(d.items||[])}finally{}}
  useEffect(()=>{load()},[]);

  async function add(){
    if(!title||!day||!time){alert('Judul, hari/shift dan jam wajib diisi.');return}
    const r=await fetch('/api/schedule',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,category,day,time,staff,notes,published:true})});
    const d=await r.json(); if(!r.ok){alert(d.error||'Gagal menyimpan.');return}
    setTitle('');setDay('');setTime('');setStaff('');setNotes('');setSaved(true);load();setTimeout(()=>setSaved(false),1800)
  }

  async function remove(id:string){if(!confirm('Hapus jadwal ini?'))return;const r=await fetch('/api/schedule',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});if(r.ok)load()}

  async function importExcel(file:File){
    setImporting(true);setImportMessage('');
    try{
      const form=new FormData();form.append('file',file);
      const r=await fetch('/api/schedule/import',{method:'POST',body:form});
      const d=await r.json();
      if(!r.ok){setImportMessage(d.error||'Import gagal.');return}
      setImportMessage(`Berhasil mengimpor ${d.imported} jadwal${d.skipped?` • ${d.skipped} baris dilewati`:''}.`);
      await load();
    }catch{setImportMessage('Gagal menghubungi server saat import Excel.')}finally{setImporting(false);if(fileRef.current)fileRef.current.value=''}
  }

  return <div className="contentManager">
    <div className="editorCard">
      <div className="editorTitle"><div><div className="eyebrow">SCHEDULE MANAGEMENT</div><h2>Import jadwal dari Excel</h2><p>Upload .xlsx, .xls, atau .csv. Sistem membaca baris pertama sebagai header dan langsung menyimpan jadwal ke database.</p></div><FileSpreadsheet size={30}/></div>
      <div className="editorActions" style={{flexWrap:'wrap'}}>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={e=>{const f=e.target.files?.[0];if(f)importExcel(f)}} />
        <button className="btn primary" onClick={()=>fileRef.current?.click()} disabled={importing}><Upload size={16}/>{importing?'Memproses Excel...':'Upload Excel jadwal'}</button>
        <span className="hint">Kolom minimal: <b>Judul/Nama Jadwal</b>, <b>Hari/Shift</b>, <b>Jam</b>. Kolom opsional: Kategori, Petugas, Keterangan.</span>
      </div>
      {importMessage&&<div className="saved" style={{marginTop:10}}>{importMessage}</div>}
    </div>

    <div className="editorCard">
      <div className="editorTitle"><div><div className="eyebrow">MANUAL ENTRY</div><h2>Tambah jadwal operasional</h2><p>Atur rujukan, poli, VK/MTBS, bidan jaga, dan skrining BPJS secara manual.</p></div><CalendarClock size={30}/></div>
      <div className="formGrid">
        <label><span>Nama jadwal *</span><input className="field" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Bidan jaga malam"/></label>
        <label><span>Kategori</span><select className="field" value={category} onChange={e=>setCategory(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></label>
        <label><span>Hari / shift *</span><input className="field" value={day} onChange={e=>setDay(e.target.value)} placeholder="Senin / Pagi / Senin–Sabtu"/></label>
        <label><span>Jam *</span><input className="field" value={time} onChange={e=>setTime(e.target.value)} placeholder="07.30–12.00 WIB"/></label>
        <label><span>Petugas</span><input className="field" value={staff} onChange={e=>setStaff(e.target.value)} placeholder="Nama petugas / tim"/></label>
        <label className="full"><span>Catatan</span><textarea className="field textArea" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Keterangan tambahan..."/></label>
      </div>
      <div className="editorActions"><button className="btn primary" onClick={add}><Save size={16}/> Simpan jadwal</button>{saved&&<span className="saved">Tersimpan</span>}</div>
    </div>

    <div className="contentList"><div className="listHead"><div><b>Jadwal tersimpan</b><span>{items.length} jadwal</span></div></div>{items.map(x=><div className="contentRow" key={x.id}><div className="contentThumb"><CalendarClock/></div><div className="contentRowBody"><div className="newsMeta"><span>{x.category}</span><span>{x.day} · {x.time}</span></div><h3>{x.title}</h3><p>{x.staff?`Petugas: ${x.staff}. `:''}{x.notes}</p></div><button className="iconBtn danger" onClick={()=>remove(x.id)}><Trash2 size={17}/></button></div>)}</div>
  </div>
}
