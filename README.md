# Muhlenbruch Insurance

Dynamic Next.js implementation of the Muhlenbruch Insurance website with a SQLite-backed admin panel, Google OAuth admin access, editable site content, uploads, and stored contact submissions.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set Google OAuth values:

```bash
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="..."
ADMIN_EMAILS=pchouhan@starlab.co.in
```

3. Create and seed the SQLite database:

```bash
npm run db:push
npm run db:seed
```

4. Run the app:

```bash
npm run dev
```

Public site: `http://localhost:3000`

Admin login: `http://localhost:3000/admin/login`

## Google OAuth

Create OAuth credentials in Google Cloud Console and add this callback URI for local development:

```text
http://localhost:3000/api/auth/callback/google
```

Only emails listed in `ADMIN_EMAILS` can complete sign-in.

## Deployment

Use an always-on Node host with a persistent filesystem for `prisma/dev.db` and uploaded images. Serverless platforms such as Vercel and Netlify are not appropriate for the SQLite file requirement.

### Railway

Use repository root `.` for the Railway service. The app listens on Railway's `PORT` automatically through `npm start`.

Required Railway variables:

```bash
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
NEXTAUTH_URL="https://your-railway-domain.up.railway.app"
NEXTAUTH_SECRET="a-long-random-secret"
ADMIN_EMAILS=pchouhan@starlab.co.in
```

After Railway gives you a public domain, add this callback URI in Google Cloud Console:

```text
https://your-railway-domain.up.railway.app/api/auth/callback/google
```

Build command:

```bash
npm ci && npm run db:deploy && npm run db:seed && npm run build
```

Start command:

```bash
npm start
```
