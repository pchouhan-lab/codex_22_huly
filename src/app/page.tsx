import { getPublicSiteContent } from "@/lib/content";
import { PublicSite } from "@/components/public/PublicSite";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getPublicSiteContent();

  return <PublicSite content={content} />;
}
