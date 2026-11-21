export default function NationsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background: "#0a0f0a",
        color: "#fff",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Nations League</h1>
      <p style={{ color: "#9ca3af", marginBottom: "2rem" }}>
        Matchday content coming soon...
      </p>
      <a
        href="/"
        style={{
          color: "#4ade80",
          fontWeight: 500,
        }}
      >
        ← Back to PitchPulse
      </a>
    </main>
  );
}
