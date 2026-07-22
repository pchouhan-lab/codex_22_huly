# Muhlenbruch Insurance — Full-Stack Project Build Spec

This is the complete build spec for a dynamic, database-backed version of the Muhlenbruch Insurance website, with an admin panel for managing all site content. **Visual design is locked** — use the provided static HTML file (`muhlenbruch_insurance.html`) as the exact source of truth for layout, styling, colors, fonts, animations, and structure. Do not redesign it. The only change from the static version is that content becomes dynamic (pulled from a database and editable via an admin panel) instead of hardcoded.

---

## 1. Design Source (do not alter)

- Reference implementation: `muhlenbruch_insurance.html` (provided separately)
- Fonts: Playfair Display (headings/logo) + Inter (body) via Google Fonts
- Color palette (CSS variables from the source file):
  - `--maroon: #5C1A1B`
  - `--maroon-light: #7A2526`
  - `--cream: #F2EEE3`
  - `--cream-dark: #E8E3D4`
  - `--sky: #3FA9E0`
  - `--sky-dark: #2D8BC4`
  - `--charcoal: #1E1E1E`
  - `--charcoal-light: #3D3D3D`
  - `--gold: #C9A84C`
- Sections, in order: Header/Nav → Hero → Features (3-col) → Insurance Categories (9-grid, dark background) → About Us → Contact Us (info + form) → Footer
- Keep all existing animations (scroll reveals, hero Ken Burns background, shimmer text, hover states) exactly as implemented in the source HTML.
- Rebuild this HTML/CSS as React/Next.js components (see stack below) — same markup structure and class-based styling logic, just componentized and fed by the database instead of hardcoded content.

---

## 2. Tech Stack

- **Framework:** Next.js (App Router) + TypeScript + Tailwind CSS (or the existing hand-rolled CSS ported into CSS Modules — preserve the existing visual output exactly either way)
- **Database:** SQLite via Prisma ORM — a single embedded file (`prisma/dev.db`) inside the project. No external database service; no connection string to a hosted provider.
  - **Deployment note:** this requires a persistent filesystem (a VPS, Docker container with a volume, or any always-on Node host). It will **not** work on serverless/edge platforms that reset the filesystem per request (e.g. Vercel/Netlify serverless functions). Deployment target hasn't been decided yet — build for a standard always-on Node process (`npm run build && npm start`) so it's portable to a VPS or Docker later.
- **Auth:** Google OAuth via Auth.js (NextAuth), restricted to a specific allowlisted email — not username/password, not open signup.
- **Animation:** Framer Motion for scroll-triggered reveals (replacing the vanilla JS `IntersectionObserver` in the source file with equivalent React-friendly behavior — same visual result).

---

## 3. Admin Authentication

- **Method:** Google OAuth (sign in with Google), gated by an email allowlist. No password-based admin login, no public signup.
- **Allowlisted admin email:** `pchouhan@starlab.co.in`
- Sign-in attempts from any other Google account must be denied at the auth callback level (not just hidden in the UI).
- `.env` variables required: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `ADMIN_EMAILS=pchouhan@starlab.co.in`, `DATABASE_URL="file:./dev.db"`
- The person setting this up will need to create their own Google OAuth credentials in Google Cloud Console (app name, OAuth consent screen, redirect URI `http://localhost:3000/api/auth/callback/google` for dev) — this is a manual step outside of what code can automate.
- Login page: single "Sign in with Google" button at `/admin/login`.

---

## 4. Content Models (Admin-Managed)

Every model below is fully editable through the admin dashboard (create/edit/delete where it makes sense — some are effectively singleton "settings" rows). Every model includes `id`, `createdAt`, `updatedAt`.

