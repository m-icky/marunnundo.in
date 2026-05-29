import { getSession } from '@/app/actions/auth';
import { getOwnerPharmacies, getMedicines } from '@/app/actions/owner';
import { redirect } from 'next/navigation';
import OwnerMedicinesClient from '@/components/OwnerMedicinesClient';

export default async function OwnerMedicinesPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const pharmacies = await getOwnerPharmacies();
  if (pharmacies.length === 0) {
    redirect('/owner');
  }

  const pharmacy = pharmacies[0];
  const medicines = await getMedicines(pharmacy.id);

  return (
    <OwnerMedicinesClient 
      pharmacyId={pharmacy.id} 
      initialMedicines={medicines as any[]} 
    />
  );
}
