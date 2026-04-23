"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleSignOut() {
    logout();
    router.push("/");
  }

  return (
    <header
      role="banner"
      style={{
        backgroundColor: "#1e3a5f",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        width: "100%",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Amber top accent line */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2.5px", background: "linear-gradient(90deg, #c8963e 0%, rgba(200,150,62,0.2) 100%)" }} />

      <div style={{ padding: "0.625rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Left — wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Seal placeholder — small civic emblem */}
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              border: "1.5px solid rgba(200,150,62,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              background: "rgba(200,150,62,0.08)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(200,150,62,0.85)" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-display), Georgia, serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#fff",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              City of Mobile
            </div>
            <div
              style={{
                fontFamily: "var(--font-ui), sans-serif",
                fontSize: "0.67rem",
                color: "rgba(200,150,62,0.75)",
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              Business License Portal
            </div>
          </div>
        </div>

        {/* Right — user + sign out */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user && (
            <>
              <span
                style={{
                  fontFamily: "var(--font-ui), sans-serif",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.01em",
                }}
                className="hidden sm:block"
              >
                {user.name}
              </span>
              <button
                onClick={handleSignOut}
                style={{
                  fontFamily: "var(--font-ui), sans-serif",
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.7)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "4px",
                  padding: "0.3rem 0.75rem",
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; (e.target as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; (e.target as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)"; }}
              >
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
