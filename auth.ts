import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

export type Role = 'super_admin' | 'admin' | 'staf_informasi';
export type Session = { email: string; name: string; role: Role };

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-only-change-this-secret');

function accountFor(email: string, password: string): { name: string; role: Role; hash: string } | null {
  const normalizedEmail = email.trim().toLowerCase();
  const demoAccounts = [
    { email: 'superadmin@puskesmas.local', name: 'Super Admin', role: 'super_admin' as const, password: 'Somagede@2026!' },
    { email: 'admin@puskesmas.local', name: 'Admin Puskesmas', role: 'admin' as const, password: 'AdminSomagede@2026!' },
    { email: 'informasi@puskesmas.local', name: 'Staf Informasi', role: 'staf_informasi' as const, password: 'StafSomagede@2026!' }
  ];

  // These demo accounts are intentionally checked first so an old Vercel
  // environment variable cannot accidentally block the initial login.
  const demo = demoAccounts.find(r => r.email === normalizedEmail);
  if (demo && password === demo.password) {
    return { name: demo.name, role: demo.role, hash: 'demo' };
  }

  // Optional production accounts: set the corresponding email + bcrypt hash
  // in Vercel Environment Variables. These are used only when the demo
  // credential above was not supplied.
  const rows = [
    { email: process.env.SUPERADMIN_EMAIL, name: 'Super Admin', role: 'super_admin' as const, hash: process.env.SUPERADMIN_PASSWORD_HASH },
    { email: process.env.ADMIN_EMAIL, name: 'Admin Puskesmas', role: 'admin' as const, hash: process.env.ADMIN_PASSWORD_HASH },
    { email: process.env.STAF_EMAIL, name: 'Staf Informasi', role: 'staf_informasi' as const, hash: process.env.STAF_PASSWORD_HASH }
  ];
  const found = rows.find((r): r is typeof r & { email: string; hash: string } =>
    typeof r.email === 'string' && typeof r.hash === 'string' &&
    !r.hash.includes('REPLACE_WITH_BCRYPT_HASH') &&
    r.email.toLowerCase() === normalizedEmail
  );
  return found && bcrypt.compareSync(password, found.hash)
    ? { name: found.name, role: found.role, hash: found.hash }
    : null;
}

export async function authenticate(email: string, password: string): Promise<Session | null> {
  const found = accountFor(email, password);
  return found ? { email, name: found.name, role: found.role } : null;
}

export async function createSession(session: Session) {
  return new SignJWT(session).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(secret);
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.email || !payload.role) return null;
    return { email: String(payload.email), name: String(payload.name || ''), role: payload.role as Role };
  } catch { return null; }
}
