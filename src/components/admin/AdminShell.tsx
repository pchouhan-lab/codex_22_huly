import Link from "next/link";
import { adminResources } from "@/lib/admin/config";
import { SignOutButton } from "@/components/admin/SignOutButton";

export function AdminShell({ children, email }: { children: React.ReactNode; email?: string | null }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          <span>MI</span>
          <strong>Muhlenbruch Admin</strong>
        </Link>
        <nav aria-label="Admin navigation">
          {adminResources.map((resource) => (
            <Link key={resource.key} href={`/admin/${resource.key}`}>
              {resource.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <span>{email}</span>
          <Link className="admin-secondary-button" href="/">
            View Site
          </Link>
          <SignOutButton />
        </header>
        {children}
      </div>
    </div>
  );
}
