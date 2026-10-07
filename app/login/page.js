import { redirect } from "next/navigation";
import AuthShell from "../components/AuthShell";
import AuthForm from "../components/AuthForm";
import { login } from "../actions";
import { currentUser } from "@/lib/auth";

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  return (
    <AuthShell>
      <AuthForm mode="login" action={login} />
    </AuthShell>
  );
}
