import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { Role } from "./permissions";

// Auth sederhana (cookie bertanda tangan). Struktur siap diganti ke tabel User + hash password:
// cukup ubah verifyLogin(). Sisanya (session, guard, permission) tidak perlu diubah.
type Session = { email: string; role: Role };

const secret = () => {
  const s = process.env.SESSION_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET belum diisi");
  return s ?? "dev-secret";
};
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("base64url");

export function verifyLogin(email: string, password: string): Session | null {
  const ownerPass = process.env.OWNER_PASSWORD ?? (process.env.NODE_ENV === "production" ? undefined : "owner123");
  const ownerEmail = process.env.OWNER_EMAIL ?? "owner@renphonee.com";
  if (ownerPass && email === ownerEmail && password === ownerPass) return { email, role: "OWNER" };
  return null;
}

export function setSession(s: Session) {
  const v = Buffer.from(JSON.stringify(s)).toString("base64url");
  cookies().set("session", `${v}.${sign(v)}`, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export function getSession(): Session | null {
  const raw = cookies().get("session")?.value;
  if (!raw) return null;
  const [v, sig] = raw.split(".");
  if (!v || !sig) return null;
  const good = sign(v);
  if (sig.length !== good.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return null;
  try { return JSON.parse(Buffer.from(v, "base64url").toString()); } catch { return null; }
}

export const clearSession = () => cookies().delete("session");

export function requireSession(): Session {
  const s = getSession();
  if (!s) throw new Error("Silakan login dulu.");
  return s;
}
