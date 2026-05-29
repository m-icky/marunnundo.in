import { getSession } from '@/app/actions/auth';
import { getAdminStats, getAllPharmaciesForAdmin } from '@/app/actions/admin';
import { redirect } from 'next/navigation';
import AdminPanelClient from '@/components/AdminPanelClient';

export default async function AdminDashboardPage() {
  const session = await getSession();
  
  // Guard route
  if (!session || session.role !== 'SUPERADMIN') {
    redirect('/login');
  }

  const stats = await getAdminStats();
  const pharmacies = await getAllPharmaciesForAdmin();

  return (
    <AdminPanelClient 
      stats={stats} 
      initialPharmacies={pharmacies as any[]} 
    />
  );
}
