"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../components/AuthContext";

/* ── Decorative civic geometry SVG for the left panel ───────────────────── */
function CivicGeometry() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 480 640"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Grid dots */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={col * 80 + 40}
            cy={row * 80 + 40}
            r="1.5"
            fill="rgba(255,255,255,0.12)"
          />
        ))
      )}

      {/* Large outer arc — Mobile Bay reference */}
      <circle
        cx="480"
        cy="640"
        r="420"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="480"
        cy="640"
        r="310"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx="480"
        cy="640"
        r="210"
        stroke="rgba(200,150,62,0.15)"
        strokeWidth="1"
        fill="none"
      />

      {/* Horizontal rule lines */}
      <line x1="0" y1="120" x2="480" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="0" y1="480" x2="480" y2="480" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

      {/* Amber accent — corner ornament */}
      <rect x="36" y="36" width="40" height="1.5" fill="rgba(200,150,62,0.55)" />
      <rect x="36" y="36" width="1.5" height="40" fill="rgba(200,150,62,0.55)" />

      {/* Bottom right ornament */}
      <rect x="404" y="603" width="40" height="1.5" fill="rgba(200,150,62,0.35)" />
      <rect x="443" y="563" width="1.5" height="42" fill="rgba(200,150,62,0.35)" />

      {/* Large decorative circle — centre-right */}
      <circle
        cx="360"
        cy="200"
        r="90"
        stroke="rgba(255,255,255,0.04)"
        strokeWidth="40"
        fill="none"
      />

      {/* Seal-like inner circle */}
      <circle cx="360" cy="200" r="42" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
      <circle cx="360" cy="200" r="28" stroke="rgba(200,150,62,0.2)" strokeWidth="1" fill="rgba(200,150,62,0.04)" />

      {/* Diagonal rule */}
      <line x1="0" y1="560" x2="200" y2="640" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    </svg>
  );
}

