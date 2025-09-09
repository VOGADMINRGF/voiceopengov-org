// apps/web/src/utils/password.ts
import bcrypt from "bcryptjs";
const ROUNDS = Number(process.env.PASSWORD_HASH_ROUNDS ?? 12);
export async function hashPassword(plain: string) { return bcrypt.hash(String(plain), ROUNDS); }
export async function verifyPassword(plain: string, hash: string) { return bcrypt.compare(String(plain), String(hash)); }
