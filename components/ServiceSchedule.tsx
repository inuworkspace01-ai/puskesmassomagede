'use client';
import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, Clock3, HeartPulse, Stethoscope, Users } from 'lucide-react';

const hours: Record<number, [string, string, string]> = {
  0: ['Minggu', 'Tutup', 'Tutup'],
  1: ['Senin', '07.30', '12.00'],
  2: ['Selasa', '07.30', '12.00'],
  3: ['Rabu', '07.30', '12.00'],
  4: ['Kamis', '07.30', '12.00'],
  5: ['Jumat', '07.30', '12.00'],
  6: ['Sabtu', '07.30', '12.00'],
};

type Row = { id: string; title: string; category: string; day: string; time: string; staff: string; notes: string };
type StaffRow = { id: string; name: string; task: string; source: Row };

function parts(date: Date) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date);
  const g = (t: string) => f.find(x => x.type === t)?.value || '';
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { day: map[g('weekday')], hour: Number(g('hour')), minute: Number(g('minute')) };
}

function clockMinutes(value: string) {
  const m = value.trim().replace('.', ':').match(/(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : NaN;
}

function splitStaff(row: Row): StaffRow[] {
  const noteParts = row.notes.split('|').map(v => v.trim()).filter(Boolean);
  if (noteParts.length) {
    return noteParts.map((part, index) => {
      const [name, task] = part.split(/\s+—\s+/);
      return { id: `${row.id}-${index}`, name: name?.trim() || part, task: task?.trim() || 'Petugas', source: row };
    });
  }
  return row.staff.split(';').map(v => v.trim()).filter(Boolean).map((name, index) => ({
    id: `${row.id}-${index}`,
    name,
    task: 'Petugas',
    source: row,
  }));
}

const icon = (c: string) => c.includes('Bidan') ? <Users /> : c.includes('VK') ? <HeartPulse /> : c.includes('Rujukan') ? <Stethoscope /> : <CalendarClock />;

export default function ServiceSchedule() {
  const [now, setNow] = useState<Date | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const tick = setInterval(update, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/schedule', { cache: 'no-store' });
        const d = await r.json();
        if (alive && r.ok) setRows(d.items || []);
      } catch {}
    };
    load();
    const refresh = setInterval(load, 30000);
    return () => { alive = false; clearInterval(refresh); };
  }, []);

  const x = parts(now || new Date());
  const s = hours[x.day] || hours[0];
  const cur = x.hour * 60 + x.minute;
  const open = s[1] !== 'Tutup' && cur >= clockMinutes(s[1]) && cur < clockMinutes(s[2]);
  const date = now ? new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(now) : 'Memuat waktu…';
  const time = now ? new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now) : '--:--:--';
  const todayLabel = now ? new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now).toLowerCase() : '';
  const todayRows = useMemo(() => rows.filter(r => r.category === 'Perawat' && r.day.toLowerCase() === todayLabel), [rows, todayLabel]);
  const staffRows = useMemo(() => todayRows.flatMap(splitStaff), [todayRows]);

  return <div className="scheduleWidget">
    <div className="scheduleNow">
      <div><div className="eyebrow"><CalendarClock size={15} /> Jadwal real-time WIB</div><h3>{date}</h3><p>Waktu sekarang <b>{time} WIB</b></p></div>
      <div className={`openBadge ${open ? 'isOpen' : ''}`}>{open ? <CheckCircle2 size={16} /> : <Clock3 size={16} />} {open ? 'Sedang buka' : 'Di luar jam pendaftaran'}</div>
    </div>
    <div className="scheduleToday"><b>{s[0]}</b><span>Pendaftaran {s[1]} – {s[2]} WIB</span></div>
    <div className="scheduleOperational">
      <div className="sectionHead mini"><div><div className="eyebrow">PETUGAS HARI INI</div><h3>Jadwal perawat realtime</h3></div></div>
      {staffRows.length ? <div className="operationalGrid">
        {staffRows.map(staff => <div className="operationalCard" key={staff.id}>
          <div className="icon">{icon(staff.source.category)}</div>
          <div>
            <div className="newsMeta"><span>{staff.source.category}</span></div>
            <h4>{staff.name}</h4>
            <p><b>{staff.source.time}</b></p>
            <p>Tugas: <b>{staff.task}</b></p>
          </div>
        </div>)}
      </div> : <div className="emptyState">Belum ada jadwal perawat untuk hari ini.</div>}
    </div>
    <div className="scheduleList">{[1, 2, 3, 4, 5, 6].map(d => <div key={d}><span>{hours[d][0]}</span><b>{hours[d][1]} – {hours[d][2]} WIB</b></div>)}</div>
  </div>;
}
