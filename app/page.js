import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { BUDGETS, CATEGORIES, budgetOf, categoryOf } from "@/lib/constants";
import { logout, toggleVote, deleteIdea } from "./actions";
import IdeaForm from "./components/IdeaForm";
import SubmitButton from "./components/SubmitButton";

export const dynamic = "force-dynamic";

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function filterHref(params, key, value) {
  const next = { ...params, [key]: value };
  if (!value) delete next[key];
  const qs = new URLSearchParams(next).toString();
  return qs ? `/?${qs}` : "/";
}

export default async function Board({ searchParams }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const { budget = "", category = "", sort = "top" } = params;
  const sql = await db();

  const ideas = await sql`
    SELECT i.*, u.name AS author,
      COUNT(v.user_id)::int AS votes,
      BOOL_OR(v.user_id = ${user.id}) AS voted
    FROM ideas i
    JOIN users u ON u.id = i.user_id
    LEFT JOIN votes v ON v.idea_id = i.id
    WHERE (${budget} = '' OR i.budget = ${budget})
      AND (${category} = '' OR i.category = ${category})
    GROUP BY i.id, u.name
    ORDER BY ${sort === "new" ? sql`i.created_at DESC` : sql`votes DESC, i.created_at DESC`}`;

  const [stats] = await sql`
    SELECT (SELECT COUNT(*) FROM ideas)::int AS ideas,
           (SELECT COUNT(*) FROM users)::int AS members,
           (SELECT COUNT(*) FROM votes)::int AS votes`;

  const first = user.name.split(" ")[0];

  return (
    <>
      <header className="topbar">
        <div className="logo">huddle<span>.</span></div>
        <div className="me">
          <span className="avatar">{user.name[0].toUpperCase()}</span>
          <span className="me-name">{user.name}</span>
          <form action={logout}>
            <button className="btn btn-ghost">Log out</button>
          </form>
        </div>
      </header>

      <main className="board">
        <section className="intro">
          <div>
            <p className="eyebrow">Team board</p>
            <h1>Hey {first}, what should we do together?</h1>
          </div>
          <div className="stats">
            <div><b>{stats.ideas}</b><span>ideas</span></div>
            <div><b>{stats.votes}</b><span>votes</span></div>
            <div><b>{stats.members}</b><span>people</span></div>
          </div>
        </section>

        <div className="layout">
          <aside>
            <IdeaForm />
          </aside>

          <section>
            <div className="filters">
              <div className="chips">
                <Link className={`chip ${!budget ? "on" : ""}`} href={filterHref(params, "budget", "")}>Any budget</Link>
                {BUDGETS.map((b) => (
                  <Link key={b.id} title={b.hint} className={`chip ${budget === b.id ? "on" : ""}`} href={filterHref(params, "budget", b.id)}>
                    {b.label}
                  </Link>
                ))}
              </div>
              <div className="chips">
                <Link className={`chip ${!category ? "on" : ""}`} href={filterHref(params, "category", "")}>All</Link>
                {CATEGORIES.map((c) => (
                  <Link key={c.id} className={`chip ${category === c.id ? "on" : ""}`} href={filterHref(params, "category", c.id)}>
                    {c.emoji} {c.label}
                  </Link>
                ))}
              </div>
              <div className="sort">
                <Link className={sort !== "new" ? "on" : ""} href={filterHref(params, "sort", "")}>Top</Link>
                <Link className={sort === "new" ? "on" : ""} href={filterHref(params, "sort", "new")}>Newest</Link>
              </div>
            </div>

            {ideas.length === 0 ? (
              <div className="card empty">
                <div className="empty-icon">🏕️</div>
                <h3>No ideas here yet</h3>
                <p className="muted">Be the first to pitch something. Even a simple picnic counts.</p>
              </div>
            ) : (
              <ol className="ideas">
                {ideas.map((idea, i) => {
                  const b = budgetOf(idea.budget);
                  const c = categoryOf(idea.category);
                  const leading = sort !== "new" && i < 3 && idea.votes > 0;
                  return (
                    <li key={idea.id} className={`card idea ${leading ? "leading" : ""}`}>
                      <form action={toggleVote}>
                        <input type="hidden" name="ideaId" value={idea.id} />
                        <SubmitButton className={`vote ${idea.voted ? "voted" : ""}`} aria-label="Upvote">
                          <span className="arrow">▲</span>
                          <span className="count">{idea.votes}</span>
                        </SubmitButton>
                      </form>
                      <div className="idea-body">
                        <div className="idea-meta">
                          {leading && <span className="rank">#{i + 1}</span>}
                          <span className="tag">{c.emoji} {c.label}</span>
                          <span className={`tag budget budget-${b.id}`} title={b.hint}>{b.label} · {b.hint}</span>
                        </div>
                        <h3>{idea.title}</h3>
                        {idea.description && <p>{idea.description}</p>}
                        <div className="idea-foot">
                          <span className="muted">by {idea.user_id === user.id ? "you" : idea.author}</span>
                          {idea.link && (
                            <a href={idea.link} target="_blank" rel="noopener noreferrer" className="link">
                              ↗ {hostOf(idea.link)}
                            </a>
                          )}
                          {idea.user_id === user.id && (
                            <form action={deleteIdea} className="del">
                              <input type="hidden" name="ideaId" value={idea.id} />
                              <SubmitButton className="btn-text">Delete</SubmitButton>
                            </form>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
