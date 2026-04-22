import { StepProps } from "./types";

const APPLICATION_TYPES = [
  "New Business",
  "Change — Business Name",
  "Change — New Owner",
  "Change — FEIN / Business Structure",
  "Change — Physical Location",
  "Re-Active Account",
  "Other",
];

const BUSINESS_TYPES = [
  "Contractor — State Certified",
  "Construction — Non-Certified",
  "Service / Professional",
  "Retail",
  "Manufacturer",
  "Wholesale",
  "Rental — Tangible Goods",
  "Peddler",
  "Food Truck",
  "Restaurant / Bar / Lounge",
  "Convenience / Grocery Store",
  "Hotel / Motel",
  "Rental — Residential",
  "Other",
];

function Req() {
  return <span style={{ color: "var(--error)", marginLeft: "2px" }}>*</span>;
}

function YesNoChoice({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {["Yes", "No"].map(opt => (
        <label key={opt} className="choice-card" style={{ flex: 1, justifyContent: "center", cursor: "pointer" }}>
          <input type="radio" checked={value === opt} onChange={() => onChange(opt)} style={{ display: "none" }} />
          <span style={{
            fontSize: "0.875rem",
            fontWeight: value === opt ? 600 : 400,
            color: value === opt ? "var(--primary)" : "var(--ink-2)",
            textAlign: "center",
            width: "100%",
          }}>
            {opt}
          </span>
        </label>
      ))}
    </div>
  );
}

