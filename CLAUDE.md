# Huddle

Team-building idea board: people pitch ideas, tag a budget tier and category,
and upvote. Next.js (App Router) + Postgres via `postgres`, deployed on Vercel with Neon.

- `app/`: pages, server actions (`app/actions.js`), and client components
- `lib/`: db (tables are auto-created on first request), auth (signed cookie), constants
- Run: `npm install && npm run dev` with `DATABASE_URL` in `.env.local`
- Never commit `.env` or `.env.local`. Keep changes small and readable.
