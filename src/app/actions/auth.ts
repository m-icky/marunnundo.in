'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { signToken, verifyToken } from '@/lib/jwt';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['USER', 'OWNER', 'SUPERADMIN']),
});

export async function login(email: string, password: string) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Find user
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Sign JWT
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return {
      success: true,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error('Login action error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

export async function registerUser(name: string, email: string, phone: string, password: string) {
  try {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'Email is already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // Log in automatically
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, user: { name: user.name, email: user.email, role: user.role } };
  } catch (error: any) {
    console.error('Register user error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

interface RegisterOwnerInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  shopName: string;
  address: string;
  licenseNumber: string;
  contactNumber: string;
  whatsappNumber: string | null;
  deliveryAvailable: boolean;
  deliveryRadius: number;
  emergencySupport: boolean;
  latitude: number;
  longitude: number;
}

export async function registerOwner(data: RegisterOwnerInput) {
  try {
    const {
      name,
      email,
      phone,
      password,
      shopName,
      address,
      licenseNumber,
      contactNumber,
      whatsappNumber,
      deliveryAvailable,
      deliveryRadius,
      emergencySupport,
      latitude,
      longitude
    } = data;

    if (!name || !email || !password || !shopName || !licenseNumber || !address || !contactNumber || latitude === undefined || longitude === undefined) {
      return { success: false, error: 'All fields are required' };
    }

    // Check if email or license taken
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'Email is already registered' };
    }

    const existingPharmacy = await db.pharmacy.findUnique({ where: { licenseNumber } });
    if (existingPharmacy) {
      return { success: false, error: 'Pharmacy license number is already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Owner + Pharmacy + Operating Hours in transaction
    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'OWNER',
        },
      });

      const pharmacy = await tx.pharmacy.create({
        data: {
          name: shopName,
          licenseNumber,
          address,
          contactNumber,
          whatsappNumber: whatsappNumber || contactNumber,
          deliveryAvailable,
          deliveryRadius,
          emergencySupport,
          latitude,
          longitude,
          ownerId: user.id,
          isVerified: false, // Super Admin verification required!
        },
      });

      // Default operating hours
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (const day of days) {
        await tx.operatingHours.create({
          data: {
            day,
            openTime: '08:30',
            closeTime: '21:30',
            isClosed: false,
            pharmacyId: pharmacy.id,
          },
        });
      }

      // Add a notification for registration
      await tx.notification.create({
        data: {
          title: 'Pharmacy Registered Successfully',
          message: `Welcome ${name}! Your pharmacy "${shopName}" is currently pending verification. You can configure your inventory and operating hours while we process your verification.`,
          userId: user.id,
        },
      });

      return { user, pharmacy };
    });

    // Auto-login after registration
    const token = await signToken({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, user: { name: result.user.name, email: result.user.email, role: result.user.role } };
  } catch (error: any) {
    console.error('Register owner action error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  return { success: true };
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}
