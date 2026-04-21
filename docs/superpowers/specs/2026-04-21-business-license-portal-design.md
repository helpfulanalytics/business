# City of Mobile — Business License Portal

**Date:** 2026-04-21
**Status:** Approved

---

## Overview

A Next.js web portal for residents of Mobile, Alabama to apply for new business licenses online. The landing page is a cinematic video hero establishing civic identity; all interior pages use a clean, light government style. Auth is simulated client-side (no backend required for this build).

---

## Design System

### Two Visual Modes

**Public (Landing page only)**
- Full-screen video background, no overlay
- Liquid glass navbar and cards
- Inter font, white text on black
- Unchanged from current HeroSection structure

**Authenticated (All interior pages)**
- Background: `#f0f4f8` light gray page, `#ffffff` white cards
- Primary: `#0066cc` blue (buttons, links, active states)
- Header/nav: `#1e3a5f` navy
- Text: `#111827` dark gray body, `#6b7280` secondary
- Borders: `#e5e7eb`
- Font: Inter (already loaded globally)
- Accessible, WCAG AA contrast throughout

### Shared Components (Interior)
- `AppHeader` — navy top bar with City of Mobile wordmark + user name + "Sign Out" link. Present on all interior pages.
- `PageCard` — white card with `border-radius: 8px`, `box-shadow: 0 1px 4px rgba(0,0,0,0.08)`, `padding: 32px`
- Form fields — white fill, `#e5e7eb` border, `#0066cc` focus ring, `border-radius: 6px`
- Primary button — `#0066cc` bg, white text, hover `#0052a3`
- Secondary button — white bg, `#0066cc` border and text

---

## Pages

### `/` — Landing Page
**Changes from current build:**
- Logo: "VEX" → City of Mobile seal (text wordmark: "City of Mobile" in two lines, "Alabama" smaller below)
- Headline: "Mobile's Official Business License Portal"
- Subheadline: "Apply for your business license online — fast, secure, and paperless."
- Nav links: Home · How It Works · Contact
- Primary CTA button: "Sign In" → navigates to `/login`
- Secondary CTA button: "Create Account" → navigates to `/login?tab=register`
- Tag pill (bottom right): "Secure · Official · Paperless"
- Everything else (video, liquid glass, animations, layout) unchanged

### `/login`
**Layout:** Centered card on `#f0f4f8` full-page background. Navy `AppHeader` at top.

**Card contents:**
- City of Mobile seal/wordmark at top of card
- Tab switcher: "Sign In" | "Create Account"
- Sign In tab: email field, password field, "Forgot password?" text link, "Sign In" primary button
- Create Account tab: full name field, email field, password field, confirm password field, "Create Account" primary button
- On submit (either tab): store mock session in localStorage, redirect to `/dashboard`
- No real validation beyond required fields — this is a frontend demo

### `/dashboard`
**Layout:** `AppHeader` (navy) + full-width light gray page + centered max-width content area.

**Sidebar (desktop ≥1024px):** Fixed left nav — Dashboard, New Application, Contact. Active state: `#0066cc` left border + light blue bg.

**Main content:**
- Welcome banner: "Welcome back, [Name]" in `h1`, "City of Mobile Business License Portal" subtitle
- "Start New Application" card: prominent `PageCard` with icon, short description ("Apply for a new City of Mobile business license. The process takes approximately 10–15 minutes."), "Begin Application" primary button → `/apply`
- "Your Applications" section: table with columns Application #, Business Name, Date Submitted, Status. Empty state: illustration + "No applications yet" + "Start your first application" link

### `/apply`
**Layout:** `AppHeader` + `#f0f4f8` background + centered max-width content. No sidebar — the full width is used for the wizard. Progress bar sits above the form card.

**Progress bar:** 4 steps, horizontal, full-width above the `PageCard`. Each step shows: number + label. States: completed (filled blue + checkmark), active (blue border), incomplete (gray).

**Step 1 — Business Information**
Fields: Business Legal Name*, DBA/Trade Name, Business Street Address*, City*, State* (pre-filled "Alabama"), ZIP*, Business Entity Type* (dropdown: Sole Proprietor, LLC, Corporation, Partnership, Non-Profit), Business Start Date*, Square Footage of Location*

**Step 2 — Owner & Contact**
Fields: Owner Full Name*, Owner Email*, Owner Phone*, Mailing Address (if different from business) — Street, City, State, ZIP

**Step 3 — Legal & Zoning**
Fields: EIN / Federal Tax ID* (format: XX-XXXXXXX), License Category* (dropdown: Retail, Food Service, Professional Services, Contractor/Construction, Healthcare, Entertainment, Other), Number of Employees* (dropdown: 1, 2–5, 6–10, 11–25, 26–50, 50+), Zoning District* (text), Zoning Confirmation* (checkbox: "I confirm this location is properly zoned for the described business activity"), Notarized Acknowledgment* (checkbox: "I certify under penalty of law that all information provided is true and accurate to the best of my knowledge")

**Step 4 — Review & Submit**
- Read-only summary of all fields, grouped by step (Business Info / Owner & Contact / Legal & Zoning)
- Each group has an "Edit" link that jumps back to that step
- "Submit Application" primary button — on click: generate reference number (`MOB-2026-` + 5 random digits, e.g. `MOB-2026-04821`), store in localStorage, redirect to `/apply/confirmation`
- "Save & Exit" secondary button → `/dashboard`

**Validation:** Required fields (*) block "Next" until filled. No backend validation — client-side only.

### `/apply/confirmation`
**Layout:** Centered `PageCard` on light background. No sidebar.

**Contents:**
- Large green checkmark icon
- "Application Submitted" heading
- Reference number displayed prominently: `MOB-2026-XXXXX`
- "Estimated review time: 5–7 business days"
- "What happens next" — 3 steps:
  1. City staff will review your application
  2. You'll receive an email with any questions or approval
  3. Once approved, your license will be mailed to your business address
- "Return to Dashboard" primary button → `/dashboard`

---

## Routing & Auth

- Auth state stored in `localStorage` as `{ name, email, loggedIn: true }`
- `AuthContext` (React context) reads/writes this state, exposes `login()`, `logout()`, `user`
- Protected routes (`/dashboard`, `/apply`, `/apply/confirmation`): redirect to `/login` if no auth session
- `/login` redirects to `/dashboard` if already logged in
- Application wizard state stored in React state (lost on refresh — acceptable for demo)

---

## File Structure

```
src/
  app/
    page.tsx                        # Landing — imports HeroSection
    login/
      page.tsx                      # Login page (client component)
    dashboard/
      page.tsx                      # Dashboard (client, protected)
    apply/
      page.tsx                      # Wizard (client, protected)
      confirmation/
        page.tsx                    # Confirmation (client, protected)
    components/
      HeroSection.tsx               # Existing — copy/text updates only
      AppHeader.tsx                 # Shared interior nav
      AuthContext.tsx               # Auth provider + hook
      ProtectedRoute.tsx            # Redirect wrapper
      apply/
        StepBusinessInfo.tsx
        StepOwnerContact.tsx
        StepLegalZoning.tsx
        StepReview.tsx
        ProgressBar.tsx
    globals.css                     # Existing — no changes needed
    layout.tsx                      # Existing — wrap with AuthProvider
```

---

## Out of Scope

- Real authentication (no backend, no API calls)
- Email sending or confirmation emails
- File/document uploads
- Payment processing
- PDF license generation
- Admin portal
- Accessibility audit (WCAG AA target but not audited)
