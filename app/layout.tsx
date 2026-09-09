import './globals.css';
import './boot.css';
import './ui-enhancements.css';
import type { Metadata } from 'next';
import LoadingScreen from '@/components/LoadingScreen';
import SiteChrome from '@/components/SiteChrome';
import PWARegister from '@/components/PWARegister';
import ThemeProvider from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Puskesmas Somagede',
  description: 'Portal Digital Puskesmas Somagede',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
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
