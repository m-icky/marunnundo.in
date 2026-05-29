import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSession } from '@/app/actions/auth';
import { LanguageProvider } from '@/context/LanguageContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://marunnundo.in'),
  title: {
    default: 'Marunnundo.in — Nearby Medical Shops Kerala',
    template: '%s | Marunnundo.in',
  },
  description: 'കേരളത്തിലെ സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ, അവയിലെ മരുന്ന് ലഭ്യത, ലൈവ് നാവിഗേഷൻ റൂട്ടുകൾ എന്നിവ തൽസമയം പരിശോധിക്കുക. Check nearby medicine availability and driving routes in Kerala.',
  keywords: [
    'medical shop near me Kerala',
    'medicine availability Kochi',
    '24 hour pharmacy Kerala',
    'medical shop Thrissur',
    'medicine search Kerala',
    'മരുന്നുണ്ടോ',
    'marunnundo',
    'marunn undo',
    'marun indo',
    'marun',
    'marunundo',
    'marunnundo kochi',
    'marun undo kerala',
    'marun shop near me',
    'online medicine availability Kerala',
    'pharmacies in Kozhikode',
    'pharmacies in Trivandrum',
  ],
  authors: [{ name: 'Marunnundo Team' }],
  creator: 'Marunnundo Team',
  publisher: 'Marunnundo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ml_IN',
    alternateLocale: 'en_US',
    url: 'https://marunnundo.in',
    title: 'മരുന്നുണ്ടോ.in — സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ കണ്ടെത്താം',
    description: 'കേരളത്തിലെ സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ, അവയിലെ മരുന്ന് ലഭ്യത, ലൈവ് നാവിഗേഷൻ റൂട്ടുകൾ എന്നിവ തൽസമയം പരിശോധിക്കുക. Check nearby medicine availability and driving routes in Kerala.',
    siteName: 'Marunnundo.in',
    images: [
      {
        url: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
        width: 512,
        height: 512,
        alt: 'Marunnundo Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'മരുന്നുണ്ടോ.in — സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ കണ്ടെത്താം',
    description: 'കേരളത്തിലെ സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ, അവയിലെ മരുന്ന് ലഭ്യത, ലൈവ് നാവിഗേഷൻ റൂട്ടുകൾ എന്നിവ തൽസമയം പരിശോധിക്കുക.',
    images: ['https://cdn-icons-png.flaticon.com/512/2966/2966327.png'],
  },
  icons: {
    icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
    apple: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
  },
  alternates: {
    canonical: '/',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <Header session={session} />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
