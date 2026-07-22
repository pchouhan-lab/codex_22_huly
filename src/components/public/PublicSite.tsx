"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  Accessibility,
  ArrowRight,
  Car,
  Check,
  Clock,
  HardHat,
  HeartPulse,
  Home as HomeIcon,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  Sailboat,
  ShieldCheck,
  SmilePlus,
  Wheat
} from "lucide-react";
import {
  CONTACT_LIMITS,
  contactFieldOrder,
  formatPhoneNumberInput,
  hasContactErrors,
  normalizeContactForm,
  validateContactForm,
  type ContactField,
  type ContactFormErrors
} from "@/lib/contact-rules";
import type { PublicSiteContent } from "@/lib/content";

const reveal = {
  hidden: { opacity: 0, y: 38 },
  visible: { opacity: 1, y: 0 }
};

const categoryIcons = {
  car: Car,
  home: HomeIcon,
  sailboat: Sailboat,
  "paw-print": PawPrint,
  "smile-plus": SmilePlus,
  accessibility: Accessibility,
  "heart-pulse": HeartPulse,
  "hard-hat": HardHat,
  wheat: Wheat
};

type ContactState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  company: string;
};

function renderHeadline(headline: string) {
  const highlight = "Trust";
  const index = headline.lastIndexOf(highlight);

  if (index === -1) {
    return headline;
  }

  return (
    <>
      {headline.slice(0, index)}
      <span className="highlight-word">{headline.slice(index)}</span>
    </>
  );
}

function CategoryVisual({ icon }: { icon: string }) {
  if (icon.startsWith("/")) {
    return <img src={icon} alt="" className="category-image" />;
  }

  const Icon = categoryIcons[icon as keyof typeof categoryIcons] ?? ShieldCheck;
  return <Icon aria-hidden="true" strokeWidth={1.75} />;
}

