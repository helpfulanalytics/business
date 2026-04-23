# Apply Start (No Auth) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove auth UI from the landing experience and add a `/apply/start` page that collects name + (email OR phone), creates a draft, then continues into the application wizard.

**Architecture:** Public flow becomes `/` → `/apply/start` → `/apply?draft=<id>` with draft autosave already implemented. `/api/drafts` continues to receive throttled, sanitized lead snapshots for outreach. Auth remains only for internal pages like `/dashboard`.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind/CSS tokens, localStorage, Next Route Handler (`src/app/api/*/route.ts`).

---

## File map (planned changes)

- Create: `src/app/apply/start/page.tsx` (start form + validation + redirect)
- Modify: `src/app/components/HeroSection.tsx` (CTA → `/apply/start`, remove auth CTAs)
- Modify: `src/app/components/AppHeader.tsx` (remove login/register UI in public header)
- Modify (if needed): `src/app/apply/page.tsx` (ensure draft can accept start-page fields; may already be ok)
- Modify: `src/app/api/drafts/route.ts` (extend lead schema to include start-page `fullName` and start-page contact values if not already covered)
- Verify: `npm run build`

---

### Task 1: Remove auth UI from landing CTA

**Files:**
- Modify: `src/app/components/HeroSection.tsx`

- [ ] **Step 1: Update the primary CTA**
  - Replace any `/login` or `/login?tab=register` CTAs with a single primary CTA:
    - Label: `Register a new business license`
    - Href: `/apply/start`

- [ ] **Step 2: Remove other auth-only buttons/links on landing**
  - Remove or hide any “Sign in”, “Create account”, “Login” UI elements on the landing hero.

- [ ] **Step 3: Verify locally**
  - Run: `npm run build`
  - Expected: build succeeds; no links to `/login` from landing hero.

---

### Task 2: Remove auth UI from header

**Files:**
- Modify: `src/app/components/AppHeader.tsx`

- [ ] **Step 1: Remove header login/register controls**
  - Ensure the header doesn’t show auth prompts on public pages.
  - Keep internal navigation for authenticated users on `/dashboard` only, if present.

- [ ] **Step 2: Verify locally**
  - Run: `npm run build`
  - Expected: build succeeds; header on `/` does not show auth CTA.

---

### Task 3: Add `/apply/start` page (name + email OR phone)

**Files:**
- Create: `src/app/apply/start/page.tsx`

- [ ] **Step 1: Implement start form UI**
  - Fields:
    - `fullName` (required)
    - `email` (optional)
    - `phone` (optional)
  - Validation:
    - `fullName` required
    - require at least one of `email` or `phone`

- [ ] **Step 2: On submit, create draft and persist**
  - Create or reuse a `draftId` (use same id generation approach as `/apply` uses).
  - Write an initial local draft under `bl_wizard_draft_v2:<draftId>`:
    - Update wizard fields that map to contact info (at minimum):
      - `contactName` ← `fullName`
      - `contactEmail` ← `email` (if provided)
      - `contactPhone` ← `phone` (if provided)
  - Redirect to `/apply?draft=<draftId>`.

- [ ] **Step 3: Post sanitized lead snapshot**
  - POST to `/api/drafts` with:
    - `id`, `step: 1`, `updatedAt`
    - `fullName`, `contactEmail`, `contactPhone` (if the API supports `fullName`; add in Task 4 if not)

- [ ] **Step 4: Verify locally**
  - Run: `npm run build`
  - Expected: build succeeds; `/apply/start` renders and redirects on submit.

---

### Task 4: Extend `/api/drafts` lead schema to include `fullName`

**Files:**
- Modify: `src/app/api/drafts/route.ts`

- [ ] **Step 1: Add `fullName?: string` to the stored lead**
  - Ensure it’s sanitized and string-coerced like other fields.

- [ ] **Step 2: Keep backward compatibility**
  - If older payloads omit `fullName`, store empty string.

- [ ] **Step 3: Verify locally**
  - Run: `npm run build`
  - Expected: build succeeds; POST accepts payloads with/without `fullName`.

---

### Task 5: Final verification

**Files:**
- Verify: all above

- [ ] **Step 1: Search for remaining `/login` links in landing/header**
  - Ensure they are only present where intended (e.g., internal pages or removed entirely per requirement).

- [ ] **Step 2: Production build**
  - Run: `npm run build`
  - Expected: PASS

