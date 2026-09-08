'use client';

import {createContext,useContext,useEffect,useState} from 'react';

type Theme='light'|'dark';
const ThemeContext=createContext<{theme:Theme;toggleTheme:()=>void}>({theme:'light',toggleTheme:()=>{}});

export default function ThemeProvider({children}:{children:React.ReactNode}){
  const [theme,setTheme]=useState<Theme>('light');
  useEffect(()=>{
    const saved=localStorage.getItem('somagede-theme') as Theme|null;
    const preferred=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
    const next=saved==='dark'||saved==='light'?saved:preferred;
    setTheme(next);
    document.documentElement.dataset.theme=next;
  },[]);
  const toggleTheme=()=>setTheme(current=>{
    const next=current==='dark'?'light':'dark';
    localStorage.setItem('somagede-theme',next);
    document.documentElement.dataset.theme=next;
    return next;
  });
  return <ThemeContext.Provider value={{theme,toggleTheme}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