function ContactForm() {
  const [form, setForm] = useState<ContactState>({
    name: "",
    email: "",
    phone: "",
    message: "",
    company: ""
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  function updateField(field: keyof ContactState, value: string) {
    const nextValue = field === "phone" ? formatPhoneNumberInput(value) : value;

    setForm((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
    setServerMessage("");
  }

  function validate(nextForm = form) {
    const nextErrors = validateContactForm({ ...nextForm, company: "" });
    setErrors(nextErrors);
    return !hasContactErrors(nextErrors);
  }

  function validateField(field: ContactField, value: string) {
    const nextValue = field === "phone" ? formatPhoneNumberInput(value) : value;
    const nextErrors = validateContactForm({ ...form, [field]: nextValue, company: "" });

    if (field === "phone" && nextValue !== form.phone) {
      setForm((current) => ({ ...current, phone: nextValue }));
    }

    setErrors((current) => ({ ...current, [field]: nextErrors[field] }));
  }

  function formErrorsFromServer(fieldErrors?: Record<string, string[]>) {
    const nextErrors: ContactFormErrors = {};

    for (const field of contactFieldOrder) {
      const message = fieldErrors?.[field]?.[0];

      if (message) {
        nextErrors[field] = message;
      }
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitData = normalizeContactForm({
      ...form,
      phone: formatPhoneNumberInput(form.phone),
      company: ""
    });

    setForm((current) => ({ ...current, ...submitData, company: "" }));

    if (!validate(submitData)) {
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    let response: Response;

    try {
      response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(submitData)
      });
    } catch {
      setStatus("error");
      setServerMessage("We could not send your message right now. Please try again.");
      return;
    }

    const payload = (await response.json().catch(() => ({}))) as {
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (!response.ok) {
      setStatus("error");
      setServerMessage(payload.message ?? "Please check your details and try again.");
      setErrors(formErrorsFromServer(payload.errors));
      return;
    }

    setStatus("success");
    setServerMessage(payload.message ?? "Thank you, we will contact you shortly.");
    setErrors({});
    setForm({ name: "", email: "", phone: "", message: "", company: "" });
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <h3>Say Hello</h3>
      <div className="form-grid">
        <label>
          <span>Name*</span>
          <input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            onBlur={(event) => validateField("name", event.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            maxLength={CONTACT_LIMITS.nameMax}
            required
          />
          {errors.name ? <small id="contact-name-error">{errors.name}</small> : null}
        </label>
        <label>
          <span>Email*</span>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={(event) => validateField("email", event.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            maxLength={CONTACT_LIMITS.emailMax}
            required
          />
          {errors.email ? <small id="contact-email-error">{errors.email}</small> : null}
        </label>
      </div>
      <label>
        <span>Phone*</span>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          onBlur={(event) => validateField("phone", event.target.value)}
          placeholder="(515) 852-4156"
          autoComplete="tel"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          maxLength={CONTACT_LIMITS.phoneMax}
          pattern="^\\+?1?\\s?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$"
          required
        />
        {errors.phone ? <small id="contact-phone-error">{errors.phone}</small> : null}
      </label>
      <label className="honeypot" aria-hidden="true">
        <span>Company</span>
        <input
          id="contact-company"
          name="company"
          tabIndex={-1}
          value={form.company}
          onChange={(event) => updateField("company", event.target.value)}
          autoComplete="off"
        />
      </label>
      <label>
        <span>Message*</span>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={(event) => validateField("message", event.target.value)}
          placeholder="Tell us about the coverage you need"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          maxLength={CONTACT_LIMITS.messageMax}
          required
        />
        {errors.message ? <small id="contact-message-error">{errors.message}</small> : null}
      </label>
      <button className="btn btn-primary form-submit" disabled={status === "submitting"} type="submit">
        {status === "submitting" ? "Sending..." : "Send Message"}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
      {serverMessage ? (
        <p className={`form-message ${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}

export function PublicSite({ content }: { content: PublicSiteContent }) {
  const phoneHref = `tel:${content.contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#hero" aria-label="Muhlenbruch Insurance home">
          <img src={content.siteSettings.logoImage} alt="Muhlenbruch Insurance logo" />
          <span>
            <strong>{content.siteSettings.logoText}</strong>
            <small>{content.siteSettings.logoSubtext}</small>
          </span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          {content.siteSettings.navLinks.map((link) => (
            <a key={`${link.label}-${link.href}`} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="header-phone" href={phoneHref}>
          <Phone size={18} aria-hidden="true" />
          {content.siteSettings.headerPhone}
        </a>
      </header>

      <section id="hero" className="hero">
        <div className="hero-background" style={{ backgroundImage: `url(${content.hero.backgroundImage})` }} />
        <div className="hero-overlay" />
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        >
          <h1>{renderHeadline(content.hero.headline)}</h1>
          <p className="hero-subtitle">{content.hero.subtitle}</p>
        </motion.div>
      </section>

      <section className="features-section" aria-label="Insurance service highlights">
        <div className="section-inner feature-grid">
          {content.features.map((feature, index) => (
            <motion.article
              className="feature-card"
              key={feature.id}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <div className="feature-image-wrap">
                <img src={feature.image} alt="" className="feature-image" />
                {feature.imagePending ? <span className="pending-badge">Pending image</span> : null}
              </div>
              <div className="feature-body">
                <h2>{feature.title}</h2>
                <p>{feature.description}</p>
                <a href={feature.buttonLink} className="text-link">
                  {feature.buttonText}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="categories" className="categories-section">
        <div className="section-inner">
          <motion.div
            className="section-heading centered light"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
          >
            <p className="section-kicker">Coverage Options</p>
            <h2>Insurance Categories</h2>
          </motion.div>
          <div className="category-grid">
            {content.categories.map((category, index) => (
              <motion.a
                className="category-card"
                key={category.id}
                href={`/insurance/${category.slug}`}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
              >
                {category.image ? <img className="category-card-image" src={category.image} alt="" /> : null}
                <span className="category-card-overlay" />
                <span className="category-card-content">
                  <span className="category-icon">
                    <CategoryVisual icon={category.icon} />
                  </span>
                  <h3>{category.label}</h3>
                  <p>{category.description}</p>
                  <span className="category-card-link">Explore coverage <ArrowRight size={16} aria-hidden="true" /></span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="section-inner about-grid">
          <motion.div
            className="about-copy"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-kicker">{content.about.sectionLabel}</p>
            <h2>{content.about.heading}</h2>
            <h3>{content.about.subheading}</h3>
            <p>{content.about.bodyText1}</p>
            <ul className="check-list">
              {content.about.bulletPoints.map((point) => (
                <li key={point}>
                  <Check size={18} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <p>{content.about.bodyText2}</p>
            <p className="team-note">{content.about.teamNote}</p>
          </motion.div>
          <motion.div
            className="about-image-wrap"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <img src={content.about.image} alt="Muhlenbruch Insurance agent" className="about-image" />
            <div className="experience-badge">
              <strong>{content.about.badgeNumber}</strong>
              <span>{content.about.badgeLabel}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-inner contact-grid">
          <motion.div
            className="contact-copy"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-kicker">{content.contact.sectionLabel}</p>
            <h2>{content.contact.heading}</h2>
            <h3>{content.contact.subheading}</h3>
            <p>{content.contact.introText}</p>
            <strong className="quote-highlight">{content.contact.highlightText}</strong>
            <div className="contact-methods">
              <a href={phoneHref}>
                <Phone aria-hidden="true" />
                <span>{content.contact.phone}</span>
              </a>
              <a href={`mailto:${content.contact.email}`}>
                <Mail aria-hidden="true" />
                <span>{content.contact.email}</span>
              </a>
              <p>
                <MapPin aria-hidden="true" />
                <span>{content.contact.address}</span>
              </p>
            </div>
          </motion.div>
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-inner footer-grid">
          <div>
            <a className="footer-brand" href="#hero">
              <img src={content.siteSettings.logoImage} alt="" />
              <span>
                <strong>{content.siteSettings.logoText}</strong>
                <small>{content.footer.footerTagline}</small>
              </span>
            </a>
            <p>{content.footer.tagline}</p>
          </div>
          <div>
            <h2>Quick Links</h2>
            {content.footer.quickLinks.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <h2>Insurance</h2>
            {content.footer.insuranceLinks.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div>
            <h2>Contact</h2>
            <p>{content.footer.address}</p>
            <a href={phoneHref}>{content.footer.phone}</a>
            <a href={`mailto:${content.footer.email}`}>{content.footer.email}</a>
            <p className="hours">
              <Clock size={16} aria-hidden="true" />
              <span>
                {content.footer.hoursWeekday}: {content.footer.hoursWeekdayTime}
                <br />
                {content.footer.hoursWeekend}: {content.footer.hoursWeekendTime}
              </span>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>{content.footer.copyrightText}</p>
        </div>
      </footer>
    </main>
  );
}
