import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminForm } from "@/components/admin/AdminForm";
import { updateListItem } from "@/lib/admin/actions";
import { getListRecord, getResourceOrThrow } from "@/lib/admin/data";

export default async function AdminEditResourcePage({
  params
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { id, resource } = await params;
  const config = await getResourceOrThrow(resource);

  if (config.mode !== "list") {
    notFound();
  }

  const record = await getListRecord(config, id);

  if (!record) {
    notFound();
  }

  return (
    <main className="admin-content">
      <Link className="admin-back-link" href={`/admin/${config.key}`}>
        <ArrowLeft size={17} aria-hidden="true" />
        Back to {config.title}
      </Link>
      <div className="admin-page-heading">
        <p>{config.title}</p>
        <h1>Edit {config.title}</h1>
      </div>
      <AdminForm config={config} data={record} action={updateListItem.bind(null, config.key, id)} />
    </main>
  );
}
