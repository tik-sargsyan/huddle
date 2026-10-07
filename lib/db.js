import postgres from "postgres";

// Neon on Vercel may add a custom prefix (e.g. STORAGE_DATABASE_URL), so accept any of these.
const urlKey =
  ["DATABASE_URL", "POSTGRES_URL"].find((k) => process.env[k]) ||
  Object.keys(process.env).find((k) => /(DATABASE_URL|POSTGRES_URL)$/.test(k));
const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
const url =
  (urlKey && process.env[urlKey]) ||
  (PGHOST && `postgres://${PGUSER}:${encodeURIComponent(PGPASSWORD || "")}@${PGHOST}/${PGDATABASE}?sslmode=require`);
export const hasDb = Boolean(url);

const sql = globalThis._sql || postgres(url || "postgres://missing", { max: 1, prepare: false });
if (process.env.NODE_ENV !== "production") globalThis._sql = sql;

let ready;

// Create tables on first use, so a fresh Neon database works with no setup step.
export async function db() {
  ready ||= sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS ideas (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      link TEXT,
      budget TEXT NOT NULL,
      category TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS votes (
      user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      idea_id INT NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
      PRIMARY KEY (user_id, idea_id)
    );
  `.simple().catch((err) => {
    ready = null; // retry on the next request
    throw err;
  });
  await ready;
  return sql;
}
