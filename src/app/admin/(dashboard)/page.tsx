import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { adminResources } from "@/lib/admin/config";

export default function AdminDashboardPage() {
  return (
    <main className="admin-content">
      <div className="admin-page-heading">
        <p>Dashboard</p>
        <h1>Manage Website Content</h1>
      </div>
      <div className="admin-resource-grid">
        {adminResources.map((resource) => (
          <Link className="admin-resource-card" href={`/admin/${resource.key}`} key={resource.key}>
            <span>{resource.title}</span>
            <p>{resource.description}</p>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </main>
  );
}
