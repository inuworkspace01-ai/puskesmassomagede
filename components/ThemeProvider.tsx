'use client';

import {createContext,useContext,useEffect,useState} from 'react';

type Theme='light'|'dark';
type ThemeContextValue={theme:Theme;toggleTheme:()=>void};
const ThemeContext=createContext<ThemeContextValue>({theme:'light',toggleTheme:()=>{}});

function getStoredTheme():Theme{
  try{
    const saved=localStorage.getItem('somagede-theme');
    if(saved==='dark'||saved==='light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  }catch{return 'light';}
}

function applyTheme(theme:Theme){
  document.documentElement.dataset.theme=theme;
  document.documentElement.style.colorScheme=theme;
}

export default function ThemeProvider({children}:{children:React.ReactNode}){
  // Keep the first server/client render deterministic. Read browser preference after mount.
  const [theme,setTheme]=useState<Theme>('light');
  useEffect(()=>{
    const next=getStoredTheme();
    setTheme(next);
    applyTheme(next);
    try{localStorage.setItem('somagede-theme',next);}catch{}
  },[]);
  useEffect(()=>{applyTheme(theme);try{localStorage.setItem('somagede-theme',theme);}catch{}},[theme]);
  const toggleTheme=()=>setTheme(current=>current==='dark'?'light':'dark');
  return <ThemeContext.Provider value={{theme,toggleTheme}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
