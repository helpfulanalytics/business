import { Owner, StepProps, defaultOwner } from "./types";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";

const FORM_A_DOCS = [
  "Alabama Driver's License","Alabama Identification Card","Birth Certificate (U.S.)","U.S. Passport or Passport Card",
  "Certificate of Naturalization","Certificate of U.S. Citizenship","U.S. Military ID Card","U.S. Military Dependent ID Card",
  "U.S. Coast Guard Merchant Mariner Card","Native American Tribal Document","Driver's License from U.S. Territory",
  "Government Employee ID Card","School ID with Photo (minor only)","Voter Registration Card","Medicaid Card",
  "Other Federal, State, or Local Government Document with Name and Photo",
];
const FORM_B_DOCS = ["Valid Alabama Driver's License","Alabama Non-Driver ID","Tribal ID","Government-issued ID","Foreign Passport with U.S. Visa","Visa Waiver Passport"];

function Req() { return <span style={{ color: "var(--error)", marginLeft: "2px" }}>*</span>; }

function YesNoChoice({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {["Yes", "No"].map(opt => (
        <label key={opt} className="choice-card" style={{ flex: 1, justifyContent: "center", cursor: "pointer" }}>
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)} style={{ display: "none" }} />
          <span style={{ fontSize: "0.875rem", fontWeight: value === opt ? 600 : 400, color: value === opt ? "var(--primary)" : "var(--ink-2)", textAlign: "center", width: "100%" }}>{opt}</span>
        </label>
      ))}
    </div>
  );
}

