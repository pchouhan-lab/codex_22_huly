import { notFound } from "next/navigation";
import { InsuranceDetailPage } from "@/components/public/InsuranceDetailPage";
import { getPublicSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function InsuranceServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPublicSiteContent();
  const category = content.categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  return <InsuranceDetailPage content={content} category={category} />;
}
