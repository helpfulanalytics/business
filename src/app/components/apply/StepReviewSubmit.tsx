import { StepProps } from "./types";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";

function Row({ label, value }: { label: string; value: string | boolean | string[] | undefined }) {
  if (value === undefined || value === null || value === "") return null;
  let display: string;
  if (Array.isArray(value)) { if (value.length === 0) return null; display = value.join(", "); }
  else if (typeof value === "boolean") { display = value ? "Yes" : "No"; }
  else { display = String(value); }
  if (!display.trim()) return null;
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "0.4rem 0", borderBottom: "1px solid var(--border-lt)", fontFamily: "var(--font-ui)", fontSize: "0.825rem" }}>
      <span style={{ width: "10rem", flexShrink: 0, color: "var(--muted)", letterSpacing: "0.01em" }}>{label}</span>
      <span style={{ color: "var(--ink)", flex: 1 }}>{display}</span>
    </div>
  );
}

function SectionBlock({ title, step, onEdit, children }: { title: string; step: number; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem", paddingBottom: "0.5rem", borderBottom: "2px solid var(--border-lt)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ width: 20, height: 20, borderRadius: "4px", background: "var(--primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700, color: "#fff" }}>{step}</span>
          <span className="font-display" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{title}</span>
        </div>
        <button type="button" onClick={onEdit} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--primary)", letterSpacing: "0.02em", textDecoration: "underline", textUnderlineOffset: "2px" }}>Edit</button>
      </div>
      {children}
    </div>
  );
}

