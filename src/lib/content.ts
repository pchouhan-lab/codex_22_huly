import {
  aboutSectionDefault,
  categoryDefaults,
  contactInfoDefault,
  featureCardDefaults,
  footerSettingsDefault,
  heroDefault,
  LinkItem,
  siteSettingsDefault,
  SINGLETON_IDS
} from "@/lib/defaults";
import { prisma } from "@/lib/prisma";

export type PublicFeatureCard = {
  id: string;
  image: string;
  imagePending: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

export type PublicInsuranceCategory = {
  id: string;
  icon: string;
  label: string;
};

export type PublicSiteContent = {
  siteSettings: {
    logoImage: string;
    logoText: string;
    logoSubtext: string;
    navLinks: LinkItem[];
    headerPhone: string;
  };
  hero: {
    badgeText: string;
    headline: string;
    subtitle: string;
    backgroundImage: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    trustItems: string[];
  };
  features: PublicFeatureCard[];
  categories: PublicInsuranceCategory[];
  about: {
    sectionLabel: string;
    heading: string;
    subheading: string;
    bodyText1: string;
    bulletPoints: string[];
    bodyText2: string;
    teamNote: string;
    image: string;
    badgeNumber: string;
    badgeLabel: string;
  };
  contact: {
    sectionLabel: string;
    heading: string;
    subheading: string;
    introText: string;
    highlightText: string;
    phone: string;
    email: string;
    address: string;
  };
  footer: {
    tagline: string;
    address: string;
    phone: string;
    email: string;
    quickLinks: LinkItem[];
    insuranceLinks: LinkItem[];
    hoursWeekday: string;
    hoursWeekdayTime: string;
    hoursWeekend: string;
    hoursWeekendTime: string;
    copyrightText: string;
    footerTagline: string;
  };
};

export function parseJsonArray<T>(value: string | null | undefined, fallback: T[] = []) {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

export async function getPublicSiteContent(): Promise<PublicSiteContent> {
  const [siteSettings, hero, features, categories, about, contact, footer] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: SINGLETON_IDS.siteSettings } }),
    prisma.hero.findUnique({ where: { id: SINGLETON_IDS.hero } }),
    prisma.featureCard.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }]
    }),
    prisma.insuranceCategory.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }]
    }),
    prisma.aboutSection.findUnique({ where: { id: SINGLETON_IDS.aboutSection } }),
    prisma.contactInfo.findUnique({ where: { id: SINGLETON_IDS.contactInfo } }),
    prisma.footerSettings.findUnique({ where: { id: SINGLETON_IDS.footerSettings } })
  ]);

  const site = siteSettings ?? siteSettingsDefault;
  const heroRow = hero ?? heroDefault;
  const aboutRow = about ?? aboutSectionDefault;
  const contactRow = contact ?? contactInfoDefault;
  const footerRow = footer ?? footerSettingsDefault;
  const featureRows = features.length ? features : featureCardDefaults;
  const categoryRows = categories.length ? categories : categoryDefaults;

  return {
    siteSettings: {
      logoImage: site.logoImage,
      logoText: site.logoText,
      logoSubtext: site.logoSubtext,
      navLinks: parseJsonArray<LinkItem>(site.navLinks, []),
      headerPhone: site.headerPhone
    },
    hero: {
      badgeText: heroRow.badgeText,
      headline: heroRow.headline,
      subtitle: heroRow.subtitle,
      backgroundImage: heroRow.backgroundImage,
      primaryCtaText: heroRow.primaryCtaText,
      primaryCtaLink: heroRow.primaryCtaLink,
      secondaryCtaText: heroRow.secondaryCtaText,
      secondaryCtaLink: heroRow.secondaryCtaLink,
      trustItems: parseJsonArray<string>(heroRow.trustItems, [])
    },
    features: featureRows.map((feature) => ({
      id: feature.id,
      image: feature.image,
      imagePending: feature.imagePending,
      title: feature.title,
      description: feature.description,
      buttonText: feature.buttonText,
      buttonLink: feature.buttonLink
    })),
    categories: categoryRows.map((category) => ({
      id: category.id,
      icon: category.icon,
      label: category.label
    })),
    about: {
      sectionLabel: aboutRow.sectionLabel,
      heading: aboutRow.heading,
      subheading: aboutRow.subheading,
      bodyText1: aboutRow.bodyText1,
      bulletPoints: parseJsonArray<string>(aboutRow.bulletPoints, []),
      bodyText2: aboutRow.bodyText2,
      teamNote: aboutRow.teamNote,
      image: aboutRow.image,
      badgeNumber: aboutRow.badgeNumber,
      badgeLabel: aboutRow.badgeLabel
    },
    contact: {
      sectionLabel: contactRow.sectionLabel,
      heading: contactRow.heading,
      subheading: contactRow.subheading,
      introText: contactRow.introText,
      highlightText: contactRow.highlightText,
      phone: contactRow.phone,
      email: contactRow.email,
      address: contactRow.address
    },
    footer: {
      tagline: footerRow.tagline,
      address: footerRow.address,
      phone: footerRow.phone,
      email: footerRow.email,
      quickLinks: parseJsonArray<LinkItem>(footerRow.quickLinks, []),
      insuranceLinks: parseJsonArray<LinkItem>(footerRow.insuranceLinks, []),
      hoursWeekday: footerRow.hoursWeekday,
      hoursWeekdayTime: footerRow.hoursWeekdayTime,
      hoursWeekend: footerRow.hoursWeekend,
      hoursWeekendTime: footerRow.hoursWeekendTime,
      copyrightText: footerRow.copyrightText,
      footerTagline: footerRow.footerTagline
    }
  };
}
