'use client';
import {Moon,Sun} from 'lucide-react';
import {useTheme} from '@/components/ThemeProvider';
export default function ThemeToggle(){const{theme,toggleTheme}=useTheme();return <button className="themeToggle" onClick={toggleTheme} aria-label={theme==='dark'?'Aktifkan tema terang':'Aktifkan tema gelap'} title={theme==='dark'?'Tema terang':'Tema gelap'}>{theme==='dark'?<Sun size={17}/>:<Moon size={17}/>}<span>{theme==='dark'?'Light':'Dark'}</span></button>}