function OwnerCard({ owner, index, onOwnerChange, canRemove, onRemove }: {
  owner: Owner; index: number;
  onOwnerChange: (idx: number, field: keyof Owner, value: string) => void;
  canRemove: boolean; onRemove: (idx: number) => void;
}) {
  return (
    <div style={{ border: "1.5px solid var(--border)", borderRadius: "8px", overflow: "hidden", marginBottom: "1rem" }}>
      {/* Owner card header */}
      <div style={{ padding: "0.75rem 1.25rem", background: "#f8f9fb", borderBottom: "1px solid var(--border-lt)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{index + 1}</span>
          <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)" }}>Owner / Officer #{index + 1}</span>
        </div>
        {canRemove && <button type="button" onClick={() => onRemove(index)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--error)", fontFamily: "var(--font-ui)" }}>Remove</button>}
      </div>

      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <div>
            <label className="form-label">Full Name (Last, First, MI, Suffix)<Req /></label>
            <input type="text" className="form-input" value={owner.fullName} onChange={e => onOwnerChange(index, "fullName", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Title<Req /></label>
            <input type="text" className="form-input" value={owner.title} onChange={e => onOwnerChange(index, "title", e.target.value)} />
          </div>
          <div>
            <label className="form-label">SSN<Req /></label>
            <input type="password" className="form-input" placeholder="XXX-XX-XXXX" autoComplete="off" value={owner.ssn} onChange={e => onOwnerChange(index, "ssn", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Date of Birth<Req /></label>
            <input type="date" className="form-input" value={owner.dob} onChange={e => onOwnerChange(index, "dob", e.target.value)} />
          </div>
          <div>
            <label className="form-label">DL State<Req /></label>
            <input type="text" className="form-input" placeholder="AL" maxLength={2} value={owner.dlState} onChange={e => onOwnerChange(index, "dlState", e.target.value.toUpperCase())} />
          </div>
          <div>
            <label className="form-label">DL Number<Req /></label>
            <input type="text" className="form-input" value={owner.dlNumber} onChange={e => onOwnerChange(index, "dlNumber", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Phone<Req /></label>
            <input type="tel" className="form-input" value={owner.phone} onChange={e => onOwnerChange(index, "phone", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Email<Req /></label>
            <input type="email" className="form-input" value={owner.email} onChange={e => onOwnerChange(index, "email", e.target.value)} />
          </div>
        </div>

        <div>
          <label className="form-label">Home Street Address<Req /></label>
          <input type="text" className="form-input" style={{ marginBottom: "0.5rem" }} value={owner.streetAddress} onChange={e => onOwnerChange(index, "streetAddress", e.target.value)} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 100px", gap: "0.5rem" }}>
            <div><label className="form-label">City<Req /></label><input type="text" className="form-input" value={owner.city} onChange={e => onOwnerChange(index, "city", e.target.value)} /></div>
            <div><label className="form-label">State<Req /></label><input type="text" className="form-input" value={owner.state} onChange={e => onOwnerChange(index, "state", e.target.value)} /></div>
            <div><label className="form-label">ZIP<Req /></label><input type="text" className="form-input" value={owner.zip} onChange={e => onOwnerChange(index, "zip", e.target.value)} /></div>
          </div>
        </div>

        {/* Citizenship */}
        <div>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.11em", color: "var(--muted-foreground)", fontWeight: 700, marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ display: "inline-block", width: 12, height: 2, background: "var(--amber)", borderRadius: 2 }} />
            Citizenship Form<Req />
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label className="choice-card">
              <input type="radio" checked={owner.citizenshipForm === "A"} onChange={() => onOwnerChange(index, "citizenshipForm", "A")} />
              <span><strong>Form A</strong> — I am a U.S. Citizen</span>
            </label>
            <label className="choice-card">
              <input type="radio" checked={owner.citizenshipForm === "B"} onChange={() => onOwnerChange(index, "citizenshipForm", "B")} />
              <span><strong>Form B</strong> — I am a lawfully present non-U.S. citizen</span>
            </label>
          </div>
        </div>

        {owner.citizenshipForm === "A" && (
          <div style={{ padding: "1rem", borderRadius: "6px", background: "#f0f9ff", border: "1px solid #bae6fd", borderLeft: "3px solid #0284c7" }}>
            <p style={{ fontFamily: "var(--font-display), serif", fontSize: "0.875rem", fontWeight: 600, color: "#0c4a6e", marginBottom: "0.75rem" }}>U.S. Citizenship Declaration — Form A</p>
            <div style={{ marginBottom: "0.75rem" }}>
              <label className="form-label">Document Type<Req /></label>
              <select className="form-input" value={owner.formADocType} onChange={e => onOwnerChange(index, "formADocType", e.target.value)}>
                <option value="">Select…</option>
                {FORM_A_DOCS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", fontStyle: "italic", color: "#374151", padding: "0.625rem", background: "#fff", borderRadius: "4px", border: "1px solid #e0f2fe", marginBottom: "0.75rem", lineHeight: 1.5 }}>
              "Under penalty of perjury, I declare that I am a citizen of the United States of America."
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
              <div><label className="form-label">Signature (typed full name)<Req /></label><input type="text" className="form-input" value={owner.formASignature} onChange={e => onOwnerChange(index, "formASignature", e.target.value)} /></div>
              <div><label className="form-label">Date<Req /></label><input type="date" className="form-input" value={owner.formADate} onChange={e => onOwnerChange(index, "formADate", e.target.value)} /></div>
            </div>
          </div>
        )}

        {owner.citizenshipForm === "B" && (
          <div style={{ padding: "1rem", borderRadius: "6px", background: "#fffbeb", border: "1px solid #fde68a", borderLeft: "3px solid #d97706" }}>
            <p style={{ fontFamily: "var(--font-display), serif", fontSize: "0.875rem", fontWeight: 600, color: "#78350f", marginBottom: "0.75rem" }}>Lawful Alien Declaration — Form B</p>
            <div style={{ marginBottom: "0.75rem" }}>
              <label className="form-label">Alien Registration Number (A-Number)<Req /></label>
              <input type="text" className="form-input" placeholder="A + 8–9 digits" value={owner.aNumber} onChange={e => onOwnerChange(index, "aNumber", e.target.value)} />
            </div>
            <div style={{ marginBottom: "0.75rem" }}>
              <label className="form-label">Document Type<Req /></label>
              <select className="form-input" value={owner.formBDocType} onChange={e => onOwnerChange(index, "formBDocType", e.target.value)}>
                <option value="">Select…</option>
                {FORM_B_DOCS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", fontStyle: "italic", color: "#374151", padding: "0.625rem", background: "#fff", borderRadius: "4px", border: "1px solid #fde68a", marginBottom: "0.75rem", lineHeight: 1.5 }}>
              "Under penalty of perjury, I declare that I am a lawfully present alien of the United States of America."
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "0.625rem" }}>
              <div><label className="form-label">Signature (typed full name)<Req /></label><input type="text" className="form-input" value={owner.formBSignature} onChange={e => onOwnerChange(index, "formBSignature", e.target.value)} /></div>
              <div><label className="form-label">Date<Req /></label><input type="date" className="form-input" value={owner.formBDate} onChange={e => onOwnerChange(index, "formBDate", e.target.value)} /></div>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", padding: "0.5rem 0.75rem", background: "#fff7ed", borderRadius: "4px", color: "#9a3412", border: "1px solid #fed7aa" }}>
              Your status will be verified through the SAVE Program. A temporary license may be issued pending final verification.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StepOwnerInfo({ data, onChange, onNext, onBack, onSaveExit }: StepProps) {
  const [error, setError] = useState<string | null>(null);

  function handleOwnerChange(idx: number, field: keyof Owner, value: string) {
    onChange("owners", data.owners.map((o, i) => i === idx ? { ...o, [field]: value } : o));
  }
  function addOwner() { onChange("owners", [...data.owners, defaultOwner()]); }
  function removeOwner(idx: number) { onChange("owners", data.owners.filter((_, i) => i !== idx)); }
  function addRelated() { onChange("relatedBusinesses", [...data.relatedBusinesses, { ownerName: "", businessName: "", businessAddress: "" }]); }
  function updateRelated(idx: number, field: string, value: string) {
    onChange("relatedBusinesses", data.relatedBusinesses.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }
  function removeRelated(idx: number) { onChange("relatedBusinesses", data.relatedBusinesses.filter((_, i) => i !== idx)); }

  function validate() {
    for (let i = 0; i < data.owners.length; i++) {
      const o = data.owners[i];
      if (!o.fullName.trim() || !o.title.trim() || !o.ssn.trim() || !o.dlState.trim() || !o.dlNumber.trim() || !o.phone.trim() || !o.email.trim() || !o.streetAddress.trim() || !o.city.trim() || !o.state.trim() || !o.zip.trim() || !o.dob) {
        setError(`Complete all required fields for Owner #${i + 1}.`); return;
      }
      if (!o.citizenshipForm) { setError(`Select a Citizenship Form for Owner #${i + 1}.`); return; }
      if (o.citizenshipForm === "A" && (!o.formADocType || !o.formASignature.trim() || !o.formADate)) { setError(`Complete Citizenship Form A for Owner #${i + 1}.`); return; }
      if (o.citizenshipForm === "B" && (!o.aNumber.trim() || !o.formBDocType || !o.formBSignature.trim() || !o.formBDate)) { setError(`Complete Citizenship Form B for Owner #${i + 1}.`); return; }
    }
    if (!data.hasRelatedBusiness) { setError("Please answer the related business interests question."); return; }
    setError(null);
    onNext();
  }

  return (
    <div style={{ background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--border-lt)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
      <div style={{ padding: "1.5rem 2rem 1.25rem", borderBottom: "1px solid var(--border-lt)", background: "linear-gradient(to bottom, #fff, #fafbfc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
          <span style={{ width: 24, height: 24, borderRadius: "6px", background: "#eff6ff", border: "1px solid #c0d8ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>3</span>
          <h2 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>Owner &amp; Officer Information</h2>
        </div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--muted-foreground)", marginLeft: "30px" }}>One section per owner, officer, or partner. All must complete a citizenship form.</p>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>
        <div style={{ padding: "0.75rem 1rem", borderRadius: "6px", background: "#eff6ff", border: "1px solid #c0d8ef", marginBottom: "1.25rem", fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "#1e40af", lineHeight: 1.5 }}>
          Complete one section per owner, officer, or partner. All listed individuals must also complete a citizenship form (Form A or Form B).
        </div>

        {data.owners.map((owner, idx) => (
          <OwnerCard key={idx} owner={owner} index={idx} onOwnerChange={handleOwnerChange} canRemove={data.owners.length > 1} onRemove={removeOwner} />
        ))}

        <button type="button" onClick={addOwner} className="btn-secondary" style={{ marginBottom: "1.5rem" }}>
          + Add Another Owner
        </button>

        <div className="section-header">Related Business Interests</div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--ink-2)", marginBottom: "0.625rem", lineHeight: 1.5 }}>
          Do any owners/officers own or have membership in any other business within City Limits or Police Jurisdiction?
        </p>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {["Yes", "No"].map(opt => (
            <label key={opt} className="choice-card" style={{ flex: 1, justifyContent: "center" }}>
              <input type="radio" checked={data.hasRelatedBusiness === opt} onChange={() => onChange("hasRelatedBusiness", opt)} style={{ display: "none" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: data.hasRelatedBusiness === opt ? 600 : 400, color: data.hasRelatedBusiness === opt ? "var(--primary)" : "var(--ink-2)", textAlign: "center", width: "100%" }}>{opt}</span>
            </label>
          ))}
        </div>

        {data.hasRelatedBusiness === "Yes" && (
          <div>
            {data.relatedBusinesses.map((rb, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "end" }}>
                <div><label className="form-label">Owner Name</label><input type="text" className="form-input" value={rb.ownerName} onChange={e => updateRelated(idx, "ownerName", e.target.value)} /></div>
                <div><label className="form-label">Business Name</label><input type="text" className="form-input" value={rb.businessName} onChange={e => updateRelated(idx, "businessName", e.target.value)} /></div>
                <div><label className="form-label">Business Address</label><input type="text" className="form-input" value={rb.businessAddress} onChange={e => updateRelated(idx, "businessAddress", e.target.value)} /></div>
                <button type="button" onClick={() => removeRelated(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--error)", fontSize: "1rem", padding: "0.5rem", height: "36px", alignSelf: "end" }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={addRelated} className="btn-secondary">+ Add Related Business</button>
          </div>
        )}

        <div className="step-footer">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
            <button type="button" onClick={onSaveExit} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--muted-foreground)", padding: "0.375rem 0" }}>Save &amp; Exit</button>
          </div>
          <button type="button" onClick={validate} className="btn-primary" style={{ padding: "0.625rem 1.75rem" }}>Continue →</button>
        </div>

        {error && (
          <div style={{ marginTop: "1rem" }}>
            <Alert variant="warning">
              <AlertTitle>Please fix this</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
