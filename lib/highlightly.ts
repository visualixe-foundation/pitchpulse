// Shared Highlightly Football API client for PitchPulse
// Supports both UEFA Champions League and UEFA Nations League
// Free tier = 100 req/day — cache aggressively

const SOURCE = process.env.HIGHLIGHTLY_SOURCE === "rapidapi" ? "rapidapi" : "direct";
const API_KEY = process.env.HIGHLIGHTLY_API_KEY;

export const LEAGUE_IDS = {
  ucl: process.env.UCL_LEAGUE_ID || "2486",
  nations: process.env.NATIONS_LEAGUE_ID || "5039",
} as const;

export type Competition = keyof typeof LEAGUE_IDS;

const BASE_URL =
  SOURCE === "rapidapi"
    ? "https://football-highlights-api.p.rapidapi.com"
    : "https://soccer.highlightly.net";

const REVALIDATE_MATCHES = 90;
const REVALIDATE_SEASON = 5 * 60;
const REVALIDATE_MATCH = 60;
const REVALIDATE_MATCH_LIVE = 30;
const REVALIDATE_STANDINGS = 15 * 60;
const REVALIDATE_HIGHLIGHTS = 12 * 60 * 60;
const REVALIDATE_TEAM = 24 * 60 * 60;
const REVALIDATE_LINEUPS_LIVE = 15 * 60;
const REVALIDATE_LINEUPS_DONE = 24 * 60 * 60;

const PAGE_SIZE = 100;
const MAX_PAGES = 8;

function headers(): HeadersInit {
  if (!API_KEY) {
    throw new Error(
      "Missing HIGHLIGHTLY_API_KEY. Add it to .env.local (see .env.local.example)."
    );
  }
  const h: HeadersInit = { "x-rapidapi-key": API_KEY };
  if (SOURCE === "rapidapi") {
    h["x-rapidapi-host"] = "football-highlights-api.p.rapidapi.com";
  }
  return h;
}

