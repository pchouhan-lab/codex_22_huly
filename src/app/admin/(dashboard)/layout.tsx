import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }

  return <AdminShell email={session.user.email}>{children}</AdminShell>;
}
