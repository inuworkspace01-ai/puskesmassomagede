import './globals.css';
import type { Metadata } from 'next';
import LoadingScreen from '@/components/LoadingScreen';
import SiteChrome from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Puskesmas Somagede | Portal Informasi',
  description: 'Portal informasi dan layanan publik Puskesmas Somagede, Kabupaten Banyumas.'
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="id">
      <body>
        <LoadingScreen />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
