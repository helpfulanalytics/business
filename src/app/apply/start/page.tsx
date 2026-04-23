"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "../../components/AppHeader";
import { defaultFormData } from "../../components/apply/types";

const LS_LAST_DRAFT_ID = "bl_wizard_last_draft_id";
const LS_DRAFT_PREFIX = "bl_wizard_draft_v2:";

function getDraftKey(id: string) {
  return `${LS_DRAFT_PREFIX}${id}`;
}

function safeRandomId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `draft_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function ApplyStartPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errors = useMemo(() => {
    const e: { fullName?: string; email?: string } = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!email.trim()) e.email = "Email address is required.";
    return e;
  }, [fullName, email]);

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    setSubmitting(true);
    const draftId = safeRandomId();

    const data = defaultFormData();
    data.contactName = fullName.trim();
    data.contactEmail = email.trim();
    data.contactPhone = phone.trim();

    const draft = {
      id: draftId,
      step: 1,
      updatedAt: new Date().toISOString(),
      data,
    };

    try {
      localStorage.setItem(getDraftKey(draftId), JSON.stringify(draft));
      localStorage.setItem(LS_LAST_DRAFT_ID, draftId);
    } catch {
      // ignore
    }

    try {
      await fetch("/api/drafts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: draftId,
          step: 1,
          updatedAt: draft.updatedAt,
          fullName: fullName.trim(),
          contactEmail: email.trim(),
          contactPhone: phone.trim(),
          contactName: fullName.trim(),
        }),
      });
    } catch {
      // ignore
    }

    router.push(`/apply?draft=${encodeURIComponent(draftId)}`);
  }

  return (
    <div className="interior-page">
      <AppHeader />
      <div style={{ flex: 1, padding: "1.75rem 1rem 3rem", background: "var(--page-bg)" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div className="page-card" style={{ padding: "1.5rem" }}>
            <div className="section-header" style={{ marginTop: 0 }}>Start your application</div>
            <h1 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 650, color: "var(--ink)", letterSpacing: "-0.01em" }}>
              Add your details to continue
            </h1>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.92rem", color: "var(--ink-2)", lineHeight: 1.55, marginTop: "0.75rem" }}>
              We’ll use this to follow up if you don’t finish. You don’t need an account to apply.
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: "1.25rem", display: "grid", gap: "1rem" }}>
              <div>
                <label className="form-label" htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  className="form-input"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onBlur={() => setTouched(true)}
                  autoComplete="name"
                />
                {touched && errors.fullName && (
                  <div style={{ marginTop: "0.4rem", fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--error)" }}>
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                <div>
                  <label className="form-label" htmlFor="email">Email</label>
                  <input
                    id="email"
                    className="form-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    autoComplete="email"
                    inputMode="email"
                    required
                  />
                {touched && errors.email && (
                  <div style={{ marginTop: "0.4rem", fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--error)" }}>
                    {errors.email}
                  </div>
                )}
                </div>

                <div>
                  <label className="form-label" htmlFor="phone">Phone number <span style={{ fontWeight: 400, color: "var(--ink-2)" }}>(optional)</span></label>
                  <input
                    id="phone"
                    className="form-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    onBlur={() => setTouched(true)}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>


              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                <button type="submit" className="btn-primary" disabled={!canSubmit} style={{ padding: "0.75rem 1rem" }}>
                  {submitting ? "Continuing…" : "Continue"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => router.push("/")} style={{ padding: "0.75rem 1rem" }}>
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

