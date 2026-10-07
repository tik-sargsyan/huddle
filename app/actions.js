"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { currentUser, startSession, endSession } from "@/lib/auth";
import { BUDGETS, CATEGORIES } from "@/lib/constants";

const clean = (v, max = 500) => String(v || "").trim().slice(0, max);

export async function signup(_prev, form) {
  const name = clean(form.get("name"), 60);
  const email = clean(form.get("email"), 120).toLowerCase();
  const password = String(form.get("password") || "");
  if (!name || !email.includes("@")) return { error: "Enter your name and a valid email." };
  if (password.length < 6) return { error: "Password needs at least 6 characters." };

  const sql = await db();
  const [exists] = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (exists) return { error: "That email already has an account. Log in instead." };

  const hash = await bcrypt.hash(password, 10);
  const [user] = await sql`
    INSERT INTO users (name, email, password_hash) VALUES (${name}, ${email}, ${hash})
    RETURNING id`;
  await startSession(user.id);
  redirect("/");
}

export async function login(_prev, form) {
  const email = clean(form.get("email"), 120).toLowerCase();
  const password = String(form.get("password") || "");
  const sql = await db();
  const [user] = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { error: "Wrong email or password." };
  }
  await startSession(user.id);
  redirect("/");
}

export async function logout() {
  await endSession();
  redirect("/login");
}

async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export async function createIdea(_prev, form) {
  const user = await requireUser();
  const title = clean(form.get("title"), 100);
  const description = clean(form.get("description"), 500);
  let link = clean(form.get("link"), 500);
  const budget = form.get("budget");
  const category = form.get("category");

  if (!title) return { error: "Give your idea a title." };
  if (!BUDGETS.some((b) => b.id === budget)) return { error: "Pick a budget." };
  if (!CATEGORIES.some((c) => c.id === category)) return { error: "Pick a category." };
  if (link && !/^https?:\/\//i.test(link)) link = `https://${link}`;

  const sql = await db();
  const [idea] = await sql`
    INSERT INTO ideas (user_id, title, description, link, budget, category)
    VALUES (${user.id}, ${title}, ${description || null}, ${link || null}, ${budget}, ${category})
    RETURNING id`;
  await sql`INSERT INTO votes (user_id, idea_id) VALUES (${user.id}, ${idea.id})`;
  revalidatePath("/");
  return { ok: true, at: Date.now() };
}

export async function toggleVote(form) {
  const user = await requireUser();
  const ideaId = Number(form.get("ideaId"));
  const sql = await db();
  const removed = await sql`
    DELETE FROM votes WHERE user_id = ${user.id} AND idea_id = ${ideaId} RETURNING idea_id`;
  if (removed.length === 0) {
    await sql`INSERT INTO votes (user_id, idea_id) VALUES (${user.id}, ${ideaId}) ON CONFLICT DO NOTHING`;
  }
  revalidatePath("/");
}

export async function deleteIdea(form) {
  const user = await requireUser();
  const ideaId = Number(form.get("ideaId"));
  const sql = await db();
  await sql`DELETE FROM ideas WHERE id = ${ideaId} AND user_id = ${user.id}`;
  revalidatePath("/");
}
