# Job Automation Crew: Supabase + Next.js Rebuild

## Core Spec
- **Stack:** Next.js 15 (App Router), Tailwind CSS v4, Supabase (Auth + DB + RLS), Resend (Email), Trigger.dev (Scheduling).
- **Architecture:** Serverless (Next.js API routes / Supabase Edge Functions).

## UI/UX Requirements
- **Vibe:** Premium SaaS, Dark/Light modes.
- **Layout:** `DashboardShell` w/ fixed `sidebar` (260px) & scrollable `main-panel`.
- **Views:**
  - `Dashboard`: Stats (Sent, Status, Success).
  - `Preferences`: Domains (CSV), 3x Locations, Remote Toggle, Daily Limit.
  - `Jobs`: Search bar + cards (Title, Co, Loc, Salary, Date, Source).
  - `Status`: User state + logs.
- **Components:** Cards (12px radius), Buttons (8px radius, primary/secondary), Lucid Icons.

## Logic & Persistence
- **Profiles:** `profiles` table in Supabase.
- **Job Engine:** Next.js API for searching (JS scraper/API).
- **Automation (Trigger.dev):** 8 AM daily.
  - Logic: Fetch active users > Scrape per preferences > Filter/Sort (Date, Salary) > Slice (Limit) > Resend HTML Email > Log.

## CSS Variables
```css
:root { --bg: #f8fafc; --surface: #ffffff; --border: #e2e8f0; --text: #0f172a; --text-muted: #64748b; --primary: #3b82f6; --success: #22c55e; --warning: #f59e0b; --danger: #ef4444; }
.dark { --bg: #0f172a; --surface: #1e293b; --border: #334155; --text: #f1f5f9; --text-muted: #94a3b8; --primary: #60a5fa; --success: #4ade80; --warning: #fbbf24; --danger: #f87171; }
```

## Env Template
```env
NEXT_PUBLIC_SUPABASE_URL=https://<id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
SUPABASE_SERVICE_ROLE_KEY=<key>
RESEND_API_KEY=re_<key>
EMAIL_FROM=updates@yourdomain.com
TRIGGER_API_KEY=tr_live_<key>
TRIGGER_PROJECT_ID=proj_<key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

