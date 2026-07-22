import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LoginButton } from "@/components/admin/LoginButton";
import { authOptions } from "@/lib/auth";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = searchParams ? await searchParams : {};

  if (session?.user?.isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <img src="/uploads/logo.jpg" alt="Muhlenbruch Insurance logo" />
        <h1>Admin Login</h1>
        <p>Sign in with the allowlisted Google account to manage site content.</p>
        {resolvedSearchParams.error ? <p className="admin-error">Access denied for this Google account.</p> : null}
        <LoginButton />
      </section>
    </main>
  );
}
