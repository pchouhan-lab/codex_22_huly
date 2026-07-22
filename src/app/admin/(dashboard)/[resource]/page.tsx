import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { AdminForm } from "@/components/admin/AdminForm";
import { deleteListItem, saveSingleton, toggleSubmissionRead } from "@/lib/admin/actions";
import { formatAdminValue } from "@/lib/admin/format";
import { getListRecords, getResourceOrThrow, getSingletonRecord } from "@/lib/admin/data";

function cellValue(field: string, value: unknown) {
  const text = formatAdminValue(value);

  if (field === "image" || field === "icon" || field === "logoImage" || field === "backgroundImage") {
    if (text.startsWith("/")) {
      return <img src={text} alt="" className="admin-table-image" />;
    }

    return <span className="admin-chip">{text}</span>;
  }

  if (field === "read") {
    return <span className={text === "Yes" ? "admin-status read" : "admin-status unread"}>{text === "Yes" ? "Read" : "Unread"}</span>;
  }

  return text;
}

export default async function AdminResourcePage({
  params,
  searchParams
}: {
  params: Promise<{ resource: string }>;
  searchParams?: Promise<{ saved?: string }>;
}) {
  const { resource } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const config = await getResourceOrThrow(resource);

  if (config.mode === "singleton") {
    const record = await getSingletonRecord(config);

    if (!record) {
      notFound();
    }

    return (
      <main className="admin-content">
        <div className="admin-page-heading">
          <p>{config.title}</p>
          <h1>Edit {config.title}</h1>
          <span>{config.description}</span>
        </div>
        {resolvedSearchParams.saved ? <p className="admin-success">Saved.</p> : null}
        <AdminForm config={config} data={record} action={saveSingleton.bind(null, config.key)} />
      </main>
    );
  }

  const records = await getListRecords(config);

  if (config.mode === "submissions") {
    return (
      <main className="admin-content">
        <div className="admin-page-heading">
          <p>{config.title}</p>
          <h1>Review Contact Submissions</h1>
          <span>{config.description}</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Received</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record: Record<string, unknown>) => (
                <tr key={String(record.id)}>
                  <td>{cellValue("read", record.read)}</td>
                  <td>{formatAdminValue(record.name)}</td>
                  <td>
                    <a href={`mailto:${formatAdminValue(record.email)}`}>{formatAdminValue(record.email)}</a>
                  </td>
                  <td>{formatAdminValue(record.phone)}</td>
                  <td className="admin-message-cell">{formatAdminValue(record.message)}</td>
                  <td>{formatAdminValue(record.createdAt)}</td>
                  <td>
                    <form action={toggleSubmissionRead.bind(null, String(record.id))}>
                      <button className="admin-icon-button compact" type="submit">
                        {record.read ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                        {record.read ? "Mark unread" : "Mark read"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {records.length === 0 ? (
                <tr>
                  <td colSpan={7}>No submissions yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-content">
      <div className="admin-page-heading with-action">
        <div>
          <p>{config.title}</p>
          <h1>Manage {config.title}</h1>
          <span>{config.description}</span>
        </div>
        <Link className="admin-primary-button" href={`/admin/${config.key}/new`}>
          <Plus size={17} aria-hidden="true" />
          Add New
        </Link>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {config.listFields.map((field) => (
                <th key={field}>{field}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record: Record<string, unknown>) => (
              <tr key={String(record.id)}>
                {config.listFields.map((field) => (
                  <td key={field}>{cellValue(field, record[field])}</td>
                ))}
                <td>
                  <div className="admin-row-actions">
                    <Link className="admin-icon-button compact" href={`/admin/${config.key}/${String(record.id)}`}>
                      <Edit size={16} aria-hidden="true" />
                      Edit
                    </Link>
                    <form action={deleteListItem.bind(null, config.key, String(record.id))}>
                      <button className="admin-icon-button danger compact" type="submit">
                        <Trash2 size={16} aria-hidden="true" />
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {records.length === 0 ? (
              <tr>
                <td colSpan={config.listFields.length + 1}>No records yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </main>
  );
}
