'use server';

import { db } from '@/lib/db';
import { getSession } from './auth';
import { revalidatePath } from 'next/cache';

// Haversine formula to calculate distance in KM between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
}

// 1. Get nearby pharmacies
export async function getNearbyPharmacies(lat?: number, lng?: number, radiusKm: number = 20) {
  try {
    const pharmacies = await db.pharmacy.findMany({
      where: {
        isVerified: true,
        isSuspended: false,
      },
      include: {
        _count: {
          select: {
            medicines: true,
            reviews: true,
          },
        },
      },
    });

    if (!lat || !lng) {
      // If no location provided, return all verified pharmacies
      return pharmacies.map((p) => ({
        ...p,
        distance: null,
      }));
    }

    // Filter and sort by distance using Haversine
    return pharmacies
      .map((p) => {
        const distance = calculateDistance(lat, lng, p.latitude, p.longitude);
        return {
          ...p,
          distance: parseFloat(distance.toFixed(2)),
        };
      })
      .filter((p) => p.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error('Error fetching nearby pharmacies:', error);
    return [];
  }
}

// 2. Search pharmacies/medicines globally
export async function searchPharmacies(
  query: string,
  lat?: number,
  lng?: number,
  searchType: 'all' | 'shop' | 'medicine' = 'all'
) {
  try {
    if (!query.trim()) {
      return await getNearbyPharmacies(lat, lng);
    }

    const searchQuery = query.trim();

    // Fetch verified pharmacies
    const pharmacies = await db.pharmacy.findMany({
      where: {
        isVerified: true,
        isSuspended: false,
        ...(searchType === 'shop'
          ? {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { address: { contains: searchQuery, mode: 'insensitive' } },
              ],
            }
          : searchType === 'medicine'
          ? {
              medicines: {
                some: {
                  OR: [
                    { name: { contains: searchQuery, mode: 'insensitive' } },
                    { genericName: { contains: searchQuery, mode: 'insensitive' } },
                    { category: { contains: searchQuery, mode: 'insensitive' } },
                  ],
                },
              },
            }
          : {
              // all search types
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { address: { contains: searchQuery, mode: 'insensitive' } },
                {
                  medicines: {
                    some: {
                      OR: [
                        { name: { contains: searchQuery, mode: 'insensitive' } },
                        { genericName: { contains: searchQuery, mode: 'insensitive' } },
                        { category: { contains: searchQuery, mode: 'insensitive' } },
                      ],
                    },
                  },
                },
              ],
            }),
      },
      include: {
        _count: {
          select: {
            medicines: true,
            reviews: true,
          },
        },
        medicines: {
          where: {
            OR: [
              { name: { contains: searchQuery, mode: 'insensitive' } },
              { genericName: { contains: searchQuery, mode: 'insensitive' } },
            ],
          },
          select: {
            name: true,
            genericName: true,
            isAvailable: true,
            quantity: true,
            price: true,
          },
        },
      },
    });

    // Map distances and sort
    const results = pharmacies.map((p) => {
      const distance = lat && lng ? calculateDistance(lat, lng, p.latitude, p.longitude) : null;
      return {
        ...p,
        distance: distance !== null ? parseFloat(distance.toFixed(2)) : null,
      };
    });

    if (lat && lng) {
      return results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return results;
  } catch (error) {
    console.error('Error searching pharmacies:', error);
    return [];
  }
}

// 3. Get single pharmacy details
export async function getPharmacyDetails(id: string) {
  return await db.pharmacy.findUnique({
    where: { id },
    include: {
      medicines: {
        orderBy: { name: 'asc' },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      operatingHours: true,
    },
  });
}

// 4. Submit user review
export async function submitReview(pharmacyId: string, rating: number, comment: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: 'Please log in to submit a review' };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    const review = await db.review.create({
      data: {
        rating,
        comment: comment || null,
        userId: session.id,
        pharmacyId,
      },
    });

    // Recalculate average rating for pharmacy
    const reviews = await db.review.findMany({
      where: { pharmacyId },
      select: { rating: true },
    });

    const averageRating =
      reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length;

    await db.pharmacy.update({
      where: { id: pharmacyId },
      data: { rating: parseFloat(averageRating.toFixed(1)) },
    });

    revalidatePath(`/pharmacy/${pharmacyId}`);
    revalidatePath('/');

    return { success: true, review };
  } catch (error: any) {
    console.error('Submit review error:', error);
    return { success: false, error: error.message || 'Failed to submit review' };
  }
}
