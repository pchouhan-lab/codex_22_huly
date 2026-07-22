import Link from "next/link";
import { ArrowLeft, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import type { PublicInsuranceCategory, PublicSiteContent } from "@/lib/content";

export function InsuranceDetailPage({
  content,
  category
}: {
  content: PublicSiteContent;
  category: PublicInsuranceCategory;
}) {
  const phoneHref = `tel:${content.contact.phone.replace(/[^\d+]/g, "")}`;
  const hasImage = Boolean(category.image);
  const homeHref = (href: string) => (href.startsWith("#") ? `/${href}` : href);

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Muhlenbruch Insurance home">
          <img src={content.siteSettings.logoImage} alt="Muhlenbruch Insurance logo" />
          <span>
            <strong>{content.siteSettings.logoText}</strong>
            <small>{content.siteSettings.logoSubtext}</small>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Primary navigation">
          {content.siteSettings.navLinks.map((link) => (
            <Link key={`${link.label}-${link.href}`} href={homeHref(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a className="header-phone" href={phoneHref}>
          <Phone size={18} aria-hidden="true" />
          {content.siteSettings.headerPhone}
        </a>
      </header>

      <section className={`insurance-detail-hero ${hasImage ? "has-image" : ""}`}>
        {hasImage ? <img src={category.image} alt="" className="insurance-detail-hero-image" /> : null}
        <div className="insurance-detail-hero-overlay" />
        <div className="section-inner insurance-detail-hero-content">
          <Link className="detail-back-link" href="/#categories">
            <ArrowLeft size={17} aria-hidden="true" />
            All insurance services
          </Link>
          <div className="detail-icon"><ShieldCheck size={28} aria-hidden="true" /></div>
          <p className="section-kicker">Insurance Services</p>
          <h1>{category.label}</h1>
          <p>{category.description}</p>
        </div>
      </section>

      <section className="insurance-detail-content">
        <div className="section-inner insurance-detail-grid">
          <article>
            <h2>Protection tailored to you</h2>
            {category.detailContent.split(/\n{2,}/).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <aside className="insurance-detail-cta">
            <p>Need help choosing coverage?</p>
            <h2>Talk with a local agent.</h2>
            <Link href="/#contact" className="detail-cta-link">
              Request a free quote
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
