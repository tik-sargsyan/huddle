import { cookies } from "next/headers";
import crypto from "crypto";
import { db } from "./db";

const COOKIE = "huddle_session";
const SECRET =
  process.env.SESSION_SECRET ||
  crypto.createHash("sha256").update(process.env.DATABASE_URL || "dev").digest("hex");

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function startSession(userId) {
  const value = `${userId}.${sign(String(userId))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function currentUser() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [id, sig] = raw.split(".");
  const expected = sign(id);
  if (!sig || sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const sql = await db();
  const [user] = await sql`SELECT id, name, email FROM users WHERE id = ${Number(id)}`;
  return user || null;
}
