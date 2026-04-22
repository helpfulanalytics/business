import { StepProps } from "./types";

const STRUCTURES = ["Sole Proprietorship", "Limited Liability Company (LLC)", "Corporation", "Professional Association", "Other"];
const LOCATIONS  = ["City Limits", "Police Jurisdiction (PJ)", "Outside City & PJ"];

function Req() { return <span style={{ color: "var(--error)", marginLeft: "2px" }}>*</span>; }

function FieldGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "0.875rem" }}>
      {children}
    </div>
  );
}

export default function StepBusinessInfo({ data, onChange, onNext, onBack, onSaveExit }: StepProps) {
  const isSoleProp = data.businessStructure === "Sole Proprietorship";

  function validate() {
    if (!data.applicationDate) { alert("Please enter the application date."); return; }
    if (!data.startDate) { alert("Please enter the business start date."); return; }
    if (!data.businessLegalName.trim()) { alert("Please enter the business legal name."); return; }
    if (!data.businessStructure) { alert("Please select a business structure."); return; }
    if (data.businessStructure === "Other" && !data.businessStructureOther.trim()) { alert("Please describe the business structure."); return; }
    if (!data.physicalLocation) { alert("Please select the physical location type."); return; }
    if (!data.physStreet.trim() || !data.physCity.trim() || !data.physZip.trim()) { alert("Please complete the physical address."); return; }
    if (!data.companyPhone.trim()) { alert("Please enter a company phone number."); return; }
    if (!data.numEmployees.trim()) { alert("Please enter the number of employees."); return; }
    if (!data.contactName.trim() || !data.contactTitle.trim() || !data.contactPhone.trim() || !data.contactEmail.trim()) {
      alert("Please complete all Business Contact Person fields."); return;
    }
    onNext();
  }

  return (
    <div style={{ background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--border-lt)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>

      <div style={{ padding: "1.5rem 2rem 1.25rem", borderBottom: "1px solid var(--border-lt)", background: "linear-gradient(to bottom, #fff, #fafbfc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
          <span style={{ width: 24, height: 24, borderRadius: "6px", background: "#eff6ff", border: "1px solid #c0d8ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>2</span>
          <h2 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>Business Information</h2>
        </div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--muted)", marginLeft: "30px" }}>Legal and contact details for your business.</p>
      </div>

      <div style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column", gap: "0" }}>

        {/* Dates */}
        <div className="section-header">Dates</div>
        <FieldGrid>
          <div>
            <label className="form-label" htmlFor="app-date">Application Date<Req /></label>
            <input id="app-date" type="date" className="form-input" value={data.applicationDate} onChange={e => onChange("applicationDate", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="start-date">Business Start Date<Req /></label>
            <input id="start-date" type="date" className="form-input" value={data.startDate} onChange={e => onChange("startDate", e.target.value)} />
          </div>
        </FieldGrid>

        {/* Business Names */}
        <div className="section-header">Business Name</div>
        <FieldGrid>
          <div>
            <label className="form-label" htmlFor="legal-name">Legal Name<Req /></label>
            <input id="legal-name" type="text" className="form-input" value={data.businessLegalName} onChange={e => onChange("businessLegalName", e.target.value)} />
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.25rem" }}>Must match Alabama Secretary of State registration exactly.</p>
          </div>
          <div>
            <label className="form-label" htmlFor="trade-name">Trade Name / DBA</label>
            <input id="trade-name" type="text" className="form-input" value={data.tradeName} onChange={e => onChange("tradeName", e.target.value)} />
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.25rem" }}>Leave blank if same as legal name.</p>
          </div>
        </FieldGrid>

        {/* Business Structure */}
        <div className="section-header">Business Structure<Req /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {STRUCTURES.map(s => (
            <label key={s} className="choice-card">
              <input type="radio" name="structure" value={s} checked={data.businessStructure === s} onChange={() => onChange("businessStructure", s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
        {data.businessStructure === "Other" && (
          <div style={{ marginTop: "0.5rem" }}>
            <label className="form-label" htmlFor="structure-other">Please describe<Req /></label>
            <input id="structure-other" type="text" className="form-input" value={data.businessStructureOther} onChange={e => onChange("businessStructureOther", e.target.value)} />
          </div>
        )}

        {/* Tax IDs */}
        <div className="section-header">Tax Identification</div>
        <FieldGrid>
          {!isSoleProp && (
            <div>
              <label className="form-label" htmlFor="fein">Federal Tax ID (FEIN)</label>
              <input id="fein" type="text" className="form-input" placeholder="XX-XXXXXXX" value={data.fein} onChange={e => onChange("fein", e.target.value)} />
              <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.25rem" }}>Obtain at irs.gov if you don't have one.</p>
            </div>
          )}
          <div>
            <label className="form-label" htmlFor="al-tax">Alabama Tax ID</label>
            <input id="al-tax" type="text" className="form-input" value={data.alTaxId} onChange={e => onChange("alTaxId", e.target.value)} />
          </div>
        </FieldGrid>

        {/* Physical Location */}
        <div className="section-header">Physical Location<Req /></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.375rem" }}>
          {LOCATIONS.map(loc => (
            <label key={loc} className="choice-card" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0.75rem 0.5rem", gap: "4px" }}>
              <input type="radio" name="physLoc" value={loc} checked={data.physicalLocation === loc} onChange={() => onChange("physicalLocation", loc)} />
              <span style={{ fontSize: "0.8rem", fontWeight: data.physicalLocation === loc ? 600 : 400, color: data.physicalLocation === loc ? "var(--primary)" : "var(--ink-2)" }}>{loc}</span>
            </label>
          ))}
        </div>

        {/* Physical Address */}
        <div className="section-header">Company Physical Address<Req /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          <FieldGrid cols={3}>
            <div style={{ gridColumn: "span 2" }}>
              <label className="form-label" htmlFor="phys-street">Street Address<Req /></label>
              <input id="phys-street" type="text" className="form-input" value={data.physStreet} onChange={e => onChange("physStreet", e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="phys-suite">Suite #</label>
              <input id="phys-suite" type="text" className="form-input" value={data.physSuite} onChange={e => onChange("physSuite", e.target.value)} />
            </div>
          </FieldGrid>
          <FieldGrid cols={3}>
            <div>
              <label className="form-label" htmlFor="phys-city">City<Req /></label>
              <input id="phys-city" type="text" className="form-input" value={data.physCity} onChange={e => onChange("physCity", e.target.value)} />
            </div>
            <div>
              <label className="form-label" htmlFor="phys-state">State</label>
              <input id="phys-state" type="text" className="form-input" value={data.physState} readOnly />
            </div>
            <div>
              <label className="form-label" htmlFor="phys-zip">ZIP<Req /></label>
              <input id="phys-zip" type="text" className="form-input" value={data.physZip} onChange={e => onChange("physZip", e.target.value)} />
            </div>
          </FieldGrid>
        </div>

        {/* Mailing Address */}
        <div className="section-header">Mailing Address</div>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginBottom: "0.625rem" }}>
          <input type="checkbox" checked={data.sameAsPhysical} onChange={e => onChange("sameAsPhysical", e.target.checked)} style={{ accentColor: "var(--primary)", width: 15, height: 15 }} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.875rem", color: "var(--ink-2)" }}>Same as physical address</span>
        </label>
        {!data.sameAsPhysical && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            <div>
              <label className="form-label" htmlFor="mail-street">Street / PO Box<Req /></label>
              <input id="mail-street" type="text" className="form-input" value={data.mailStreet} onChange={e => onChange("mailStreet", e.target.value)} />
            </div>
            <FieldGrid cols={3}>
              <div>
                <label className="form-label" htmlFor="mail-city">City<Req /></label>
                <input id="mail-city" type="text" className="form-input" value={data.mailCity} onChange={e => onChange("mailCity", e.target.value)} />
              </div>
              <div>
                <label className="form-label" htmlFor="mail-state">State</label>
                <input id="mail-state" type="text" className="form-input" value={data.mailState} onChange={e => onChange("mailState", e.target.value)} />
              </div>
              <div>
                <label className="form-label" htmlFor="mail-zip">ZIP<Req /></label>
                <input id="mail-zip" type="text" className="form-input" value={data.mailZip} onChange={e => onChange("mailZip", e.target.value)} />
              </div>
            </FieldGrid>
          </div>
        )}

        {/* Phone + Employees */}
        <div className="section-header">Contact &amp; Size</div>
        <FieldGrid cols={3}>
          <div>
            <label className="form-label" htmlFor="co-phone">Company Phone<Req /></label>
            <input id="co-phone" type="tel" className="form-input" placeholder="(251)" value={data.companyPhone} onChange={e => onChange("companyPhone", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="biz-phone">Business Phone</label>
            <input id="biz-phone" type="tel" className="form-input" placeholder="(251)" value={data.businessPhone} onChange={e => onChange("businessPhone", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="num-emp">Employees<Req /></label>
            <input id="num-emp" type="number" min="0" className="form-input" value={data.numEmployees} onChange={e => onChange("numEmployees", e.target.value)} />
          </div>
        </FieldGrid>

        {/* Business Contact */}
        <div className="section-header">Business Contact Person</div>
        <FieldGrid>
          <div>
            <label className="form-label" htmlFor="contact-name">Full Name (Last, First, MI)<Req /></label>
            <input id="contact-name" type="text" className="form-input" value={data.contactName} onChange={e => onChange("contactName", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="contact-title">Title<Req /></label>
            <input id="contact-title" type="text" className="form-input" value={data.contactTitle} onChange={e => onChange("contactTitle", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="contact-phone">Phone<Req /></label>
            <input id="contact-phone" type="tel" className="form-input" value={data.contactPhone} onChange={e => onChange("contactPhone", e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="contact-email">Email<Req /></label>
            <input id="contact-email" type="email" className="form-input" value={data.contactEmail} onChange={e => onChange("contactEmail", e.target.value)} />
          </div>
        </FieldGrid>

        <div className="step-footer">
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <button type="button" onClick={onBack} className="btn-secondary">← Back</button>
            <button type="button" onClick={onSaveExit} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--muted)", padding: "0.375rem 0" }}>Save &amp; Exit</button>
          </div>
          <button type="button" onClick={validate} className="btn-primary" style={{ padding: "0.625rem 1.75rem" }}>Continue →</button>
        </div>
      </div>
    </div>
  );
}
