import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "linear-gradient(160deg, #0a0f0a 0%, #0f1a0f 50%, #0a0f0a 100%)",
      }}
    >
      {/* Logo / Title */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6vw, 3.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            marginBottom: "0.6rem",
            background: "linear-gradient(90deg, #4ade80, #22c55e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PitchPulse
        </h1>
        <p
          style={{
            fontSize: "1.15rem",
            color: "#9ca3af",
            fontWeight: 400,
          }}
        >
          Live football. One place.
        </p>
      </div>

      {/* Competition Cards */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1.5rem",
          justifyContent: "center",
          maxWidth: "720px",
          width: "100%",
        }}
      >
        {/* Champions League */}
        <Link
          href="/ucl"
          style={{
            flex: "1 1 280px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem 1.75rem",
            textAlign: "center",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#60a5fa",
              marginBottom: "0.75rem",
            }}
          >
            UEFA
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "#f8fafc",
            }}
          >
            Champions League
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Fixtures, live scores, results & table
          </p>
          <span
            style={{
              display: "inline-block",
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
            }}
          >
            Enter Matchday →
          </span>
        </Link>

        {/* Nations League */}
        <Link
          href="/nations"
          style={{
            flex: "1 1 280px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "2rem 1.75rem",
            textAlign: "center",
            transition: "all 0.2s ease",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#4ade80",
              marginBottom: "0.75rem",
            }}
          >
            UEFA
          </div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "0.75rem",
              color: "#f8fafc",
            }}
          >
            Nations League
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            Fixtures, live scores, results & standings
          </p>
          <span
            style={{
              display: "inline-block",
              background: "#16a34a",
              color: "white",
              fontWeight: 600,
              fontSize: "0.9rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
            }}
          >
            Enter Matchday →
          </span>
        </Link>
      </div>

      {/* Footer note */}
      <p
        style={{
          marginTop: "3.5rem",
          fontSize: "0.85rem",
          color: "#6b7280",
        }}
      >
        Built by Visualixe Foundation
      </p>
    </main>
  );
}