export default function StepReviewSubmit({ data, onChange, onNext, onBack, onSaveExit, goToStep }: StepProps) {
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!data.printedName.trim() || !data.printedTitle.trim()) { setError("Please enter your printed name and title."); return; }
    if (!data.signature.trim()) { setError("Please enter your signature."); return; }
    if (!data.certDate) { setError("Please enter the certification date."); return; }
    if (!data.understand60Day) { setError("Please acknowledge the 60-Day Affidavit requirement."); return; }
    if (!data.understandExpiry) { setError("Please acknowledge the license expiry requirement."); return; }
    setError(null);
    onNext();
  }

  return (
    <div style={{ background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--border-lt)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
      <div style={{ padding: "1.5rem 2rem 1.25rem", borderBottom: "1px solid var(--border-lt)", background: "linear-gradient(to bottom, #fff, #fafbfc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
          <span style={{ width: 24, height: 24, borderRadius: "6px", background: "#eff6ff", border: "1px solid #c0d8ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>6</span>
          <h2 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>Review &amp; Submit</h2>
        </div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--muted)", marginLeft: "30px" }}>Review your application, sign, and submit.</p>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>

        {/* Summary sections */}
        <SectionBlock title="Application Setup" step={1} onEdit={() => goToStep?.(1)}>
          <Row label="Type" value={data.applicationType === "Other" ? `Other: ${data.applicationTypeOther}` : data.applicationType} />
          <Row label="Operated From" value={data.businessOperatedFrom} />
          <Row label="Business Types" value={data.businessTypes} />
          <Row label="Description" value={data.detailedExplanation?.slice(0, 120) + (data.detailedExplanation?.length > 120 ? "…" : "")} />
        </SectionBlock>

        <SectionBlock title="Business Information" step={2} onEdit={() => goToStep?.(2)}>
          <Row label="Legal Name" value={data.businessLegalName} />
          <Row label="Trade Name" value={data.tradeName} />
          <Row label="Structure" value={data.businessStructure === "Other" ? `Other: ${data.businessStructureOther}` : data.businessStructure} />
          <Row label="Start Date" value={data.startDate} />
          <Row label="Physical Loc." value={data.physicalLocation} />
          <Row label="Address" value={[data.physStreet, data.physSuite, data.physCity, data.physState, data.physZip].filter(Boolean).join(", ")} />
          <Row label="Employees" value={data.numEmployees} />
          <Row label="Contact" value={`${data.contactName} — ${data.contactPhone}`} />
        </SectionBlock>

        <SectionBlock title="Owner &amp; Officer Info" step={3} onEdit={() => goToStep?.(3)}>
          {data.owners.map((o, i) => (
            <div key={i}>
              <Row label={`Owner #${i + 1}`} value={`${o.fullName} — Form ${o.citizenshipForm || "?"}`} />
            </div>
          ))}
          <Row label="Related Business" value={data.hasRelatedBusiness} />
        </SectionBlock>

        <SectionBlock title="Property &amp; Tax" step={4} onEdit={() => goToStep?.(4)}>
          <Row label="Ownership" value={data.propertyOwnership} />
          {data.propertyOwnership === "I rent / lease the property" && <Row label="Prop. Owner" value={data.propOwnerName} />}
          <Row label="Tax Types" value={data.taxTypes} />
          <Row label="Filing Freq." value={data.taxFrequency} />
        </SectionBlock>

        <SectionBlock title="Documents" step={5} onEdit={() => goToStep?.(5)}>
          <Row label="Acknowledged" value={data.documentsAcknowledged} />
        </SectionBlock>

        {/* Certification */}
        <div style={{ margin: "1.5rem 0", padding: "1.25rem", borderRadius: "8px", background: "#f8f9fb", border: "1px solid var(--border)" }}>
          <p className="font-display" style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.625rem" }}>Certification Statement</p>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", fontStyle: "italic", color: "#374151", lineHeight: 1.65 }}>
            "By signing this application, you certify that all information and statements provided herein are true and correct. You also certify, under penalty of perjury, that you are a US Citizen or lawfully present in the US. In addition, by signing below, you acknowledge and understand that you cannot operate this business in the City of Mobile and/or its Police Jurisdiction until this business license application is approved and a business license issued."
          </p>
        </div>

        {/* Signature fields */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1rem" }}>
          <div>
            <label className="form-label" htmlFor="print-name">Printed Name <span style={{ color: "var(--error)" }}>*</span></label>
            <input id="print-name" type="text" className="form-input" value={data.printedName} onChange={e => onChange("printedName", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="print-title">Title <span style={{ color: "var(--error)" }}>*</span></label>
            <input id="print-title" type="text" className="form-input" value={data.printedTitle} onChange={e => onChange("printedTitle", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="signature">Signature (type full name) <span style={{ color: "var(--error)" }}>*</span></label>
            <input id="signature" type="text" className="form-input" style={{ fontStyle: "italic" }} value={data.signature} onChange={e => onChange("signature", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="cert-date">Date <span style={{ color: "var(--error)" }}>*</span></label>
            <input id="cert-date" type="date" className="form-input" value={data.certDate} onChange={e => onChange("certDate", e.target.value)} />
          </div>
        </div>

        {/* Acknowledgment checkboxes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
          <label className="choice-card" style={{ alignItems: "flex-start", gap: "0.75rem", borderColor: data.understand60Day ? "var(--primary)" : "var(--border)", background: data.understand60Day ? "#f0f7ff" : "#fff" }}>
            <input type="checkbox" checked={data.understand60Day} onChange={e => onChange("understand60Day", e.target.checked)} style={{ accentColor: "var(--primary)", width: 15, height: 15, marginTop: "2px", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--ink)", lineHeight: 1.5 }}>
              I understand the license may require a 60-Day Affidavit, due 70 days from my business start date. If not returned with payment, I will be considered operating without a license. <span style={{ color: "var(--error)" }}>*</span>
            </span>
          </label>
          <label className="choice-card" style={{ alignItems: "flex-start", gap: "0.75rem", borderColor: data.understandExpiry ? "var(--primary)" : "var(--border)", background: data.understandExpiry ? "#f0f7ff" : "#fff" }}>
            <input type="checkbox" checked={data.understandExpiry} onChange={e => onChange("understandExpiry", e.target.checked)} style={{ accentColor: "var(--primary)", width: 15, height: 15, marginTop: "2px", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--ink)", lineHeight: 1.5 }}>
              I understand all licenses expire December 31st each year and must be renewed by January 31st to avoid penalties and interest. <span style={{ color: "var(--error)" }}>*</span>
            </span>
          </label>
        </div>

        <div className="step-footer">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
            <button type="button" onClick={onSaveExit} className="btn-secondary">Save &amp; Exit</button>
          </div>
          <button type="button" onClick={validate} className="btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.9rem" }}>
            Submit Application →
          </button>
        </div>

        {error && (
          <div style={{ marginTop: "1rem" }}>
            <Alert variant="destructive">
              <AlertTitle>Can’t submit yet</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
