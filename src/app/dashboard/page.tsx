"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../components/AuthContext";
import AppHeader from "../components/AppHeader";
import ProtectedRoute from "../components/ProtectedRoute";

interface Application {
  refNumber: string;
  businessName: string;
  submittedAt: string;
}

/* ── Sidebar nav ─────────────────────────────────────────────────────────── */
const NAV = [
  {
    label: "Dashboard", href: "/dashboard",
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    label: "New Application", href: "/apply",
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    label: "Contact", href: "#",
    icon: <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
];

/* ── Small stat tile ─────────────────────────────────────────────────────── */
function StatTile({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div style={{
      padding: "0.875rem 1.25rem",
      borderRadius: "8px",
      background: accent ? "rgba(0,102,204,0.06)" : "rgba(255,255,255,0.7)",
      border: `1px solid ${accent ? "rgba(0,102,204,0.15)" : "rgba(0,0,0,0.06)"}`,
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      backdropFilter: "blur(4px)",
    }}>
      <span style={{ fontFamily: "var(--font-display), serif", fontSize: "1.35rem", fontWeight: 600, color: accent ? "#0066cc" : "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</span>
      <span style={{ fontFamily: "var(--font-ui), sans-serif", fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</span>
    </div>
  );
}

/* ── Status badge ────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "3px 10px", borderRadius: "20px",
      background: "#fef9c3", color: "#854d0e",
      fontSize: "0.7rem", fontWeight: 700,
      fontFamily: "var(--font-ui), sans-serif", letterSpacing: "0.04em",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#d97706", display: "inline-block" }} />
      {status}
    </span>
  );
}

/* ── Main dashboard component ────────────────────────────────────────────── */
function DashboardContent() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [applications, setApplications] = useState<Application[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("bl_applications");
      if (raw) setApplications(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";

  return (
    <div className="interior-page">
      <AppHeader />

      <div style={{ flex: 1, display: "flex" }}>

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <aside className="hidden lg:block" style={{
          width: "210px", flexShrink: 0,
          background: "#fff",
          borderRight: "1px solid #e8eaed",
        }}>
          <div style={{ padding: "1.5rem 0.75rem 1rem" }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c4c9d4", padding: "0 0.5rem", marginBottom: "0.5rem", fontWeight: 700 }}>
              Navigation
            </p>
            <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {NAV.map(({ label, href, icon }) => {
                const active = pathname === href;
                return (
                  <Link key={label} href={href} style={{
                    display: "flex", alignItems: "center", gap: "0.625rem",
                    padding: "0.5rem 0.625rem",
                    borderRadius: "6px",
                    fontSize: "0.825rem",
                    fontFamily: "var(--font-ui), sans-serif",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#0066cc" : "#4b5563",
                    background: active ? "#eff6ff" : "transparent",
                    textDecoration: "none",
                    transition: "background 0.12s, color 0.12s",
                    letterSpacing: "0.005em",
                  }}>
                    <span style={{ opacity: active ? 1 : 0.55, color: active ? "#0066cc" : "#6b7280" }}>{icon}</span>
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar lower info */}
          <div style={{ marginTop: "auto", padding: "1rem 1.25rem", position: "absolute", bottom: 0, width: "210px", borderTop: "1px solid #f0f2f5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 0 3px rgba(22,163,74,0.15)" }} />
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.72rem", color: "#6b7280" }}>Portal Online</span>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.68rem", color: "#b0b7c3", lineHeight: 1.5 }}>City of Mobile<br />Revenue Department</p>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Welcome hero strip */}
          <div style={{
            background: "linear-gradient(to bottom, #fff 0%, #f2f4f7 100%)",
            borderBottom: "1px solid #e8eaed",
            padding: "2rem 2rem 1.5rem",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative arc */}
            <svg style={{ position: "absolute", right: -20, top: -40, opacity: 0.035, pointerEvents: "none" }} width="300" height="200" viewBox="0 0 300 200" fill="none">
              <circle cx="300" cy="200" r="180" stroke="#1e3a5f" strokeWidth="2"/>
              <circle cx="300" cy="200" r="130" stroke="#1e3a5f" strokeWidth="2"/>
              <circle cx="300" cy="200" r="80"  stroke="#c8963e" strokeWidth="2"/>
            </svg>

            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: "0.25rem", fontWeight: 600 }}>
              Good {timeOfDay}
            </p>
            <h1 className="font-display animate-fade-up" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 600, color: "#0f1923", letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: "1.25rem", animationDelay: "0.05s" }}>
              {user?.name ?? "Welcome"}
            </h1>

            {/* Stat row */}
            <div className="animate-fade-up" style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", animationDelay: "0.12s" }}>
              <StatTile value={String(applications.length)} label="Applications" accent={applications.length > 0} />
              <StatTile value="~15 min" label="To complete" />
              <StatTile value="6 Steps" label="In application" />
              <StatTile value="Official" label="Gov't portal" />
            </div>
          </div>

          {/* Content area */}
          <div style={{ flex: 1, padding: "1.75rem 2rem 3rem", background: "var(--page-bg)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* New Application card */}
            <div className="animate-fade-up" style={{ animationDelay: "0.18s", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
              {/* Dark navy header */}
              <div style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #1a4a78 60%, #1e3a5f 100%)",
                padding: "1.5rem 1.75rem",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
                position: "relative", overflow: "hidden",
              }}>
                {/* Geometric bg detail */}
                <svg style={{ position: "absolute", right: 100, top: -20, opacity: 0.08, pointerEvents: "none" }} width="140" height="140" viewBox="0 0 140 140" fill="none">
                  <circle cx="70" cy="70" r="68" stroke="white" strokeWidth="1"/>
                  <circle cx="70" cy="70" r="50" stroke="white" strokeWidth="1"/>
                  <circle cx="70" cy="70" r="32" stroke="white" strokeWidth="1"/>
                </svg>
                <svg style={{ position: "absolute", right: -20, bottom: -30, opacity: 0.06, pointerEvents: "none" }} width="160" height="120" viewBox="0 0 160 120" fill="none">
                  <circle cx="160" cy="120" r="100" stroke="#c8963e" strokeWidth="1.5"/>
                  <circle cx="160" cy="120" r="70"  stroke="#c8963e" strokeWidth="1.5"/>
                </svg>

                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#c8963e", display: "inline-block", boxShadow: "0 0 6px rgba(200,150,62,0.5)" }} />
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,150,62,0.8)", fontWeight: 700 }}>Business License</span>
                  </div>
                  <p className="font-display" style={{ fontSize: "1.15rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em", marginBottom: "0.375rem" }}>
                    Start New Application
                  </p>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", maxWidth: "40ch", lineHeight: 1.5 }}>
                    Apply for a City of Mobile business license online. Takes 15–20 minutes.
                  </p>
                </div>

                <Link href="/apply" style={{
                  flexShrink: 0,
                  background: "#c8963e",
                  color: "#fff",
                  padding: "0.5625rem 1.375rem",
                  borderRadius: "7px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  fontFamily: "var(--font-ui), sans-serif",
                  textDecoration: "none",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.25), 0 1px 4px rgba(200,150,62,0.3)",
                  transition: "background 0.15s, transform 0.1s, box-shadow 0.15s",
                  position: "relative",
                }}>
                  Begin →
                </Link>
              </div>

              {/* Step strip */}
              <div style={{ background: "#fff", borderTop: "1px solid #e8eaed", padding: "0.75rem 1.75rem", display: "flex", gap: "0", flexWrap: "nowrap", overflowX: "auto" }}>
                {["Application Setup","Business Info","Owner Info","Property & Tax","Documents","Review & Submit"].map((s, i) => (
                  <div key={s} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.72rem", color: "#9ca3af", fontFamily: "var(--font-ui)", whiteSpace: "nowrap" }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#f0f2f5", border: "1px solid #e1e4e9", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 700, color: "#6b7280", flexShrink: 0 }}>{i+1}</span>
                      {s}
                    </span>
                    {i < 5 && <span style={{ margin: "0 8px", color: "#d1d5db", fontSize: "0.7rem" }}>›</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Your Applications */}
            <div className="animate-fade-up" style={{ animationDelay: "0.25s", background: "#fff", borderRadius: "10px", border: "1px solid #e8eaed", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <div style={{ padding: "1rem 1.75rem", borderBottom: "1px solid #f0f2f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 className="font-display" style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", letterSpacing: "-0.01em" }}>Your Applications</h2>
                {applications.length > 0 && (
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase" }}>{applications.length} on file</span>
                )}
              </div>

              {!mounted || applications.length === 0 ? (
                <div style={{ padding: "3.5rem 2rem", textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "12px", background: "#f3f4f6", border: "1px solid #e8eaed", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="font-display" style={{ fontSize: "1rem", color: "#374151", fontWeight: 500, marginBottom: "0.375rem" }}>No applications yet</p>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.825rem", color: "#9ca3af" }}>
                    <Link href="/apply" style={{ color: "#0066cc", textDecoration: "none", fontWeight: 500 }}>Start your first application</Link> — it takes about 15 minutes.
                  </p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#fafbfc" }}>
                        {["Application #","Business Name","Date Submitted","Status"].map(col => (
                          <th key={col} style={{ padding: "0.5rem 1.75rem", textAlign: "left", fontSize: "9.5px", fontWeight: 700, color: "#9ca3af", fontFamily: "var(--font-ui), sans-serif", letterSpacing: "0.09em", textTransform: "uppercase", borderBottom: "1px solid #f0f2f5" }}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, i) => (
                        <tr key={app.refNumber}
                          style={{ borderBottom: i < applications.length - 1 ? "1px solid #f7f8fa" : "none", transition: "background 0.1s" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#fafbfc"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <td style={{ padding: "0.875rem 1.75rem", fontFamily: "ui-monospace, monospace", fontSize: "0.78rem", color: "#374151", letterSpacing: "0.03em" }}>{app.refNumber}</td>
                          <td style={{ padding: "0.875rem 1.75rem", fontSize: "0.875rem", color: "#111827", fontFamily: "var(--font-ui)", fontWeight: 500 }}>{app.businessName || "—"}</td>
                          <td style={{ padding: "0.875rem 1.75rem", fontSize: "0.8rem", color: "#6b7280", fontFamily: "var(--font-ui)" }}>{new Date(app.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                          <td style={{ padding: "0.875rem 1.75rem" }}><StatusBadge status="Under Review" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Contact info */}
            <div className="animate-fade-up" style={{ animationDelay: "0.32s", background: "#fff", borderRadius: "10px", border: "1px solid #e8eaed", borderLeft: "3px solid #0066cc", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", padding: "1.125rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <p className="font-display" style={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827", marginBottom: "0.25rem" }}>Questions? Revenue Department</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "#6b7280" }}>
                  <span><a href="tel:2512087462" style={{ color: "#0066cc", textDecoration: "none" }}>251.208.7462</a></span>
                  <span><a href="mailto:Revenue@cityofmobile.org" style={{ color: "#0066cc", textDecoration: "none" }}>Revenue@cityofmobile.org</a></span>
                  <span>205 Government St, 2nd Floor — Mon–Fri 8am–5pm</span>
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.7rem", color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>Official Contact</span>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <ProtectedRoute><DashboardContent /></ProtectedRoute>;
}
