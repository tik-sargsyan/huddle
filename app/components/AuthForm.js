"use client";

import { useActionState } from "react";
import Link from "next/link";

export default function AuthForm({ mode, action }) {
  const [state, formAction, pending] = useActionState(action, null);
  const isSignup = mode === "signup";
  return (
    <form action={formAction} className="auth-form">
      <h1>{isSignup ? "Join the huddle" : "Welcome back"}</h1>
      <p className="muted">
        {isSignup ? "Create an account to pitch and vote on ideas." : "Log in to see what the team is planning."}
      </p>
      {isSignup && (
        <label>
          Name
          <input name="name" placeholder="Ani Petrosyan" required autoComplete="name" />
        </label>
      )}
      <label>
        Email
        <input name="email" type="email" placeholder="you@company.com" required autoComplete="email" />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          placeholder={isSignup ? "At least 6 characters" : "••••••••"}
          required
          autoComplete={isSignup ? "new-password" : "current-password"}
        />
      </label>
      {state?.error && <p className="error">{state.error}</p>}
      <button className="btn btn-primary btn-block" disabled={pending}>
        {pending ? "One sec…" : isSignup ? "Create account" : "Log in"}
      </button>
      <p className="muted center">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create an account"}</Link>
      </p>
    </form>
  );
}
