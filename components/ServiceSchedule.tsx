'use client';
import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, Clock3, HeartPulse, Stethoscope, Users } from 'lucide-react';

type Row = { id: string; title: string; category: string; day: string; time: string; staff: string; notes: string };
type StaffRow = { id: string; name: string; task: string; source: Row };

const hours: Record<number, [string, string, string]> = {
  0: ['Minggu', 'Tutup', 'Tutup'], 1: ['Senin', '07.30', '12.00'], 2: ['Selasa', '07.30', '12.00'],
  3: ['Rabu', '07.30', '12.00'], 4: ['Kamis', '07.30', '12.00'], 5: ['Jumat', '07.30', '12.00'], 6: ['Sabtu', '07.30', '12.00'],
};

const TASK_LABELS: Record<string, string> = {
  SDA: 'TTV (tanda-tanda vital)', TTV: 'TTV (tanda-tanda vital)', RJ: 'BP (tekanan darah)', RT: 'IGD',
  ILP: 'Posyandu', PRA: 'Skrining', PRO: 'Program Prolanis', POLI: 'Poli', BP: 'BP (tekanan darah)',
};
function cleanTask(value: string) { const code = value.trim().toUpperCase(); return TASK_LABELS[code] || value.trim() || 'Petugas layanan'; }
function clockMinutes(value: string) { const m = value.trim().replace('.', ':').match(/(\d{1,2}):(\d{2})/); return m ? Number(m[1]) * 60 + Number(m[2]) : NaN; }
function jakartaDateKey(date: Date) { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date); }
function rowDateKey(row: Row) {
  const match = row.id.match(/(\d{4}-\d{2}-\d{2})$/);
  if (match) return match[1];
  const matchDay = row.day.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/i);
  if (!matchDay) return '';
  const months: Record<string, string> = { januari:'01', februari:'02', maret:'03', april:'04', mei:'05', juni:'06', juli:'07', agustus:'08', september:'09', oktober:'10', november:'11', desember:'12' };
  const month = months[matchDay[2].toLowerCase()];
  return month ? `${matchDay[3]}-${month}-${matchDay[1].padStart(2, '0')}` : '';
}
function splitStaff(row: Row): StaffRow[] {
  const noteParts = row.notes.split('|').map(v => v.trim()).filter(Boolean);
  if (noteParts.length) return noteParts.map((part, index) => {
    const [name, task] = part.split(/\s+—\s+/);
    return { id: `${row.id}-${index}`, name: name?.trim() || part, task: cleanTask(task || ''), source: row };
  });
  return row.staff.split(';').map(v => v.trim()).filter(Boolean).map((name, index) => ({ id: `${row.id}-${index}`, name, task: 'Petugas layanan', source: row }));
}
const icon = (c: string) => c.includes('Bidan') ? <Users /> : c.includes('VK') ? <HeartPulse /> : c.includes('Rujukan') ? <Stethoscope /> : <CalendarClock />;

export default function ServiceSchedule() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const update = () => setNow(new Date()); update(); const tick = setInterval(update, 30000); return () => clearInterval(tick); }, []);
  useEffect(() => {
    let alive = true;
    let refresh: number | undefined;
    const load = async () => {
      try { const r = await fetch('/api/schedule', { cache: 'no-store' }); if (!r.ok) throw new Error(`schedule ${r.status}`); const d = await r.json(); if (alive && Array.isArray(d.items)) setRows(d.items); }
      catch {} finally { if (alive) setLoading(false); }
    };
    load(); refresh = window.setInterval(load, 5 * 60 * 1000);
    return () => { alive = false; if (refresh !== undefined) window.clearInterval(refresh); };
  }, []);

  const x = useMemo(() => {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(now);
    const g = (t: string) => f.find(v => v.type === t)?.value || '';
    const map: Record<string, number> = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
    return { day: map[g('weekday')] ?? 0, hour: Number(g('hour')), minute: Number(g('minute')) };
  }, [now]);
  const s = hours[x.day] || hours[0];
  const cur = x.hour * 60 + x.minute;
  const open = s[1] !== 'Tutup' && cur >= clockMinutes(s[1]) && cur < clockMinutes(s[2]);
  const date = useMemo(() => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(now), [now]);
  const time = useMemo(() => new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now), [now]);
  const todayKey = useMemo(() => jakartaDateKey(now), [now]);
  const todayRows = useMemo(() => rows.filter(r => r.category?.trim().toLowerCase() === 'perawat' && rowDateKey(r) === todayKey), [rows, todayKey]);
  const staffRows = useMemo(() => todayRows.flatMap(splitStaff), [todayRows]);

  return <div className="scheduleWidget">
    <div className="scheduleNow"><div><div className="eyebrow"><CalendarClock size={15} /> Jadwal pelayanan hari ini</div><h3>{date}</h3><p>Waktu sekarang <b>{time} WIB</b></p></div><div className={`openBadge ${open ? 'isOpen' : ''}`}>{open ? <CheckCircle2 size={16} /> : <Clock3 size={16} />} {open ? 'Sedang buka' : 'Di luar jam pendaftaran'}</div></div>
    <div className="scheduleToday"><b>{s[0]}</b><span>Jam pendaftaran {s[1]} – {s[2]} WIB</span></div>
    <div className="scheduleOperational"><div className="sectionHead mini"><div><div className="eyebrow">PETUGAS HARI INI</div><h3>Jadwal perawat dan tugas layanan</h3></div><span className="scheduleCount">{staffRows.length} petugas</span></div>
      {staffRows.length ? <div className="operationalGrid">{staffRows.map(staff => <div className="operationalCard" key={staff.id}><div className="icon">{icon(staff.source.category)}</div><div className="operationalInfo"><div className="newsMeta"><span>{staff.source.category}</span><span className="scheduleDot">•</span><span>{staff.source.time}</span></div><h4>{staff.name}</h4><span className="taskBadge"><span>Penugasan</span>{staff.task}</span></div></div>)}</div> : <div className="emptyState">{loading ? 'Memuat jadwal petugas…' : 'Belum ada jadwal perawat untuk hari ini.'}</div>}
    </div>
    <div className="scheduleList">{[1,2,3,4,5,6].map(d => <div key={d}><span>{hours[d][0]}</span><b>{hours[d][1]} – {hours[d][2]} WIB</b></div>)}</div>
  </div>;
}
