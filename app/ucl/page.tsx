import Link from "next/link";
import {
  getMatchesWindow,
  isLive,
  isFinished,
  type Match,
} from "@/lib/highlightly";
import { todayEAT } from "@/lib/highlightly";
import MatchCard from "@/components/MatchCard";

export const dynamic = "force-dynamic";

export default async function UCLPage() {
  let matches: Match[] = [];
  let error: string | null = null;

  try {
    matches = await getMatchesWindow("ucl", todayEAT(), 4, 2);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load fixtures";
  }

  const live = matches.filter((m) => isLive(m.state.description));
  const upcoming = matches.filter(
    (m) => !isLive(m.state.description) && !isFinished(m.state.description)
  );
  const finished = matches.filter((m) => isFinished(m.state.description));

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0f0a",
        color: "#fff",
        padding: "1.5rem 1rem 3rem",
      }}
    >
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <Link
              href="/"
              style={{ fontSize: "0.85rem", color: "#9ca3af", marginBottom: "0.25rem", display: "block" }}
            >
              ← PitchPulse
            </Link>
            <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Champions League</h1>
          </div>
          <nav style={{ display: "flex", gap: "0.75rem", fontSize: "0.9rem" }}>
            <Link href="/ucl" style={{ color: "#60a5fa", fontWeight: 600 }}>
              Fixtures
            </Link>
            <Link href="/ucl/standings" style={{ color: "#9ca3af" }}>
              Table
            </Link>
          </nav>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(220, 38, 38, 0.15)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1.5rem",
              color: "#fca5a5",
              fontSize: "0.9rem",
            }}
          >
            {error}
            <br />
            <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
              Make sure HIGHLIGHTLY_API_KEY is set in Vercel environment variables.
            </span>
          </div>
        )}

        {!error && matches.length === 0 && (
          <p style={{ color: "#9ca3af", textAlign: "center", marginTop: "3rem" }}>
            No fixtures in the current window.
          </p>
        )}

        {live.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#f87171",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
              }}
            >
              Live
            </h2>
            {live.map((m) => (
              <MatchCard key={m.id} match={m} competition="ucl" />
            ))}
          </section>
        )}

        {upcoming.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h2
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
              }}
            >
              Upcoming
            </h2>
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} competition="ucl" />
            ))}
          </section>
        )}

        {finished.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.75rem",
              }}
            >
              Recent Results
            </h2>
            {finished.map((m) => (
              <MatchCard key={m.id} match={m} competition="ucl" />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
