# Apply Start (No Auth) — Design Spec

Date: 2026-04-23  
Project: Business License portal

## Goal

Remove authentication from the public-facing entry flow and replace it with a simple “start application” step that captures minimal contact details for follow-up, then continues into the existing multi-step wizard.

## Non-goals

- Building a full outreach/CRM system
- Persisting sensitive applicant information server-side (SSN, DL number, DOB, etc.)
- Requiring account creation to start or finish an application

## User experience

### Landing page (`/`)

- No auth UI (no Login/Register links or buttons).
- Primary CTA: **Register a new business license** → navigates to `/apply/start`.

### Start page (`/apply/start`) — NEW

Collect:
- **Full name** (required)
- **Email** (optional)
- **Phone** (optional)
- Validation rule: **email OR phone must be provided**

Content:
- Short note: “We’ll use this to follow up if you don’t finish.”
- Optional consent checkbox copy (exact text TBD, but recommended if outreach is planned).

Submit behavior:
- Create a `draftId`
- Save start-page fields into the local draft immediately
- POST a sanitized “lead snapshot” to `POST /api/drafts`
- Redirect to `/apply?draft=<draftId>`

### Application wizard (`/apply`)

- Stays publicly accessible (no auth guard).
- Continues autosaving to local draft + throttled POST to `/api/drafts` (sanitized).
- “Save & exit” routes to `/apply/resume?draft=<draftId>`.

## Data model

### Local draft

Stored in `localStorage` under existing key scheme:
- `bl_wizard_draft_v2:<draftId>` contains full draft (including potentially sensitive fields because it mirrors form state) **on-device only**.

### Server-side lead snapshot (sanitized)

`POST /api/drafts` stores a constrained subset for follow-up:
- `draftId`, `step`, `updatedAt`
- Start page fields: `fullName`, `contactEmail`, `contactPhone`
- Wizard safe fields already included (contact info, owner name/email/phone)
- Explicitly **exclude**: SSN, DL number, DOB, signatures, etc.

Storage is currently file-backed for development:
- `.data/draft-leads.json`

## Security & privacy constraints

- Never persist sensitive fields server-side.
- Treat `.data/draft-leads.json` as environment-specific (dev-only) unless replaced by a proper datastore with access controls.

## Implementation checklist (high level)

- Update landing components to remove auth links and change CTA to `/apply/start`.
- Add `/apply/start` page with validation (email OR phone).
- Extend wizard draft schema/lead payload to include start-page `fullName` and phone/email if needed.
- Ensure Next build passes (Suspense boundary for `useSearchParams` where used).

## Acceptance criteria

- Landing page shows only “Register a new business license” CTA (no auth prompts).
- `/apply/start` blocks submission unless full name + (email OR phone) provided.
- After submit, user lands in `/apply` wizard with the created draft id.
- Draft autosaves and can be resumed on the same device/browser.
- Lead snapshots are created/updated server-side to enable outreach without signup.