async function get<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidate = REVALIDATE_MATCHES
): Promise<T> {
  const url = new URL(BASE_URL + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url.toString(), {
    headers: headers(),
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Highlightly ${path} failed: ${res.status} ${body}`);
  }
  return res.json();
}

function currentSeason(): number {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  return month >= 7 ? year : year - 1;
}

export function todayEAT(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
}

export function addDaysUTC(base: Date, days: number): Date {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function isoDateUTC(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ——— Types ———

type Team = {
  id: number;
  logo?: string;
  name: string;
  type?: string;
};

type MatchState = {
  description: string;
  clock?: number | null;
  score: {
    current: string | null;
    penalties?: string | null;
  };
};

export type Match = {
  id: number;
  round?: string;
  date: string;
  homeTeam: Team;
  awayTeam: Team;
  state: MatchState;
  venue?: { name?: string; city?: string };
  referee?: { name?: string };
  events?: MatchEvent[];
};

export type MatchEvent = {
  type?: string;
  time?: string | number;
  player?: string | { name?: string };
  team?: string | { name?: string };
  description?: string;
  substituted?: string | null;
  assist?: string | null;
};

export type Highlight = {
  id: number | string;
  title: string;
  date: string;
  embedUrl?: string;
  url: string;
  homeTeam?: string;
  awayTeam?: string;
  match?: { id?: number };
};

export type LineupPlayer = {
  id?: number;
  name: string;
  number?: number;
  position?: string;
};

export type TeamLineup = {
  id?: number;
  name?: string;
  logo?: string;
  formation?: string;
  initialLineup?: LineupPlayer[][];
  substitutes?: LineupPlayer[];
};

export type MatchLineups = {
  homeTeam?: TeamLineup;
  awayTeam?: TeamLineup;
};

type StandingsSplit = {
  wins: number;
  draws: number;
  games: number;
  loses: number;
  scoredGoals: number;
  receivedGoals: number;
};

export type StandingRow = {
  team: { id: number; logo?: string; name: string };
  total: StandingsSplit;
  home: StandingsSplit;
  away: StandingsSplit;
  points: number;
  position: number;
};

export type StandingsGroup = {
  name: string;
  standings: StandingRow[];
};

export type Standings = {
  groups: StandingsGroup[];
  league: { id: number; logo?: string; name: string; season: number };
};

// ——— Helpers ———

function normalizeMatchList(data: { data?: Match[] } | Match[]): Match[] {
  return Array.isArray(data) ? data : data.data ?? [];
}

export function isLive(description: string): boolean {
  const d = description.toLowerCase().trim();
  return [
    "first half",
    "second half",
    "half time",
    "extra time",
    "break time",
    "penalties",
    "in progress",
  ].some((x) => d === x || d.includes(x));
}

export function isFinished(description: string): boolean {
  const d = description.toLowerCase().trim();
  if (
    [
      "finished",
      "finished after penalties",
      "finished after extra time",
      "awarded",
      "ft",
      "full time",
      "full-time",
      "match finished",
      "ended",
    ].some((x) => d === x || d.includes(x))
  )
    return true;
  return d.includes("finished");
}

export function parseScore(current: string | null): [number, number] | null {
  if (!current) return null;
  const m = current.match(/(\d+)\s*-\s*(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}

export function sortStandings(rows: StandingRow[]): StandingRow[] {
  return [...rows].sort((a, b) => {
    if (a.position !== b.position) return a.position - b.position;
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.total.scoredGoals - a.total.receivedGoals;
    const gdB = b.total.scoredGoals - b.total.receivedGoals;
    if (gdB !== gdA) return gdB - gdA;
    return b.total.scoredGoals - a.total.scoredGoals;
  });
}

// ——— API functions ———

export async function getMatches(
  competition: Competition,
  date?: string
): Promise<Match[]> {
  const leagueId = LEAGUE_IDS[competition];
  if (!leagueId) return [];
  const day = date ?? todayEAT();
  const data = await get<{ data?: Match[] } | Match[]>(
    "/matches",
    {
      leagueId,
      date: day,
      season: currentSeason(),
      timezone: "Africa/Nairobi",
    },
    REVALIDATE_MATCHES
  );
  return normalizeMatchList(data);
}

export async function getSeasonMatches(
  competition: Competition
): Promise<Match[]> {
  const leagueId = LEAGUE_IDS[competition];
  if (!leagueId) return [];
  const season = currentSeason();
  const byId = new Map<number, Match>();

  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * PAGE_SIZE;
    const data = await get<{ data?: Match[] } | Match[]>(
      "/matches",
      {
        leagueId,
        season,
        timezone: "Africa/Nairobi",
        limit: PAGE_SIZE,
        offset,
      },
      REVALIDATE_SEASON
    );
    const batch = normalizeMatchList(data);
    if (batch.length === 0) break;
    for (const m of batch) byId.set(m.id, m);
    if (batch.length < PAGE_SIZE) break;
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export async function getMatchesWindow(
  competition: Competition,
  startDate: string,
  days = 3,
  pastDays = 2
): Promise<Match[]> {
  const leagueId = LEAGUE_IDS[competition];
  if (!leagueId) return [];
  const start = new Date(startDate + "T00:00:00.000Z");
  const back = Math.min(Math.max(pastDays, 0), 7);
  const forward = Math.min(Math.max(days, 1), 8);
  const offsets: number[] = [];
  for (let i = -back; i < forward; i++) offsets.push(i);

  const results = await Promise.all(
    offsets.map(async (i) => {
      try {
        return await getMatches(competition, isoDateUTC(addDaysUTC(start, i)));
      } catch {
        return [] as Match[];
      }
    })
  );
  const byId = new Map<number, Match>();
  for (const batch of results) {
    for (const m of batch) byId.set(m.id, m);
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export async function getMatchById(
  id: number,
  live = false
): Promise<Match | null> {
  try {
    const data = await get<Match | Match[] | { data?: Match }>(
      `/matches/${id}`,
      {},
      live ? REVALIDATE_MATCH_LIVE : REVALIDATE_MATCH
    );
    if (Array.isArray(data)) return data[0] ?? null;
    if (data && typeof data === "object" && "data" in data) {
      return (data as { data?: Match }).data ?? null;
    }
    return data as Match;
  } catch {
    return null;
  }
}

export async function getLineups(
  matchId: number,
  options?: { finished?: boolean }
): Promise<MatchLineups | null> {
  try {
    const revalidate = options?.finished
      ? REVALIDATE_LINEUPS_DONE
      : REVALIDATE_LINEUPS_LIVE;
    const data = await get<MatchLineups>(`/lineups/${matchId}`, {}, revalidate);
    if (!data?.homeTeam && !data?.awayTeam) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getStandings(
  competition: Competition
): Promise<Standings | null> {
  const leagueId = LEAGUE_IDS[competition];
  if (!leagueId) return null;
  const data = await get<Standings>(
    "/standings",
    {
      leagueId,
      season: currentSeason(),
    },
    REVALIDATE_STANDINGS
  );
  return data;
}

export async function getHighlights(
  competition: Competition,
  date?: string
): Promise<Highlight[]> {
  const leagueId = LEAGUE_IDS[competition];
  if (!leagueId) return [];
  const params: Record<string, string | number> = {
    leagueId,
    season: currentSeason(),
  };
  if (date) params.date = date;
  const data = await get<{ data?: Highlight[] } | Highlight[]>(
    "/highlights",
    params,
    REVALIDATE_HIGHLIGHTS
  );
  return Array.isArray(data) ? data : data.data ?? [];
}

export async function getTeam(id: number): Promise<Team | null> {
  try {
    const data = await get<Team | Team[]>(`/teams/${id}`, {}, REVALIDATE_TEAM);
    if (Array.isArray(data)) return data[0] ?? null;
    return data;
  } catch {
    return null;
  }
}

export async function getLastFive(teamId: number): Promise<Match[]> {
  try {
    const data = await get<Match[] | { data?: Match[] }>(
      "/last-five-games",
      { teamId },
      REVALIDATE_MATCHES
    );
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}
