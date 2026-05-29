'use server';

import { db } from '@/lib/db';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

async function checkAdminAuth() {
  const session = await getSession();
  if (!session || session.role !== 'SUPERADMIN') {
    throw new Error('Unauthorized. Super Admin access only.');
  }
  return session;
}

// 1. Get stats
export async function getAdminStats() {
  await checkAdminAuth();

  const totalOwners = await db.user.count({ where: { role: 'OWNER' } });
  
  const totalPharmacies = await db.pharmacy.count();
  const verifiedPharmacies = await db.pharmacy.count({ where: { isVerified: true, isSuspended: false } });
  const pendingPharmacies = await db.pharmacy.count({ where: { isVerified: false } });
  const suspendedPharmacies = await db.pharmacy.count({ where: { isSuspended: true } });

  const totalMedicines = await db.medicine.count();

  return {
    totalOwners,
    totalPharmacies,
    verifiedPharmacies,
    pendingPharmacies,
    suspendedPharmacies,
    totalMedicines,
  };
}

// 2. Get list of pharmacies
export async function getAllPharmaciesForAdmin() {
  await checkAdminAuth();

  return await db.pharmacy.findMany({
    include: {
      owner: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      _count: {
        select: {
          medicines: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// 3. Verify pharmacy
export async function verifyPharmacy(pharmacyId: string) {
  try {
    await checkAdminAuth();

    const pharmacy = await db.pharmacy.update({
      where: { id: pharmacyId },
      data: { isVerified: true },
      include: {
        owner: true,
      },
    });

    // Create a notification for the owner
    await db.notification.create({
      data: {
        title: 'Pharmacy Verified!',
        message: `Congratulations! Your pharmacy "${pharmacy.name}" has been verified by the administrator and is now publicly discoverable on Marunnundo.in.`,
        userId: pharmacy.ownerId,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/owner');
    revalidatePath('/');
    revalidatePath(`/pharmacy/${pharmacyId}`);

    return { success: true };
  } catch (error: any) {
    console.error('Verify pharmacy error:', error);
    return { success: false, error: error.message || 'Failed to verify pharmacy' };
  }
}

// 4. Suspend/Unsuspend pharmacy
export async function toggleSuspendPharmacy(pharmacyId: string, suspendState: boolean) {
  try {
    await checkAdminAuth();

    const pharmacy = await db.pharmacy.update({
      where: { id: pharmacyId },
      data: { isSuspended: suspendState },
    });

    // Create a notification for the owner
    await db.notification.create({
      data: {
        title: suspendState ? 'Pharmacy Suspended' : 'Pharmacy Reinstated',
        message: suspendState
          ? `Your pharmacy "${pharmacy.name}" has been suspended by the administrator. Please contact support@marunnundo.in for clarifications.`
          : `Your pharmacy "${pharmacy.name}" has been reinstated by the administrator and is visible on Marunnundo.in again.`,
        userId: pharmacy.ownerId,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/owner');
    revalidatePath('/');
    revalidatePath(`/pharmacy/${pharmacyId}`);

    return { success: true };
  } catch (error: any) {
    console.error('Suspend pharmacy error:', error);
    return { success: false, error: error.message || 'Failed to change suspension state' };
  }
}
