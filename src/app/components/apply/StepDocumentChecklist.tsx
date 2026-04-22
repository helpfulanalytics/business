import { StepProps, WizardFormData } from "./types";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";

interface Doc { label: string; link?: string; linkText?: string; phone?: string; }

function computeDocs(data: WizardFormData): { always: Doc[]; conditional: Doc[] } {
  const always: Doc[] = [
    { label: "Completed License/Tax Application (this form)" },
    { label: "Legible copy of driver's license for each owner/officer listed" },
    { label: "Detailed explanation of business activity" },
    { label: "Completed Citizenship Form A or B for each owner/officer" },
  ];
  const cond: Doc[] = [];
  const types = data.businessTypes || [];
  const struct = data.businessStructure;
  const location = data.physicalLocation;
  const isRenting = data.propertyOwnership === "I rent / lease the property";
  const hasAlcohol = data.alcoholSales === "Yes" || data.cgsAlcohol === "Yes" || data.hotelAlcohol === "Yes";
  const isContractor = types.includes("Contractor — State Certified") || types.includes("Construction — Non-Certified");
  const isManuf = types.includes("Manufacturer");
  const hasFood = data.serveFood === "Yes" || data.cgsServeFood === "Yes" || data.hotelServeFood === "Yes" || types.includes("Food Truck");
  const isCityLimits = location === "City Limits";
  const isCommercial = data.businessOperatedFrom === "Commercial Store Front / Office";

  if (isCityLimits) cond.push({ label: "Zoning Approval Certificate", link: "https://buildmobile.org/zoning-clearance-request", linkText: "buildmobile.org/zoning-clearance-request" });
  if (["Limited Liability Company (LLC)","Corporation","Professional Association"].includes(struct ?? "")) cond.push({ label: "Articles of Organization / Incorporation (all stamped pages)" });
  if (struct && struct !== "Sole Proprietorship") cond.push({ label: "FEIN Letter from IRS" });
  cond.push({ label: "Alabama Department of Revenue Tax ID Letter" });
  if (isRenting) cond.push({ label: "Signed Lease / Rental Agreement" });
  if (isCommercial && isCityLimits) cond.push({ label: "Fire Inspection Report", phone: "251.208.7484" });
  if (hasFood) cond.push({ label: "Mobile County Health Dept. Inspection", phone: "251.690.8158" });
  if (isContractor) {
    cond.push({ label: "State of Alabama Certification / License" });
    cond.push({ label: "Surety Bond Cover Letter", phone: "251.208.7603 (Permitting)" });
  }
  if (hasAlcohol) cond.push({ label: "ABC Board / City / County Approval Letters" });
  if (isManuf) cond.push({ label: "Environmental Approval Letter", phone: "251.208.7529 (Ryne Smith)" });

  return { always, conditional: cond };
}

function DocRow({ doc }: { doc: Doc }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.625rem 0.75rem", borderRadius: "6px", background: "#fafbfc", border: "1px solid var(--border-lt)", marginBottom: "0.375rem" }}>
      <span style={{ fontSize: "1.1rem", lineHeight: 1, flexShrink: 0, marginTop: "1px" }}>☐</span>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--ink-2)", lineHeight: 1.5 }}>
        {doc.label}
        {doc.link && <> — <a href={doc.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "none" }}>{doc.linkText}</a></>}
        {doc.phone && <span style={{ color: "var(--muted)" }}> — Contact: {doc.phone}</span>}
      </span>
    </div>
  );
}

export default function StepDocumentChecklist({ data, onChange, onNext, onBack, onSaveExit }: StepProps) {
  const { always, conditional } = computeDocs(data);
  const [error, setError] = useState<string | null>(null);

  function validate() {
    if (!data.documentsAcknowledged) { setError("Please acknowledge the required documents checklist."); return; }
    setError(null);
    onNext();
  }

  return (
    <div style={{ background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--border-lt)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
      <div style={{ padding: "1.5rem 2rem 1.25rem", borderBottom: "1px solid var(--border-lt)", background: "linear-gradient(to bottom, #fff, #fafbfc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
          <span style={{ width: 24, height: 24, borderRadius: "6px", background: "#eff6ff", border: "1px solid #c0d8ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>5</span>
          <h2 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>Required Documents Checklist</h2>
        </div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--muted)", marginLeft: "30px" }}>Gather these documents before submitting. This list is personalized to your application.</p>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>

        <div className="section-header">Always Required</div>
        {always.map((d, i) => <DocRow key={i} doc={d} />)}

        {conditional.length > 0 && (
          <>
            <div className="section-header">Required Based on Your Application</div>
            {conditional.map((d, i) => <DocRow key={i} doc={d} />)}
          </>
        )}

        {/* 60-Day Notice */}
        <div style={{ margin: "1.5rem 0", padding: "1rem 1.25rem", borderRadius: "8px", background: "#fffbeb", border: "1px solid #fde68a", borderLeft: "4px solid #d97706" }}>
          <p style={{ fontFamily: "var(--font-display), serif", fontSize: "0.875rem", fontWeight: 600, color: "#78350f", marginBottom: "0.5rem" }}>60-Day Affidavit Notice</p>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "#374151", lineHeight: 1.6 }}>
            After your license is approved, you will receive a 60-Day Affidavit with your license paperwork (if applicable). This must be returned within 10 days after your first 60 days of operation. Failure to return it means your permanent license will not be issued and you will be considered to be operating without a license, subject to penalties and court action.
          </p>
        </div>

        {/* Acknowledgment */}
        <label className="choice-card" style={{ padding: "0.875rem 1rem", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", borderColor: data.documentsAcknowledged ? "var(--primary)" : "var(--border)", background: data.documentsAcknowledged ? "#f0f7ff" : "#fff" }}>
          <input type="checkbox" checked={data.documentsAcknowledged} onChange={e => onChange("documentsAcknowledged", e.target.checked)} style={{ accentColor: "var(--primary)", width: 16, height: 16, marginTop: "1px", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--ink)", lineHeight: 1.5 }}>
            <strong>I understand</strong> that I must gather and submit all checked documents above before my application can be processed. <span style={{ color: "var(--error)" }}>*</span>
          </span>
        </label>

        {/* Submission info */}
        <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", borderRadius: "8px", background: "#f8f9fb", border: "1px solid var(--border-lt)" }}>
          <p style={{ fontFamily: "var(--font-display), serif", fontSize: "0.875rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.625rem" }}>Submit Your Documents</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--muted)" }}>
            <span>Email: <a href="mailto:Revenue@cityofmobile.org" style={{ color: "var(--primary)", textDecoration: "none" }}>Revenue@cityofmobile.org</a></span>
            <span>Fax: 251.208.7954</span>
            <span>In-Person: 205 Government St, 2nd Floor South Tower, Mobile AL (Mon–Fri 8am–5pm)</span>
            <span>Mail: PO Box 3065, Mobile AL 36652-3065</span>
          </div>
        </div>

        <div className="step-footer">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
            <button type="button" onClick={onSaveExit} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--muted)", padding: "0.375rem 0" }}>Save &amp; Exit</button>
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
