import type { AdminResourceConfig } from "@/lib/admin/config";
import { valueToTextarea } from "@/lib/admin/format";
import { SubmitButton } from "@/components/admin/SubmitButton";

export function AdminForm({
  config,
  data,
  action,
  submitLabel = "Save Changes"
}: {
  config: AdminResourceConfig;
  data?: Record<string, unknown> | null;
  action: (formData: FormData) => Promise<void>;
  submitLabel?: string;
}) {
  return (
    <form className="admin-form" action={action}>
      {config.fields.map((field) => {
        const value = data?.[field.name];

        if (field.type === "textarea" || field.type === "stringList" || field.type === "linkList") {
          return (
            <label className="admin-field" key={field.name}>
              <span>{field.label}</span>
              <textarea
                name={field.name}
                defaultValue={valueToTextarea(field, value)}
                required={field.required}
                rows={field.type === "textarea" ? 5 : 4}
              />
              {field.helper ? <small>{field.helper}</small> : null}
            </label>
          );
        }

        if (field.type === "checkbox") {
          return (
            <label className="admin-check-field" key={field.name}>
              <input name={field.name} type="checkbox" defaultChecked={Boolean(value)} />
              <span>{field.label}</span>
              {field.helper ? <small>{field.helper}</small> : null}
            </label>
          );
        }

        if (field.type === "image") {
          const currentValue = String(value ?? "");

          return (
            <label className="admin-field" key={field.name}>
              <span>{field.label}</span>
              <input type="hidden" name={`current_${field.name}`} value={currentValue} />
              {currentValue ? (
                currentValue.startsWith("/") ? (
                  <img className="admin-image-preview" src={currentValue} alt="" />
                ) : (
                  <p className="admin-current-value">Current icon identifier: {currentValue}</p>
                )
              ) : null}
              <input name={field.name} type="file" accept="image/*" />
              {field.helper ? <small>{field.helper}</small> : null}
            </label>
          );
        }

        return (
          <label className="admin-field" key={field.name}>
            <span>{field.label}</span>
            <input
              name={field.name}
              type={field.type === "number" ? "number" : "text"}
              defaultValue={String(value ?? "")}
              required={field.required}
            />
            {field.helper ? <small>{field.helper}</small> : null}
          </label>
        );
      })}
      <div className="admin-form-actions">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
