import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminForm } from "@/components/admin/AdminForm";
import { createListItem } from "@/lib/admin/actions";
import { getListRecords, getResourceOrThrow } from "@/lib/admin/data";

export default async function AdminNewResourcePage({
  params
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource } = await params;
  const config = await getResourceOrThrow(resource);

  if (config.mode !== "list") {
    notFound();
  }

  const records = await getListRecords(config);
  const initialData: Record<string, unknown> = {
    published: true,
    imagePending: false,
    order: records.length + 1
  };

  return (
    <main className="admin-content">
      <Link className="admin-back-link" href={`/admin/${config.key}`}>
        <ArrowLeft size={17} aria-hidden="true" />
        Back to {config.title}
      </Link>
      <div className="admin-page-heading">
        <p>{config.title}</p>
        <h1>Create {config.title.slice(0, -1)}</h1>
      </div>
      <AdminForm config={config} data={initialData} action={createListItem.bind(null, config.key)} submitLabel="Create" />
    </main>
  );
}
