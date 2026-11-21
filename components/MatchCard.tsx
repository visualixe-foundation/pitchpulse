import { Match, isLive, isFinished, parseScore } from "@/lib/highlightly";
import { formatTimeOnly, formatDateOnly } from "@/lib/time";
import Link from "next/link";

type Props = {
  match: Match;
  competition: "ucl" | "nations";
};

export default function MatchCard({ match, competition }: Props) {
  const live = isLive(match.state.description);
  const finished = isFinished(match.state.description);
  const score = parseScore(match.state.score.current);
  const base = competition === "ucl" ? "/ucl" : "/nations";

  return (
    <Link
      href={`${base}/match/${match.id}`}
      style={{
        display: "block",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "0.75rem",
        transition: "background 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.6rem",
          fontSize: "0.8rem",
          color: "#9ca3af",
        }}
      >
        <span>{formatDateOnly(match.date)} · {formatTimeOnly(match.date)}</span>
        {live && (
          <span
            style={{
              background: "#dc2626",
              color: "white",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.15rem 0.5rem",
              borderRadius: "999px",
            }}
          >
            LIVE
          </span>
        )}
        {finished && !live && (
          <span style={{ color: "#6b7280", fontWeight: 500 }}>FT</span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div style={{ textAlign: "right", fontWeight: 600 }}>
          {match.homeTeam.name}
        </div>

        <div
          style={{
            fontWeight: 700,
            fontSize: "1.15rem",
            minWidth: "3.5rem",
            textAlign: "center",
            color: live ? "#f87171" : "#f8fafc",
          }}
        >
          {score ? `${score[0]} - ${score[1]}` : "vs"}
        </div>

        <div style={{ textAlign: "left", fontWeight: 600 }}>
          {match.awayTeam.name}
        </div>
      </div>

      {match.round && (
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          {match.round}
        </div>
      )}
    </Link>
  );
}
