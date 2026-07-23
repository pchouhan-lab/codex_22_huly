export type AdminFieldType = "text" | "email" | "textarea" | "image" | "number" | "checkbox" | "stringList" | "linkList";

export type AdminField = {
  name: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  helper?: string;
};

export type AdminResourceConfig = {
  key: string;
  title: string;
  description: string;
  delegate: string;
  mode: "singleton" | "list" | "submissions";
  singletonId?: string;
  fields: AdminField[];
  listFields: string[];
};

export const adminResources: AdminResourceConfig[] = [
  {
    key: "site-settings",
    title: "Site Settings",
    description: "Logo, navigation links, header details, and contact-form notifications.",
    delegate: "siteSettings",
    mode: "singleton",
    singletonId: "site-settings",
    listFields: ["logoText", "headerPhone"],
    fields: [
      { name: "logoImage", label: "Logo Image", type: "image", required: true },
      { name: "logoText", label: "Logo Text", type: "text", required: true },
      { name: "logoSubtext", label: "Logo Subtext", type: "text", required: true },
      {
        name: "navLinks",
        label: "Navigation Links",
        type: "linkList",
        required: true,
        helper: "One per line: Label | #anchor-or-url"
      },
      { name: "headerPhone", label: "Header Phone", type: "text", required: true },
      {
        name: "contactNotificationEmail",
        label: "Contact Notification Email",
        type: "email",
        required: true,
        helper: "New website contact-form submissions are emailed to this address."
      }
    ]
  },
  {
    key: "hero",
    title: "Hero",
    description: "Main first-screen message, calls to action, and background image.",
    delegate: "hero",
    mode: "singleton",
    singletonId: "hero",
    listFields: ["headline"],
    fields: [
      { name: "headline", label: "Title", type: "text", required: true },
      { name: "backgroundImage", label: "Image", type: "image", required: true },
      { name: "subtitle", label: "Description", type: "textarea", required: true }
    ]
  },
  {
    key: "feature-cards",
    title: "Feature Cards",
    description: "Three promotional cards shown below the hero.",
    delegate: "featureCard",
    mode: "list",
    listFields: ["image", "title", "published", "order"],
    fields: [
      { name: "image", label: "Image", type: "image", required: true },
      { name: "imagePending", label: "Image Pending Replacement", type: "checkbox" },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", required: true },
      { name: "buttonText", label: "Button Text", type: "text", required: true },
      { name: "buttonLink", label: "Button Link", type: "text", required: true },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number", required: true }
    ]
  },
  {
    key: "insurance-categories",
    title: "Insurance Categories",
    description: "Clickable insurance cards and their individual detail pages.",
    delegate: "insuranceCategory",
    mode: "list",
    listFields: ["image", "label", "slug", "published", "order"],
    fields: [
      {
        name: "image",
        label: "Insurance Image",
        type: "image",
        helper: "Upload a landscape image. It fills the insurance card and detail page automatically."
      },
      {
        name: "icon",
        label: "Fallback Icon Identifier",
        type: "text",
        helper: "Only used when no insurance image is uploaded, such as car or home."
      },
      { name: "label", label: "Label", type: "text", required: true },
      { name: "slug", label: "Page URL", type: "text", required: true, helper: "Lowercase URL name, for example auto-insurance." },
      { name: "description", label: "Card Description", type: "textarea", required: true },
      { name: "detailContent", label: "Detail Page Content", type: "textarea", required: true },
      { name: "published", label: "Published", type: "checkbox" },
      { name: "order", label: "Order", type: "number", required: true }
    ]
  },
  {
    key: "about",
    title: "About Us",
    description: "About copy, bullets, team note, portrait, and years badge.",
    delegate: "aboutSection",
    mode: "singleton",
    singletonId: "about-section",
    listFields: ["heading"],
    fields: [
      { name: "sectionLabel", label: "Section Label", type: "text", required: true },
      { name: "heading", label: "Heading", type: "text", required: true },
      { name: "subheading", label: "Subheading", type: "text", required: true },
      { name: "bodyText1", label: "Body Text 1", type: "textarea", required: true },
      { name: "bulletPoints", label: "Bullet Points", type: "stringList", required: true, helper: "One bullet per line." },
      { name: "bodyText2", label: "Body Text 2", type: "textarea", required: true },
      { name: "teamNote", label: "Team Note", type: "textarea", required: true },
      { name: "image", label: "Image", type: "image", required: true },
      { name: "badgeNumber", label: "Badge Number", type: "text", required: true },
      { name: "badgeLabel", label: "Badge Label", type: "text", required: true }
    ]
  },
  {
    key: "contact-info",
    title: "Contact Info",
    description: "Public contact section copy and details.",
    delegate: "contactInfo",
    mode: "singleton",
    singletonId: "contact-info",
    listFields: ["heading", "phone", "email"],
    fields: [
      { name: "sectionLabel", label: "Section Label", type: "text", required: true },
      { name: "heading", label: "Heading", type: "text", required: true },
      { name: "subheading", label: "Subheading", type: "text", required: true },
      { name: "introText", label: "Intro Text", type: "textarea", required: true },
      { name: "highlightText", label: "Highlight Text", type: "textarea", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "address", label: "Address", type: "textarea", required: true }
    ]
  },
  {
    key: "footer-settings",
    title: "Footer Settings",
    description: "Footer tagline, links, office hours, and copyright text.",
    delegate: "footerSettings",
    mode: "singleton",
    singletonId: "footer-settings",
    listFields: ["footerTagline"],
    fields: [
      { name: "tagline", label: "Tagline", type: "textarea", required: true },
      { name: "address", label: "Address", type: "textarea", required: true },
      { name: "phone", label: "Phone", type: "text", required: true },
      { name: "email", label: "Email", type: "text", required: true },
      { name: "quickLinks", label: "Quick Links", type: "linkList", required: true, helper: "One per line: Label | #anchor-or-url" },
      {
        name: "insuranceLinks",
        label: "Insurance Links",
        type: "linkList",
        required: true,
        helper: "One per line: Label | #anchor-or-url"
      },
      { name: "hoursWeekday", label: "Weekday Label", type: "text", required: true },
      { name: "hoursWeekdayTime", label: "Weekday Hours", type: "text", required: true },
      { name: "hoursWeekend", label: "Weekend Label", type: "text", required: true },
      { name: "hoursWeekendTime", label: "Weekend Hours", type: "text", required: true },
      { name: "copyrightText", label: "Copyright Text", type: "text", required: true },
      { name: "footerTagline", label: "Footer Tagline", type: "text", required: true }
    ]
  },
  {
    key: "contact-submissions",
    title: "Contact Submissions",
    description: "Inbound contact form messages, newest first.",
    delegate: "contactSubmission",
    mode: "submissions",
    listFields: ["name", "email", "phone", "read", "createdAt"],
    fields: []
  }
];

export function getAdminResource(key: string) {
  return adminResources.find((resource) => resource.key === key);
}
