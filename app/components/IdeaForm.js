"use client";

import { useActionState, useEffect, useRef } from "react";
import { createIdea } from "../actions";
import { BUDGETS, CATEGORIES } from "@/lib/constants";

export default function IdeaForm() {
  const [state, action, pending] = useActionState(createIdea, null);
  const ref = useRef(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="card idea-form">
      <h3>Pitch an idea</h3>
      <input name="title" placeholder="e.g. Escape room night" maxLength={100} required />
      <textarea name="description" placeholder="Why it'd be fun, where, when…" rows={3} maxLength={500} />
      <input name="link" placeholder="Booking or venue link (optional)" />

      <fieldset>
        <legend>Budget per person</legend>
        <div className="seg">
          {BUDGETS.map((b, i) => (
            <label key={b.id} title={b.hint}>
              <input type="radio" name="budget" value={b.id} defaultChecked={i === 1} />
              <span>{b.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Category</legend>
        <div className="chips">
          {CATEGORIES.map((c, i) => (
            <label key={c.id}>
              <input type="radio" name="category" value={c.id} defaultChecked={i === 0} />
              <span>{c.emoji} {c.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && <p className="error">{state.error}</p>}
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "Posting…" : "Post idea"}
      </button>
    </form>
  );
}
