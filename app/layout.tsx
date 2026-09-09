import './globals.css';
import './boot.css';
import './ui-enhancements.css';
import './theme-fixes.css';
import './experience-polish.css';
import './experience-v4.css';
import type { Metadata, Viewport } from 'next';
import LoadingScreen from '@/components/LoadingScreen';
import SiteChrome from '@/components/SiteChrome';
import PWARegister from '@/components/PWARegister';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Puskesmas Somagede',
  description: 'Portal Digital Puskesmas Somagede',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#108765',
};

const themeInit = `(function(){try{var t=localStorage.getItem('somagede-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light';}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <ThemeProvider>
          <LoadingScreen />
          <PWARegister />
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
