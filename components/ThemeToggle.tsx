'use client';
import {Moon,Sun} from 'lucide-react';
import {useEffect,useState} from 'react';
import {useTheme} from '@/components/ThemeProvider';

export default function ThemeToggle(){
  const {theme,toggleTheme}=useTheme();
  const [mounted,setMounted]=useState(false);
  useEffect(()=>setMounted(true),[]);
  const active=mounted?theme:'light';
  return <button className="themeToggle" onClick={toggleTheme} aria-label={active==='dark'?'Aktifkan tema terang':'Aktifkan tema gelap'} title={active==='dark'?'Tema terang':'Tema gelap'}>{active==='dark'?<Sun size={17}/>:<Moon size={17}/>}<span>{active==='dark'?'Light':'Dark'}</span></button>;
}
