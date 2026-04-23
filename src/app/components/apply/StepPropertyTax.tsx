import { StepProps } from "./types";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";

const TAX_TYPES = ["Sales Tax","Sellers Use","Consumer Use","Lease / Rental (Tangible Property)","Lodging","Wine Tax","Tobacco Tax","Liquor Purchase Tax"];
const TAX_FREQS = ["Monthly","Quarterly","Semi-Annually","Annually"];

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

export default function StepPropertyTax({ data, onChange, onNext, onBack, onSaveExit }: StepProps) {
  const isRenting = data.propertyOwnership === "I rent / lease the property";
  const isRentalRes = (data.businessTypes ?? []).includes("Rental — Residential");
  const [error, setError] = useState<string | null>(null);

  function toggleTax(type: string) {
    const cur = data.taxTypes;
    onChange("taxTypes", cur.includes(type) ? cur.filter(t => t !== type) : [...cur, type]);
  }
  function addRentalAddr() { onChange("rentalAddresses", [...data.rentalAddresses, { address: "" }]); }
  function updateRentalAddr(idx: number, val: string) {
    onChange("rentalAddresses", data.rentalAddresses.map((r, i) => i === idx ? { address: val } : r));
  }
  function removeRentalAddr(idx: number) { onChange("rentalAddresses", data.rentalAddresses.filter((_, i) => i !== idx)); }

  function validate() {
    if (!data.propertyOwnership) { setError("Please select property ownership type."); return; }
    if (isRenting && (!data.propOwnerName.trim() || !data.propOwnerStreet.trim() || !data.propOwnerCity.trim() || !data.propOwnerZip.trim() || !data.propOwnerPhone.trim())) {
      setError("Please complete all required property owner fields."); return;
    }
    if (data.taxTypes.length === 0) { setError("Please select at least one business tax type."); return; }
    if (!data.taxFrequency) { setError("Please select a tax filing frequency."); return; }
    setError(null);
    onNext();
  }

  return (
    <div style={{ background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--border-lt)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>
      <div style={{ padding: "1.5rem 2rem 1.25rem", borderBottom: "1px solid var(--border-lt)", background: "linear-gradient(to bottom, #fff, #fafbfc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
          <span style={{ width: 24, height: 24, borderRadius: "6px", background: "#eff6ff", border: "1px solid #c0d8ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>4</span>
          <h2 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>Property &amp; Tax Information</h2>
        </div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--muted-foreground)", marginLeft: "30px" }}>Your property arrangement and tax obligations.</p>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>

        {/* Property Ownership */}
        <div className="section-header">Property Ownership<Req /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {["I own the property", "I rent / lease the property"].map(opt => (
            <label key={opt} className="choice-card">
              <input type="radio" name="propOwn" checked={data.propertyOwnership === opt} onChange={() => onChange("propertyOwnership", opt)} />
              <span>{opt}</span>
            </label>
          ))}
        </div>

        {isRenting && (
          <div className="conditional-block" style={{ marginTop: "0.75rem" }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.75rem", color: "#854d0e", background: "#fef9c3", padding: "0.375rem 0.625rem", borderRadius: "4px", marginBottom: "1rem", border: "1px solid #fde68a" }}>
              A signed lease/rental agreement will be required as a supporting document.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label className="form-label">Property Owner Name<Req /></label>
                <input type="text" className="form-input" value={data.propOwnerName} onChange={e => onChange("propOwnerName", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Property Owner Phone<Req /></label>
                <input type="tel" className="form-input" value={data.propOwnerPhone} onChange={e => onChange("propOwnerPhone", e.target.value)} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Street Address<Req /></label>
                <input type="text" className="form-input" value={data.propOwnerStreet} onChange={e => onChange("propOwnerStreet", e.target.value)} />
              </div>
              <div>
                <label className="form-label">City<Req /></label>
                <input type="text" className="form-input" value={data.propOwnerCity} onChange={e => onChange("propOwnerCity", e.target.value)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div>
                  <label className="form-label">State</label>
                  <input type="text" className="form-input" value={data.propOwnerState} onChange={e => onChange("propOwnerState", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">ZIP<Req /></label>
                  <input type="text" className="form-input" value={data.propOwnerZip} onChange={e => onChange("propOwnerZip", e.target.value)} />
                </div>
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={data.propOwnerEmail} onChange={e => onChange("propOwnerEmail", e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label className="form-label">Property management company?</label>
              <YesNoChoice value={data.hasPropManagement} onChange={v => onChange("hasPropManagement", v)} />
              {data.hasPropManagement === "Yes" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.75rem", paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
                  <div>
                    <label className="form-label">Company name</label>
                    <input type="text" className="form-input" value={data.propManagementName} onChange={e => onChange("propManagementName", e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Contact info</label>
                    <input type="text" className="form-input" value={data.propManagementContact} onChange={e => onChange("propManagementContact", e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isRentalRes && (
          <div style={{ marginTop: "1rem" }}>
            <div className="section-header">Rental Property Addresses</div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--muted-foreground)", marginBottom: "0.625rem" }}>List all rental property addresses within City Limits &amp; Police Jurisdiction.</p>
            {data.rentalAddresses.map((ra, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input type="text" className="form-input" placeholder="Full address" value={ra.address} onChange={e => updateRentalAddr(idx, e.target.value)} />
                <button type="button" onClick={() => removeRentalAddr(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--error)", padding: "0 0.5rem", fontSize: "1rem" }}>✕</button>
              </div>
            ))}
            <button type="button" onClick={addRentalAddr} className="btn-secondary">+ Add Address</button>
          </div>
        )}

        {/* Tax Types */}
        <div className="section-header">Business Tax Type<Req /></div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--muted-foreground)", marginBottom: "0.625rem" }}>Select all that apply.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem" }}>
          {TAX_TYPES.map(type => (
            <label key={type} className="choice-card">
              <input type="checkbox" checked={data.taxTypes.includes(type)} onChange={() => toggleTax(type)} />
              <span>{type}</span>
            </label>
          ))}
        </div>

        {/* Frequency */}
        <div className="section-header">Tax Filing Frequency<Req /></div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--muted-foreground)", marginBottom: "0.625rem" }}>Must match your Alabama Department of Revenue registration.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.375rem" }}>
          {TAX_FREQS.map(freq => (
            <label key={freq} className="choice-card" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0.75rem 0.375rem", gap: "4px" }}>
              <input type="radio" name="taxFreq" checked={data.taxFrequency === freq} onChange={() => onChange("taxFrequency", freq)} />
              <span style={{ fontSize: "0.8rem", fontWeight: data.taxFrequency === freq ? 600 : 400, color: data.taxFrequency === freq ? "var(--primary)" : "var(--ink-2)" }}>{freq}</span>
            </label>
          ))}
        </div>

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
