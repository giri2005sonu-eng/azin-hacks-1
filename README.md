# BHAIYO KI PHADAI

**Har Student Ka Haq, Har Scholarship Ki Khabar.**

An AI-assisted scholarship discovery platform for Indian students. It helps students find scholarships and grants they may qualify for, understand why each one matches, check how recently the deadline was verified, and track their applications.

> **Status: early development.** The features below describe the planned scope. Check the roadmap for what is built so far.

> **Disclaimer:** BHAIYO KI PHADAI is an independent discovery and tracking tool. It is not affiliated with or endorsed by the Government of India or any scholarship provider. Eligibility results are based on available information and are not official confirmation. Always check the provider's official website before applying.

---

## The problem

Scholarship information is scattered across government portals, state education departments, universities, foundations, NGOs and CSR programs. Students struggle to know which scholarships are open, whether they qualify, which documents they need, and whether a listed deadline is still accurate.

## What it does (planned)

- **Discovery:** search and filter scholarships by education level, provider type, state, category, income, award amount and deadline.
- **Explainable matching:** every result shows what matches, what does not, and what is unknown, instead of an unexplained percentage.
- **Verification labels:** each listing shows its source link, last-checked and last-verified times, and a status of Verified Open, Upcoming, Closed or Verification Required. Missing or unconfirmed dates are never shown as open.
- **Application tracker:** students record their own progress (Interested, Preparing Documents, Submitted and so on). The platform does not submit applications or read provider-side status.
- **Saved scholarships and comparison:** compare up to four scholarships side by side.
- **Deadline reminders:** configurable email reminders.
- **Private document vault (optional):** discovery works without uploading anything.
- **Admin dashboard:** source health, sync history, user reports and record review.
- **Demo mode:** clearly labelled sample data, so the app can be shown without live credentials.

## How data is collected

1. Search queries are generated from scholarship criteria only. No student data is ever put into a query.
2. [TinyFish](https://docs.tinyfish.ai) Search finds candidate public pages, and TinyFish Fetch retrieves their content.
3. Content is parsed into a structured schema and validated.
4. Records keep their source URL, evidence snippet and timestamps.
5. Status is decided from evidence. A successful page fetch does not by itself mean a deadline is verified.
6. Official provider pages take priority over aggregators. Conflicting sources are flagged, not silently overwritten.

Coverage is not complete. Some sources may be inaccessible, outdated or unsuitable for automated extraction.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui, Lucide icons |
| Forms | React Hook Form, Zod |
| Database and auth | Supabase (PostgreSQL, Auth, private Storage, row-level security) |
| Discovery | TinyFish Search and Fetch APIs |
| Email | Resend |
| Charts | Recharts |

## Getting started

### Prerequisites

- Node.js 20 or newer
- A [Supabase](https://supabase.com) project
- A TinyFish API key (needed only for live discovery)
- A Resend API key (needed only for email)

### Setup

```bash
git clone https://github.com/<your-username>/bhaiyo-ki-phadai.git
cd bhaiyo-ki-phadai
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # server-side only
TINYFISH_API_KEY=your_tinyfish_key                # server-side only
RESEND_API_KEY=your_resend_key                    # server-side only
APP_BASE_URL=http://localhost:3000
```

Then run the app:

```bash
npm run dev
```

Open http://localhost:3000.

### Without credentials

Without a TinyFish key, live discovery shows a configuration error rather than fake results. Use demo mode to explore the app with sample data, which is always labelled **DEMO DATA**.

## Security and privacy

- Secrets stay on the server. Never commit `.env` files, and never expose the service role key or TinyFish key in client code.
- Student data is protected with row-level security, and uploaded documents go in private storage with short-lived access links.
- Certificates, document contents and personal details are never sent to TinyFish.
- Sensitive profile fields are optional, and a missing answer is treated as unknown, never as a failed requirement.
- Users can edit, export and delete their data.
- This is a student project. Get a professional review of applicable Indian data-protection obligations before any public launch.

## Roadmap

- [ ] Project setup, database schema, authentication
- [ ] Landing page and scholarship discovery with demo data
- [ ] Explainable eligibility engine
- [ ] TinyFish Search and Fetch integration with verification rules
- [ ] Student onboarding, dashboard and application tracker
- [ ] Saved scholarships and comparison
- [ ] Notifications and email reminders
- [ ] Document vault
- [ ] Admin dashboard
- [ ] Tests, accessibility and deployment

## Contributing

1. Create a branch from `main`, for example `feature/discovery-page`.
2. Commit small, clear changes.
3. Open a pull request and get one review before merging.
4. Never commit secrets or real student data.

To report an incorrect scholarship listing, use the "Report incorrect information" button in the app once it is available, or open an issue.

## Team Ascend

| Name | GitHub |
| --- | --- |
| Dev Kaushik | [@dev-2501730247](https://github.com/dev-2501730247) |
| Aryan Giri | [@giri2005sonu-eng](https://github.com/giri2005sonu-eng) |
 