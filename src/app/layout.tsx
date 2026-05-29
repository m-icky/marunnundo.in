import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSession } from '@/app/actions/auth';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'മരുന്നുണ്ടോ.in — സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ കണ്ടെത്താം',
  description: 'കേരളത്തിലെ സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ, അവയിലെ മരുന്ന് ലഭ്യത, ലൈവ് നാവിഗേഷൻ റൂട്ടുകൾ എന്നിവ തൽസമയം പരിശോധിക്കുക. Check nearby medicine availability and driving routes in Kerala.',
  keywords: [
    'medical shop near me Kerala',
    'medicine availability Kochi',
    '24 hour pharmacy Kerala',
    'medical shop Thrissur',
    'medicine search Kerala',
    'മരുന്നുണ്ടോ',
  ],
  authors: [{ name: 'Marunnundo Team' }],
  icons: {
    icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png',
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
        <Header session={session} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
