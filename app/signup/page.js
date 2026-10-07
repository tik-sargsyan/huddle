import { redirect } from "next/navigation";
import AuthShell from "../components/AuthShell";
import AuthForm from "../components/AuthForm";
import { signup } from "../actions";
import { currentUser } from "@/lib/auth";

export default async function SignupPage() {
  if (await currentUser()) redirect("/");
  return (
    <AuthShell>
      <AuthForm mode="signup" action={signup} />
    </AuthShell>
  );
}