/* ── Tab component ───────────────────────────────────────────────────────── */
function TabBar({ active, onChange }: { active: "signin" | "register"; onChange: (t: "signin" | "register") => void }) {
  return (
    <div className="relative flex mb-7" style={{ borderBottom: "2px solid #e2e5ea" }}>
      {(["signin", "register"] as const).map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className="relative pb-3 pr-6 text-sm font-medium transition-colors duration-150"
          style={{
            color: active === tab ? "#111827" : "#9ca3af",
            fontFamily: "var(--font-ui), sans-serif",
            background: "none",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.01em",
          }}
        >
          {tab === "signin" ? "Sign In" : "Create Account"}
          {active === tab && (
            <span
              className="absolute bottom-0 left-0 w-full"
              style={{
                height: "2px",
                background: "#0066cc",
                transform: "translateY(2px)",
                borderRadius: "2px 2px 0 0",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Main form ───────────────────────────────────────────────────────────── */
function LoginForm() {
  const { user, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "signin";
  const [tab, setTab] = useState<"signin" | "register">(initialTab);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!siEmail || !siPassword) { setError("Please fill in all fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    login(siEmail.split("@")[0] || siEmail, siEmail);
    router.push("/dashboard");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!regName || !regEmail || !regPassword || !regConfirm) { setError("Please fill in all fields."); return; }
    if (regPassword !== regConfirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    login(regName, regEmail);
    router.push("/dashboard");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #e2e5ea",
    borderRadius: "6px",
    padding: "0.625rem 0.875rem",
    fontSize: "0.9rem",
    fontFamily: "var(--font-ui), sans-serif",
    background: "#fff",
    color: "#111827",
    outline: "none",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
    display: "block",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "0.3rem",
    fontFamily: "var(--font-ui), sans-serif",
    letterSpacing: "0.025em",
    textTransform: "uppercase",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "var(--font-ui), sans-serif" }}>

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "42%",
          background: "var(--navy-deep, #142a47)",
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem 3rem",
          overflow: "hidden",
        }}
      >
        <CivicGeometry />

        {/* Top wordmark */}
        <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.375rem 0.875rem",
              borderRadius: "4px",
              border: "1px solid rgba(200,150,62,0.35)",
              background: "rgba(200,150,62,0.06)",
              marginBottom: "0",
            }}
          >
            <span style={{ color: "rgba(200,150,62,0.9)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
              Official Portal
            </span>
          </div>
        </div>

        {/* Centre content */}
        <div className="relative z-10">
          <p
            className="animate-fade-up font-display"
            style={{
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              color: "#fff",
              marginBottom: "1rem",
              animationDelay: "0.2s",
              letterSpacing: "-0.01em",
            }}
          >
            City of<br />
            <em style={{ fontStyle: "italic", color: "rgba(232,185,106,0.95)" }}>Mobile,</em><br />
            Alabama
          </p>
          <p
            className="animate-fade-up"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.875rem",
              lineHeight: 1.65,
              maxWidth: "22ch",
              animationDelay: "0.35s",
            }}
          >
            Business License Portal — apply online, fast, secure, and paperless.
          </p>

          {/* Divider */}
          <div
            className="animate-fade-up"
            style={{
              width: "2.5rem",
              height: "1.5px",
              background: "rgba(200,150,62,0.6)",
              margin: "1.5rem 0",
              animationDelay: "0.45s",
            }}
          />

          {/* Stats row */}
          <div
            className="animate-fade-up"
            style={{
              display: "flex",
              gap: "2rem",
              animationDelay: "0.5s",
            }}
          >
            {[["15–20", "minutes"], ["Est. 1702", "City founded"], ["6 Steps", "to complete"]].map(([val, label]) => (
              <div key={label}>
                <div style={{ color: "#fff", fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em" }}>{val}</div>
                <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.72rem", letterSpacing: "0.04em", marginTop: "1px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footnote */}
        <div
          className="relative z-10 animate-fade-up"
          style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", letterSpacing: "0.06em", animationDelay: "0.6s" }}
        >
          REVENUE DEPARTMENT · CITY OF MOBILE, AL
        </div>
      </div>

      {/* ── Right panel — form ─────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          background: "#f7f8fa",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "3rem 1.5rem",
          position: "relative",
        }}
      >
        {/* Subtle top border accent */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #0066cc 0%, rgba(0,102,204,0.1) 100%)" }} />

        <div
          className="animate-fade-up"
          style={{
            width: "100%",
            maxWidth: "400px",
            animationDelay: "0.15s",
          }}
        >
          {/* Mobile-only wordmark */}
          <div className="lg:hidden mb-8 text-center">
            <p className="font-display" style={{ fontSize: "1.4rem", fontWeight: 600, color: "#1e3a5f", letterSpacing: "-0.01em" }}>City of Mobile</p>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "2px" }}>Alabama — Business License Portal</p>
          </div>

          {/* Form card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "2rem 2rem 2.25rem",
              boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <h1
              className="font-display"
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#111827",
                marginBottom: "0.25rem",
                letterSpacing: "-0.01em",
              }}
            >
              {tab === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p style={{ color: "#9ca3af", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              {tab === "signin"
                ? "Sign in to your portal account"
                : "Register to start your application"}
            </p>

            <TabBar active={tab} onChange={t => { setTab(t); setError(""); }} />

            {error && (
              <div
                style={{
                  marginBottom: "1.25rem",
                  padding: "0.625rem 0.875rem",
                  borderRadius: "6px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: "0.825rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 8v4m0 4h.01"/></svg>
                {error}
              </div>
            )}

            {tab === "signin" ? (
              <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
                <div>
                  <label style={labelStyle} htmlFor="si-email">Email</label>
                  <input
                    id="si-email"
                    type="email"
                    value={siEmail}
                    onChange={e => setSiEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#0066cc"; e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.14)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e5ea"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <label style={labelStyle} htmlFor="si-password">Password</label>
                    <a href="#" style={{ fontSize: "0.78rem", color: "#0066cc", textDecoration: "none" }}>Forgot?</a>
                  </div>
                  <input
                    id="si-password"
                    type="password"
                    value={siPassword}
                    onChange={e => setSiPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#0066cc"; e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.14)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e5ea"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: loading ? "#6baeed" : "#0066cc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-ui), sans-serif",
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.01em",
                    transition: "background 0.15s, transform 0.12s, box-shadow 0.15s",
                    boxShadow: "0 2px 8px rgba(0,102,204,0.3)",
                    marginTop: "0.25rem",
                  }}
                  onMouseEnter={e => { if (!loading) { (e.target as HTMLButtonElement).style.background = "#0052a3"; (e.target as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.target as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(0,102,204,0.35)"; } }}
                  onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = loading ? "#6baeed" : "#0066cc"; (e.target as HTMLButtonElement).style.transform = "none"; (e.target as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,102,204,0.3)"; }}
                >
                  {loading ? "Signing in…" : "Sign In →"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
                <div>
                  <label style={labelStyle} htmlFor="reg-name">Full Name</label>
                  <input id="reg-name" type="text" value={regName} onChange={e => setRegName(e.target.value)} required autoComplete="name" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#0066cc"; e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.14)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e5ea"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="reg-email">Email</label>
                  <input id="reg-email" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required autoComplete="email" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#0066cc"; e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.14)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e5ea"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="reg-password">Password</label>
                  <input id="reg-password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required autoComplete="new-password" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#0066cc"; e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.14)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e5ea"; e.target.style.boxShadow = "none"; }} />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="reg-confirm">Confirm Password</label>
                  <input id="reg-confirm" type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} required autoComplete="new-password" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = "#0066cc"; e.target.style.boxShadow = "0 0 0 3px rgba(0,102,204,0.14)"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e5ea"; e.target.style.boxShadow = "none"; }} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    background: loading ? "#6baeed" : "#0066cc",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    fontFamily: "var(--font-ui), sans-serif",
                    cursor: loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.01em",
                    transition: "background 0.15s, transform 0.12s, box-shadow 0.15s",
                    boxShadow: "0 2px 8px rgba(0,102,204,0.3)",
                    marginTop: "0.25rem",
                  }}
                  onMouseEnter={e => { if (!loading) { (e.target as HTMLButtonElement).style.background = "#0052a3"; (e.target as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.target as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(0,102,204,0.35)"; } }}
                  onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = loading ? "#6baeed" : "#0066cc"; (e.target as HTMLButtonElement).style.transform = "none"; (e.target as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,102,204,0.3)"; }}
                >
                  {loading ? "Creating account…" : "Create Account →"}
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.75rem", color: "#9ca3af" }}>
            Official City of Mobile Revenue Department portal.{" "}
            <br className="sm:hidden" />
            Questions?{" "}
            <a href="tel:2512087462" style={{ color: "#0066cc", textDecoration: "none" }}>251.208.7462</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "2rem", height: "2rem", border: "2px solid #e2e5ea", borderTopColor: "#0066cc", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
