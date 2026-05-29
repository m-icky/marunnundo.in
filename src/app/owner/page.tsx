import { getSession } from '@/app/actions/auth';
import { getOwnerPharmacies, getPharmacyAnalytics } from '@/app/actions/owner';
import { redirect } from 'next/navigation';
import OwnerDashboardClient from '@/components/OwnerDashboardClient';

export default async function OwnerDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const pharmacies = await getOwnerPharmacies();
  
  if (pharmacies.length === 0) {
    return (
      <OwnerDashboardClient 
        sessionName={session.name}
        analytics={null}
        pharmacyId={null}
      />
    );
  }

  const pharmacy = pharmacies[0];
  const analytics = await getPharmacyAnalytics(pharmacy.id);

  return (
    <OwnerDashboardClient 
      sessionName={session.name}
      analytics={analytics}
      pharmacyId={pharmacy.id}
    />
  );
}
