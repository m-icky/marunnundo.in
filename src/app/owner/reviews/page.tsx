import { getSession } from '@/app/actions/auth';
import { getOwnerPharmacies } from '@/app/actions/owner';
import { getPharmacyDetails } from '@/app/actions/public';
import { redirect } from 'next/navigation';
import OwnerReviewsClient from '@/components/OwnerReviewsClient';

export default async function OwnerReviewsPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const pharmacies = await getOwnerPharmacies();
  if (pharmacies.length === 0) {
    redirect('/owner');
  }

  const pharmacy = pharmacies[0];
  const fullDetails = await getPharmacyDetails(pharmacy.id);

  return (
    <OwnerReviewsClient 
      pharmacyId={pharmacy.id} 
      initialReviews={fullDetails?.reviews as any[] || []} 
    />
  );
}