export default function StepApplicationSetup({ data, onChange, onNext, onSaveExit }: StepProps) {
  const hasRestaurant = data.businessTypes.includes("Restaurant / Bar / Lounge");
  const hasConvenience = data.businessTypes.includes("Convenience / Grocery Store");
  const hasHotel = data.businessTypes.includes("Hotel / Motel");

  function toggleType(type: string) {
    const cur = data.businessTypes;
    onChange("businessTypes", cur.includes(type) ? cur.filter(t => t !== type) : [...cur, type]);
  }

  function validate() {
    if (!data.applicationType) { alert("Please select an Application Type."); return; }
    if (data.applicationType === "Other" && !data.applicationTypeOther.trim()) { alert("Please describe the application type."); return; }
    if (!data.businessOperatedFrom) { alert("Please select where the business is operated from."); return; }
    if (data.businessTypes.length === 0) { alert("Please select at least one business type."); return; }
    if (data.businessTypes.includes("Other") && !data.businessTypeOther.trim()) { alert("Please describe the other business type."); return; }
    if (data.detailedExplanation.trim().length < 50) { alert("Please provide a detailed explanation of at least 50 characters."); return; }
    onNext();
  }

  return (
    <div style={{ background: "var(--card-bg)", borderRadius: "10px", border: "1px solid var(--border-lt)", boxShadow: "var(--shadow-md)", overflow: "hidden" }}>

      {/* Card header */}
      <div style={{ padding: "1.5rem 2rem 1.25rem", borderBottom: "1px solid var(--border-lt)", background: "linear-gradient(to bottom, #fff, #fafbfc)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
          <span style={{ width: 24, height: 24, borderRadius: "6px", background: "#eff6ff", border: "1px solid #c0d8ef", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "var(--primary)", flexShrink: 0 }}>1</span>
          <h2 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>Application Setup</h2>
        </div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "var(--muted)", marginLeft: "30px" }}>Tell us the type and nature of this application.</p>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>

        {/* Application Type */}
        <div className="section-header">Application Type<Req /></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {APPLICATION_TYPES.map(type => (
            <label key={type} className="choice-card">
              <input type="radio" name="applicationType" checked={data.applicationType === type} onChange={() => onChange("applicationType", type)} />
              <span>{type}</span>
            </label>
          ))}
        </div>

        {data.applicationType === "Other" && (
          <div style={{ marginTop: "0.5rem" }}>
            <label className="form-label" htmlFor="app-type-other">Please explain<Req /></label>
            <input id="app-type-other" type="text" className="form-input" value={data.applicationTypeOther} onChange={e => onChange("applicationTypeOther", e.target.value)} />
          </div>
        )}

        {/* Business Operated From */}
        <div className="section-header">Business Operated From<Req /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {["Commercial Store Front / Office", "Home / Home Office"].map(opt => (
            <label key={opt} className="choice-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: "6px", padding: "0.875rem 1rem" }}>
              <input type="radio" name="businessOperatedFrom" checked={data.businessOperatedFrom === opt} onChange={() => onChange("businessOperatedFrom", opt)} />
              <span style={{ fontWeight: data.businessOperatedFrom === opt ? 600 : 400 }}>{opt}</span>
            </label>
          ))}
        </div>

        {/* Business Types */}
        <div className="section-header">Description / Type<Req /></div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.625rem" }}>Select all that apply.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem" }}>
          {BUSINESS_TYPES.map(type => (
            <label key={type} className="choice-card">
              <input type="checkbox" checked={data.businessTypes.includes(type)} onChange={() => toggleType(type)} />
              <span>{type}</span>
            </label>
          ))}
        </div>

        {data.businessTypes.includes("Other") && (
          <div style={{ marginTop: "0.5rem" }}>
            <label className="form-label" htmlFor="btype-other">Please describe<Req /></label>
            <input id="btype-other" type="text" className="form-input" value={data.businessTypeOther} onChange={e => onChange("businessTypeOther", e.target.value)} />
          </div>
        )}

        {/* Detailed Explanation */}
        <div className="section-header">Detailed Explanation of Business Activity<Req /></div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.5rem" }}>Describe your specific products or services, target customers, and day-to-day operations.</p>
        <textarea
          className="form-input"
          rows={4}
          value={data.detailedExplanation}
          onChange={e => onChange("detailedExplanation", e.target.value)}
          style={{ resize: "vertical", fontFamily: "var(--font-ui), sans-serif" }}
        />
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", marginTop: "0.375rem", color: data.detailedExplanation.length >= 50 ? "var(--success)" : "var(--muted)" }}>
          {data.detailedExplanation.length < 50
            ? `${50 - data.detailedExplanation.length} more characters required`
            : `✓ ${data.detailedExplanation.length} characters`}
        </p>

        {/* Conditional — Restaurant / Bar / Lounge */}
        {hasRestaurant && (
          <div className="conditional-block" style={{ marginTop: "1rem" }}>
            <p style={{ fontFamily: "var(--font-display), serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)", marginBottom: "1rem" }}>Restaurant / Bar / Lounge Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Cook / serve prepared food?</label>
                <YesNoChoice value={data.serveFood} onChange={v => onChange("serveFood", v)} />
              </div>
              <div>
                <label className="form-label">Alcohol sales?</label>
                <YesNoChoice value={data.alcoholSales} onChange={v => onChange("alcoholSales", v)} />
              </div>
              {data.alcoholSales === "Yes" && (
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
                  <label className="form-label">Has ABC Board application started?</label>
                  <YesNoChoice value={data.abcStarted} onChange={v => onChange("abcStarted", v)} />
                </div>
              )}
              <div>
                <label className="form-label">Vending and/or gaming machines?</label>
                <YesNoChoice value={data.vendingGaming} onChange={v => onChange("vendingGaming", v)} />
              </div>
              {data.vendingGaming === "Yes" && (
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label" htmlFor="gaming-count"># Gaming machines</label>
                    <input id="gaming-count" type="number" min="0" className="form-input" value={data.gamingCount} onChange={e => onChange("gamingCount", e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="vending-count"># Vending machines</label>
                    <input id="vending-count" type="number" min="0" className="form-input" value={data.vendingCount} onChange={e => onChange("vendingCount", e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conditional — Convenience / Grocery Store */}
        {hasConvenience && (
          <div className="conditional-block" style={{ marginTop: "1rem" }}>
            <p style={{ fontFamily: "var(--font-display), serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)", marginBottom: "1rem" }}>Convenience / Grocery Store Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label">Cook / serve prepared food?</label>
                <YesNoChoice value={data.cgsServeFood} onChange={v => onChange("cgsServeFood", v)} />
              </div>
              <div>
                <label className="form-label">Sell gasoline?</label>
                <YesNoChoice value={data.sellGasoline} onChange={v => onChange("sellGasoline", v)} />
              </div>
              {data.sellGasoline === "Yes" && (
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label">Owner of pumps</label>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      {["Applicant", "Other"].map(opt => (
                        <label key={opt} className="choice-card" style={{ flex: 1, justifyContent: "center" }}>
                          <input type="radio" checked={data.pumpOwner === opt} onChange={() => onChange("pumpOwner", opt)} style={{ display: "none" }} />
                          <span style={{ textAlign: "center", width: "100%", fontWeight: data.pumpOwner === opt ? 600 : 400, color: data.pumpOwner === opt ? "var(--primary)" : "var(--ink-2)" }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="form-label" htmlFor="distributor">Distributor name</label>
                    <input id="distributor" type="text" className="form-input" value={data.distributorName} onChange={e => onChange("distributorName", e.target.value)} />
                  </div>
                </div>
              )}
              <div>
                <label className="form-label">Retail sales / vending machines?</label>
                <YesNoChoice value={data.retailVending} onChange={v => onChange("retailVending", v)} />
              </div>
              {data.retailVending === "Yes" && (
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
                  <label className="form-label" htmlFor="cgs-vending"># Vending machines</label>
                  <input id="cgs-vending" type="number" min="0" className="form-input" value={data.cgsVendingCount} onChange={e => onChange("cgsVendingCount", e.target.value)} />
                </div>
              )}
              <div>
                <label className="form-label">Alcohol sales?</label>
                <YesNoChoice value={data.cgsAlcohol} onChange={v => onChange("cgsAlcohol", v)} />
              </div>
              {data.cgsAlcohol === "Yes" && (
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
                  <label className="form-label">Has ABC Board application started?</label>
                  <YesNoChoice value={data.cgsAbcStarted} onChange={v => onChange("cgsAbcStarted", v)} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conditional — Hotel / Motel */}
        {hasHotel && (
          <div className="conditional-block" style={{ marginTop: "1rem" }}>
            <p style={{ fontFamily: "var(--font-display), serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)", marginBottom: "1rem" }}>Hotel / Motel Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label className="form-label" htmlFor="room-count">Rooms available for rental<Req /></label>
                <input id="room-count" type="number" min="0" className="form-input" value={data.roomCount} onChange={e => onChange("roomCount", e.target.value)} />
              </div>
              <div>
                <label className="form-label">Cook / serve prepared food?</label>
                <YesNoChoice value={data.hotelServeFood} onChange={v => onChange("hotelServeFood", v)} />
              </div>
              <div>
                <label className="form-label">Alcohol sales?</label>
                <YesNoChoice value={data.hotelAlcohol} onChange={v => onChange("hotelAlcohol", v)} />
              </div>
              {data.hotelAlcohol === "Yes" && (
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border)" }}>
                  <label className="form-label">Has ABC Board application started?</label>
                  <YesNoChoice value={data.hotelAbcStarted} onChange={v => onChange("hotelAbcStarted", v)} />
                </div>
              )}
              <div>
                <label className="form-label">Management company?</label>
                <YesNoChoice value={data.hasManagementCompany} onChange={v => onChange("hasManagementCompany", v)} />
              </div>
              {data.hasManagementCompany === "Yes" && (
                <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--border)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label" htmlFor="mgmt-name">Company name</label>
                    <input id="mgmt-name" type="text" className="form-input" value={data.managementCompanyName} onChange={e => onChange("managementCompanyName", e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="mgmt-contact">Contact info</label>
                    <input id="mgmt-contact" type="text" className="form-input" value={data.managementCompanyContact} onChange={e => onChange("managementCompanyContact", e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="step-footer">
          <button type="button" onClick={onSaveExit} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--muted)", padding: "0.375rem 0", letterSpacing: "0.01em" }}>
            Save &amp; Exit
          </button>
          <button type="button" onClick={validate} className="btn-primary" style={{ padding: "0.625rem 1.75rem" }}>
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
