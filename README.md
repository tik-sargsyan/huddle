# Huddle: team-building idea board

Everyone pitches team-building ideas (with an optional booking or venue link),
tags each one with a budget tier and a category, and upvotes the best ones.
Built with Next.js + Postgres (Neon) and deployed on Vercel.

## Deploy (about 2 minutes)
1. vercel.com/new: import this GitHub repo and pick the branch. No config needed.
2. In the project, go to Storage, then Create Database, then Neon (Postgres), then Connect.
   This sets `DATABASE_URL`.
3. Redeploy. Tables are created automatically on the first request.
4. Optional: add a `SESSION_SECRET` env var.

## Run locally
    npm install
    echo 'DATABASE_URL=postgres://...' > .env.local
    npm run dev

## Features
- Sign up, log in, and log out (email + password, bcrypt, signed httpOnly cookie)
- Pitch an idea: title, description, booking link, budget (Free/$/$$/$$$), category
- One upvote per person per idea (click again to remove it)
- Filter by budget and category, and sort by Top or Newest
- Only the author can delete their idea
