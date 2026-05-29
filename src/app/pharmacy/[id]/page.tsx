import { getPharmacyDetails } from '@/app/actions/public';
import { getSession } from '@/app/actions/auth';
import { notFound } from 'next/navigation';
import PharmacyDetailsClient from '@/components/PharmacyDetailsClient';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

// Generate dynamic SEO metadata for each pharmacy details page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pharmacy = await getPharmacyDetails(id);

  if (!pharmacy) {
    return {
      title: 'Pharmacy Not Found — Marunnundo.in',
    };
  }

  const shareTitle = `${pharmacy.name} — മെഡിക്കൽ ഷോപ്പ്, ${pharmacy.address.split(',')[0] || 'Kerala'} | Marunnundo.in`;
  const shareDesc = `${pharmacy.name} മെഡിക്കൽ ഷോപ്പിലെ ലഭ്യമായ മരുന്നുകൾ പരിശോധിക്കുക. വിലാസം: ${pharmacy.address}. ഫോൺ: ${pharmacy.contactNumber}. Check medicine stock and driving navigation.`;
  const shareImage = pharmacy.logo || pharmacy.banner || 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png';

  return {
    title: shareTitle,
    description: shareDesc,
    keywords: [
      pharmacy.name,
      pharmacy.address.split(',')[0] || '',
      'medical shop near me',
      'pharmacy in Kerala',
      'buy medicines online Kerala',
      'മരുന്നുണ്ടോ',
    ],
    openGraph: {
      title: shareTitle,
      description: shareDesc,
      type: 'website',
      url: `https://marunnundo.in/pharmacy/${id}`,
      images: [
        {
          url: shareImage,
          width: 600,
          height: 600,
          alt: pharmacy.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: shareDesc,
      images: [shareImage],
    },
    alternates: {
      canonical: `/pharmacy/${id}`,
    },
  };
}

export default async function PharmacyPage({ params }: Props) {
  const { id } = await params;
  const pharmacy = await getPharmacyDetails(id);
  const session = await getSession();

  if (!pharmacy) {
    notFound();
  }

  return (
    <PharmacyDetailsClient 
      pharmacy={pharmacy as any} 
      session={session} 
    />
  );
}
