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

  return {
    title: `${pharmacy.name} — മെഡിക്കൽ ഷോപ്പ്, ${pharmacy.address.split(',')[0]} | Marunnundo.in`,
    description: `${pharmacy.name} മെഡിക്കൽ ഷോപ്പിലെ ലഭ്യമായ മരുന്നുകൾ പരിശോധിക്കുക. വിലാസം: ${pharmacy.address}. ഫോൺ: ${pharmacy.contactNumber}. Check medicine stock, prices, and map driving directions.`,
    keywords: [
      pharmacy.name,
      'medical shop near me',
      'pharmacy in Kerala',
      'buy medicines online Kerala',
    ],
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
