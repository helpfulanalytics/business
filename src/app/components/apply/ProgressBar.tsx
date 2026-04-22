const STEPS = [
  { short: "Setup",    full: "Application Setup" },
  { short: "Business", full: "Business Info" },
  { short: "Owners",   full: "Owner Info" },
  { short: "Tax",      full: "Property & Tax" },
  { short: "Docs",     full: "Documents" },
  { short: "Review",   full: "Review & Submit" },
];

export default function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ marginBottom: "1.75rem" }}>
      {/* Step label */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.625rem" }}>
        <p
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "1.05rem",
            fontWeight: 600,
            color: "#111827",
            letterSpacing: "-0.01em",
          }}
        >
          {STEPS[step - 1].full}
        </p>
        <span
          style={{
            fontFamily: "var(--font-ui), sans-serif",
            fontSize: "0.72rem",
            color: "#9ca3af",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Step {step} of {STEPS.length}
        </span>
      </div>

      {/* Progress track */}
      <div
        style={{
          height: "4px",
          borderRadius: "4px",
          background: "#e8eaed",
          overflow: "hidden",
          marginBottom: "0.875rem",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "4px",
            background: "linear-gradient(90deg, #0066cc 0%, #1a7fd4 100%)",
            width: `${pct === 0 ? 4 : pct}%`,
            transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: "0 0 6px rgba(0,102,204,0.4)",
          }}
        />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
        {STEPS.map(({ short }, idx) => {
          const num = idx + 1;
          const isCompleted = num < step;
          const isActive = num === step;

          return (
            <div key={num} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Dot */}
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "9px",
                  fontWeight: 700,
                  fontFamily: "var(--font-ui), sans-serif",
                  transition: "all 0.2s ease",
                  ...(isCompleted
                    ? { background: "#0066cc", border: "none", color: "#fff" }
                    : isActive
                    ? { background: "#fff", border: "2px solid #0066cc", color: "#0066cc", boxShadow: "0 0 0 3px rgba(0,102,204,0.14)" }
                    : { background: "#fff", border: "2px solid #d1d5db", color: "#9ca3af" }),
                }}
              >
                {isCompleted ? (
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              {/* Label */}
              <span
                style={{
                  marginTop: "4px",
                  fontSize: "9.5px",
                  fontFamily: "var(--font-ui), sans-serif",
                  letterSpacing: "0.03em",
                  color: isActive ? "#0066cc" : isCompleted ? "#374151" : "#9ca3af",
                  fontWeight: isActive ? 600 : 400,
                  textAlign: "center",
                  lineHeight: 1.2,
                  transition: "color 0.2s",
                }}
              >
                {short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
