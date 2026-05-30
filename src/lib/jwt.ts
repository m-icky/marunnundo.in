import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'marunnundo_super_secret_jwt_key_kerala_2026'
);

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'OWNER' | 'SUPERADMIN';
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}

export interface ResetPasswordPayload {
  email: string;
  otp?: string;
  otpVerified?: boolean;
}

export async function signResetToken(payload: ResetPasswordPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m') // 10 minutes expiration
    .sign(JWT_SECRET);
}

export async function verifyResetToken(token: string): Promise<ResetPasswordPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as ResetPasswordPayload;
  } catch (error) {
    console.error('Reset JWT Verification failed:', error);
    return null;
  }
}
