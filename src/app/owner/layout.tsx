import { getSession } from '@/app/actions/auth';
import { getOwnerPharmacies } from '@/app/actions/owner';
import { redirect } from 'next/navigation';
import OwnerSidebarClient from '@/components/OwnerSidebarClient';

interface Props {
  children: React.ReactNode;
}

export default async function OwnerLayout({ children }: Props) {
  const session = await getSession();
  
  // Guard route
  if (!session || session.role !== 'OWNER') {
    redirect('/login');
  }

  const pharmacies = await getOwnerPharmacies();
  const hasPharmacy = pharmacies.length > 0;
  const primaryPharmacy = hasPharmacy ? pharmacies[0] : null;

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      
      {/* SIDEBAR NAVIGATION (Desktop Client Component) */}
      <OwnerSidebarClient primaryPharmacy={primaryPharmacy} />

      {/* MAIN DASHBOARD PAGE OUTLET */}
      <main className="flex-1 bg-slate-50 p-4 sm:p-8 flex flex-col gap-6 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
