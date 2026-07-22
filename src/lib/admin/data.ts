import { notFound } from "next/navigation";
import { getAdminResource, type AdminResourceConfig } from "@/lib/admin/config";
import { prisma } from "@/lib/prisma";

function delegateFor(config: AdminResourceConfig) {
  return (prisma as unknown as Record<string, any>)[config.delegate];
}

export async function getResourceOrThrow(resourceKey: string) {
  const config = getAdminResource(resourceKey);

  if (!config) {
    notFound();
  }

  return config;
}

export async function getSingletonRecord(config: AdminResourceConfig) {
  if (!config.singletonId) {
    notFound();
  }

  return delegateFor(config).findUnique({
    where: { id: config.singletonId }
  });
}

export async function getListRecords(config: AdminResourceConfig) {
  if (config.mode === "submissions") {
    return prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" }
    });
  }

  return delegateFor(config).findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });
}

export async function getListRecord(config: AdminResourceConfig, id: string) {
  return delegateFor(config).findUnique({
    where: { id }
  });
}
