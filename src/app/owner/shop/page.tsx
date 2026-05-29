import { getSession } from '@/app/actions/auth';
import { getOwnerPharmacies, getOperatingHours } from '@/app/actions/owner';
import { redirect } from 'next/navigation';
import OwnerShopClient from '@/components/OwnerShopClient';

export default async function OwnerShopSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const pharmacies = await getOwnerPharmacies();
  if (pharmacies.length === 0) {
    redirect('/owner');
  }

  const pharmacy = pharmacies[0];
  const operatingHours = await getOperatingHours(pharmacy.id);

  return (
    <OwnerShopClient 
      pharmacy={pharmacy as any} 
      initialHours={operatingHours as any} 
    />
  );
}
