export type LinkItem = {
  label: string;
  href: string;
};

export type FeatureDefault = {
  id: string;
  image: string;
  imagePending: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  published: boolean;
  order: number;
};

export type CategoryDefault = {
  id: string;
  icon: string;
  label: string;
  published: boolean;
  order: number;
};

export const SINGLETON_IDS = {
  siteSettings: "site-settings",
  hero: "hero",
  aboutSection: "about-section",
  contactInfo: "contact-info",
  footerSettings: "footer-settings"
} as const;

export const siteSettingsDefault = {
  id: SINGLETON_IDS.siteSettings,
  logoImage: "/uploads/logo.jpg",
  logoText: "MUHLENBRUCH",
  logoSubtext: "Insurance Agency",
  navLinks: JSON.stringify([
    { label: "Home", href: "#hero" },
    { label: "About Us", href: "#about" },
    { label: "Insurance", href: "#categories" },
    { label: "Contact Us", href: "#contact" }
  ] satisfies LinkItem[]),
  headerPhone: "515-852-4156"
};

export const heroDefault = {
  id: SINGLETON_IDS.hero,
  badgeText: "Serving Dows, IA Since 2014",
  headline: "Protection You Can Trust",
  subtitle:
    "For over 10 years, Muhlenbruch Insurance has been the trusted choice for families and businesses across Iowa. We shop 15+ top-rated companies to find you the best coverage at the lowest price.",
  backgroundImage: "/placeholders/hero-background.svg",
  primaryCtaText: "Get a Free Quote",
  primaryCtaLink: "#contact",
  secondaryCtaText: "Explore Coverage",
  secondaryCtaLink: "#categories",
  trustItems: JSON.stringify(["15+ Companies", "Free Quotes", "Local Agents"])
};

export const featureCardDefaults: FeatureDefault[] = [
  {
    id: "feature-affordable-coverage",
    image: "/placeholders/feature-paperwork.svg",
    imagePending: true,
    title: "Affordable Coverage With Low Premiums",
    description:
      "Get complete insurance coverage that will save you money. We work hard to find you the best coverage for as little out of pocket as possible.",
    buttonText: "Get a Free Quote",
    buttonLink: "#contact",
    published: true,
    order: 1
  },
  {
    id: "feature-policy-variety",
    image: "/placeholders/feature-touchscreen.svg",
    imagePending: true,
    title: "Wide Variety of Policies to Choose From",
    description:
      "From auto insurance to homeowners insurance, get what you need. With over 15 different companies represented, you will find the right coverage with us.",
    buttonText: "Find Your Plan",
    buttonLink: "#categories",
    published: true,
    order: 2
  },
  {
    id: "feature-dedicated-agents",
    image: "/placeholders/feature-agents.svg",
    imagePending: true,
    title: "Dedicated Agents Focused on Helping You",
    description:
      "Work with a team of experienced agents who are dedicated to seeing your needs are met. Get a customized plan from a company with over 10 years in business.",
    buttonText: "Contact Us Today",
    buttonLink: "#contact",
    published: true,
    order: 3
  }
];

export const categoryDefaults: CategoryDefault[] = [
  { id: "category-auto", icon: "car", label: "Auto Insurance", published: true, order: 1 },
  { id: "category-home", icon: "home", label: "Home Insurance", published: true, order: 2 },
  { id: "category-recreational", icon: "sailboat", label: "Recreational Vehicles", published: true, order: 3 },
  { id: "category-pet", icon: "paw-print", label: "Pet Insurance", published: true, order: 4 },
  { id: "category-dental", icon: "smile-plus", label: "Dental Service", published: true, order: 5 },
  { id: "category-disability", icon: "accessibility", label: "Disability", published: true, order: 6 },
  { id: "category-health", icon: "heart-pulse", label: "Health Insurance", published: true, order: 7 },
  { id: "category-workers", icon: "hard-hat", label: "Workers Compensation", published: true, order: 8 },
  { id: "category-crop", icon: "wheat", label: "Crop Insurance", published: true, order: 9 }
];

export const aboutSectionDefault = {
  id: SINGLETON_IDS.aboutSection,
  sectionLabel: "Who We Are",
  heading: "About Us",
  subheading: "Experienced agents working for you nonstop",
  bodyText1:
    "For over 10 years, our insurance agency has worked with many national and regional insurance companies in order to offer you the best prices and coverage available. When you have a special request, our goal is to make it happen!",
  bulletPoints: JSON.stringify([
    "Customized insurance plans",
    "Plenty of add-ons to choose from",
    "Low premiums that work for your budget"
  ]),
  bodyText2:
    "As always, we strive to provide you with the lowest costs. By working together to find out your needs and providing personalized service, you can get coverage that works for your budget, so you can be protected at all times.",
  teamNote:
    "Learn how Shannon Muhlenbruch, Mikyla Hefti and Eric Bruns can help you by calling Monday through Friday 8am-5pm.",
  image: "/uploads/about-agent-photo.png",
  badgeNumber: "10+",
  badgeLabel: "Years of Service"
};

export const contactInfoDefault = {
  id: SINGLETON_IDS.contactInfo,
  sectionLabel: "Get In Touch",
  heading: "Contact Us",
  subheading: "We would love to hear from you",
  introText:
    "With over 10 years of experience, FREE quotes, and representing 15 different companies, you can rely on Muhlenbruch Insurance for all your insurance needs.",
  highlightText: "GET YOUR FREE INSURANCE QUOTE BY CALLING US TODAY!",
  phone: "515-852-4156",
  email: "muhlenbruchinsurance@hotmail.com",
  address: "Muhlenbruch Insurance Agency, 110 East Ellsworth, Dows, IA"
};

export const footerSettingsDefault = {
  id: SINGLETON_IDS.footerSettings,
  tagline:
    "Protection You Can Trust. Serving Dows, Iowa and surrounding communities with personalized insurance solutions for over 10 years.",
  address: "Muhlenbruch Insurance Agency, 110 East Ellsworth, Dows, IA",
  phone: "515-852-4156",
  email: "muhlenbruchinsurance@hotmail.com",
  quickLinks: JSON.stringify([
    { label: "Home", href: "#hero" },
    { label: "About Us", href: "#about" },
    { label: "Insurance", href: "#categories" },
    { label: "Contact", href: "#contact" }
  ] satisfies LinkItem[]),
  insuranceLinks: JSON.stringify([
    { label: "Auto Insurance", href: "#categories" },
    { label: "Home Insurance", href: "#categories" },
    { label: "Health Insurance", href: "#categories" },
    { label: "Crop Insurance", href: "#categories" }
  ] satisfies LinkItem[]),
  hoursWeekday: "Monday - Friday",
  hoursWeekdayTime: "8:00 AM - 5:00 PM",
  hoursWeekend: "Saturday - Sunday",
  hoursWeekendTime: "Closed",
  copyrightText: "© 2026 Muhlenbruch Insurance Agency. All rights reserved.",
  footerTagline: "Protection You Can Trust."
};