### 4.1 SiteSettings (singleton — logo & nav)
- `logoImage` (image upload) — the Muhlenbruch umbrella logo
- `logoText` — "MUHLENBRUCH"
- `logoSubtext` — "Insurance Agency"
- `navLinks` (repeatable: label + anchor/URL) — seed with: Home (#hero), About Us (#about), Insurance (#categories), Contact Us (#contact)
- `headerPhone` — 515-852-4156

### 4.2 Hero (singleton)
- `badgeText` — "Serving Dows, IA Since 2014"
- `headline` — "Protection You Can Trust" (with "Trust" styled as the emphasized/highlighted word)
- `subtitle` — "For over 10 years, Muhlenbruch Insurance has been the trusted choice for families and businesses across Iowa. We shop 15+ top-rated companies to find you the best coverage at the lowest price."
- `backgroundImage` (image upload)
- `primaryCtaText` / `primaryCtaLink` — "Get a Free Quote" → #contact
- `secondaryCtaText` / `secondaryCtaLink` — "Explore Coverage" → #categories
- `trustItems` (repeatable text, e.g. "15+ Companies", "Free Quotes", "Local Agents")

### 4.3 FeatureCard (list — 3 items, reorderable)
- `image` (image upload)
- `title`
- `description`
- `buttonText` / `buttonLink`
- `published` (boolean, default true)
- `order` (int, for display order)

Seed content (real, provided by the user):
1. Image: insurance paperwork/calculator/envelope — Title: "Affordable Coverage With Low Premiums" — Text: "Get complete insurance coverage that will save you money. We work hard to find you the best coverage for as little out of pocket as possible." — Button: "Get a Free Quote" → #contact
2. Image: hand pointing to insurance touchscreen (Home/Life/Health/Car) — Title: "Wide Variety of Policies to Choose From" — Text: "From auto insurance to homeowners insurance, get what you need. With over 15 different companies represented, you will find the right coverage with us." — Button: "Find Your Plan" → #categories
3. Image: agents meeting with a couple — Title: "Dedicated Agents Focused on Helping You" — Text: "Work with a team of experienced agents who are dedicated to seeing your needs are met. Get a customized plan from a company with over 10 years in business." — Button: "Contact Us Today" → #contact

### 4.4 InsuranceCategory (list — 9 items, reorderable)
- `icon` (image upload OR icon identifier — admin should be able to upload a custom image per category, matching the reference screenshots)
- `label`
- `published` (boolean, default true)
- `order` (int)

Seed content (real, provided by the user, in this order):
1. Auto Insurance
2. Home Insurance
3. Recreational Vehicles
4. Pet Insurance
5. Dental Service
6. Disability
7. Health Insurance
8. Workers Compensation
9. Crop Insurance

### 4.5 AboutSection (singleton)
- `sectionLabel` — "Who We Are"
- `heading` — "About Us"
- `subheading` — "Experienced agents working for you nonstop"
- `bodyText1` — "For over 10 years, our insurance agency has worked with many national and regional insurance companies in order to offer you the best prices and coverage available. When you have a special request, our goal is to make it happen!"
- `bulletPoints` (repeatable text) — "Customized insurance plans", "Plenty of add-ons to choose from", "Low premiums that work for your budget"
- `bodyText2` — "As always, we strive to provide you with the lowest costs. By working together to find out your needs and providing personalized service, you can get coverage that works for your budget, so you can be protected at all times."
- `teamNote` — "Learn how Shannon Muhlenbruch, Mikyla Hefti and Eric Bruns can help you by calling Monday through Friday 8am-5pm."
- `image` (image upload) — agent portrait photo
- `badgeNumber` — "10+"
- `badgeLabel` — "Years of Service"

### 4.6 ContactInfo (singleton)
- `sectionLabel` — "Get In Touch"
- `heading` — "Contact Us"
- `subheading` — "We would love to hear from you"
- `introText` — "With over 10 years of experience, FREE quotes, and representing 15 different companies, you can rely on Muhlenbruch Insurance for all your insurance needs."
- `highlightText` — "GET YOUR FREE INSURANCE QUOTE BY CALLING US TODAY!"
- `phone` — 515-852-4156
- `email` — muhlenbruchinsurance@hotmail.com
- `address` — Muhlenbruch Insurance Agency, 110 East Ellsworth, Dows, IA

### 4.7 ContactSubmission (list — read-only for admin, generated by the public contact form)
- `name`
- `email`
- `phone`
- `message`
- `read` (boolean, default false)
- Admin dashboard view: list of submissions, newest first, mark as read/unread, no public edit access (this is inbound data, not editable content).

### 4.8 FooterSettings (singleton)
- `tagline` — "Protection You Can Trust. Serving Dows, Iowa and surrounding communities with personalized insurance solutions for over 10 years."
- `address`, `phone`, `email` (can mirror ContactInfo or be independently editable — make independently editable in case footer wording ever needs to differ)
- `quickLinks` (repeatable label + anchor) — seed: Home, About Us, Insurance, Contact
- `insuranceLinks` (repeatable label + anchor) — seed: Auto Insurance, Home Insurance, Health Insurance, Crop Insurance
- `hoursWeekday` — "Monday - Friday" / "8:00 AM - 5:00 PM"
- `hoursWeekend` — "Saturday - Sunday" / "Closed"
- `copyrightText` — "© 2026 Muhlenbruch Insurance Agency. All rights reserved."
- `footerTagline` — "Protection You Can Trust."

---

## 5. Contact Form (public-facing)

- Fields: Name*, Email*, Phone*, Message* — matches the existing "Say Hello" form exactly (same labels, same placeholders, same layout).
- Client-side validation (required fields, email format) for immediate feedback.
- Server-side validation (Zod or equivalent) — never trust client validation alone.
- Include a honeypot field (hidden from real users) for basic spam mitigation.
- On successful submission: write to `ContactSubmission` table, show the existing "Thank you, we will contact you shortly" confirmation.
- Submissions appear in the admin dashboard for the admin to review — this is not a fire-and-forget email, it's stored data.

---

## 6. Admin Dashboard

- Gated entirely behind Google OAuth + allowlist (see Section 3).
- Landing page after login: dashboard listing all manageable models (Site Settings, Hero, Feature Cards, Insurance Categories, About Us, Contact Info, Footer Settings, Contact Submissions).
- Each list-type model (Feature Cards, Insurance Categories) gets full CRUD: create, edit, delete, reorder.
- Each singleton model (Hero, About Us, Contact Info, Footer Settings, Site Settings) gets a single edit form (no create/delete — just update the one row).
- Contact Submissions: list view only, with read/unread toggle — no create/edit (it's inbound data).
- Image fields use a simple upload control (store the file and reference its path/URL in the DB — no need for cloud storage integration unless later requested).
- Build the CRUD UI from a shared, config-driven table + form pattern rather than a bespoke page per model, so adding a future content model doesn't require rebuilding the admin UI from scratch.

---

## 7. Assets Provided (real files, included alongside this spec)

**Delivered now — actual image files, in `/assets`:**
- **`assets/logo.jpg`** — Muhlenbruch Insurance umbrella mark (maroon/cream, with house/tractor/motorcycle/car/truck/crop icons in the canopy, tagline "Protection You Can Trust" / "Insuring Your Future"). Use this for `SiteSettings.logoImage`, replacing the inline SVG umbrella currently in the header of the static HTML.
- **`assets/about-agent-photo.png`** — professional agent portrait (agent in suit holding folder, couple in background). Use this for `AboutSection.image`.

**Pending — to be re-uploaded by the client before final seeding:**
- **Feature card images (3):** insurance paperwork/calculator, hand on insurance touchscreen selector, agents meeting with a couple. Until provided, seed `FeatureCard.image` with clearly-generic placeholder images (not stock photos presented as real) and flag them as pending replacement.
- **Insurance category images (9):** real photos for each category (auto accident, home w/ life preserver, storm-damaged boat, vet with cat, dental smile, wheelchair, health insurance graphic, lineman at work, cornfield). Until provided, keep the existing inline SVG icons from the static HTML as a functional placeholder rather than inventing stock photography.

Once the 12 pending images are re-uploaded, update `prisma/seed.ts` (or edit directly via the admin panel — that's the point of the CRUD UI) to swap in the real files. Do not treat placeholder imagery as final content.

---

## 8. Environment Variables (`.env.example`)

```
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
ADMIN_EMAILS=pchouhan@starlab.co.in
```

---

## 9. Definition of Done

- Public site renders identically (visually) to the provided static HTML, but every section listed in §4 is pulled live from the database.
- Editing any field in the admin panel is reflected on the public site without a code change or redeploy.
- Contact form submissions are validated on both client and server, stored in the database, and visible in the admin dashboard.
- Signing in with `pchouhan@starlab.co.in` grants admin access; any other Google account is denied at the auth callback (not just hidden in the UI).
- App runs with a single `npm run dev` (or `npm run build && npm start`) and a documented `.env.example` — no external database signup required.
