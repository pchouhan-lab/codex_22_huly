"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminResource, type AdminField, type AdminResourceConfig } from "@/lib/admin/config";
import { prisma } from "@/lib/prisma";
import { isUploadedFile, saveUploadedImage } from "@/lib/uploads";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect("/admin/login");
  }
}

function delegateFor(config: AdminResourceConfig) {
  return (prisma as unknown as Record<string, any>)[config.delegate];
}

function parseStringList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLinkList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...hrefParts] = line.split("|");
      return {
        label: label.trim(),
        href: hrefParts.join("|").trim()
      };
    })
    .filter((item) => item.label && item.href);
}

async function fieldValue(field: AdminField, formData: FormData) {
  if (field.type === "checkbox") {
    return formData.get(field.name) === "on";
  }

  if (field.type === "number") {
    return Number(formData.get(field.name) ?? 0);
  }

  if (field.type === "stringList") {
    return JSON.stringify(parseStringList(formData.get(field.name)));
  }

  if (field.type === "linkList") {
    return JSON.stringify(parseLinkList(formData.get(field.name)));
  }

  if (field.type === "image") {
    const uploaded = formData.get(field.name);
    const existing = String(formData.get(`current_${field.name}`) ?? "");

    if (isUploadedFile(uploaded)) {
      return saveUploadedImage(uploaded, existing);
    }

    return existing;
  }

  return String(formData.get(field.name) ?? "").trim();
}

async function buildData(config: AdminResourceConfig, formData: FormData) {
  const data: Record<string, unknown> = {};

  for (const field of config.fields) {
    data[field.name] = await fieldValue(field, formData);
  }

  return data;
}

export async function saveSingleton(resourceKey: string, formData: FormData) {
  await requireAdmin();

  const config = getAdminResource(resourceKey);
  if (!config || config.mode !== "singleton" || !config.singletonId) {
    throw new Error("Invalid admin resource.");
  }

  const delegate = delegateFor(config);
  await delegate.update({
    where: { id: config.singletonId },
    data: await buildData(config, formData)
  });

  revalidatePath("/");
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}?saved=1`);
}

export async function createListItem(resourceKey: string, formData: FormData) {
  await requireAdmin();

  const config = getAdminResource(resourceKey);
  if (!config || config.mode !== "list") {
    throw new Error("Invalid admin resource.");
  }

  const delegate = delegateFor(config);
  await delegate.create({
    data: await buildData(config, formData)
  });

  revalidatePath("/");
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function updateListItem(resourceKey: string, id: string, formData: FormData) {
  await requireAdmin();

  const config = getAdminResource(resourceKey);
  if (!config || config.mode !== "list") {
    throw new Error("Invalid admin resource.");
  }

  const delegate = delegateFor(config);
  await delegate.update({
    where: { id },
    data: await buildData(config, formData)
  });

  revalidatePath("/");
  revalidatePath(`/admin/${resourceKey}`);
  redirect(`/admin/${resourceKey}`);
}

export async function deleteListItem(resourceKey: string, id: string) {
  await requireAdmin();

  const config = getAdminResource(resourceKey);
  if (!config || config.mode !== "list") {
    throw new Error("Invalid admin resource.");
  }

  const delegate = delegateFor(config);
  await delegate.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/admin/${resourceKey}`);
}

export async function toggleSubmissionRead(id: string) {
  await requireAdmin();

  const current = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!current) {
    throw new Error("Submission not found.");
  }

  await prisma.contactSubmission.update({
    where: { id },
    data: { read: !current.read }
  });

  revalidatePath("/admin/contact-submissions");
}
