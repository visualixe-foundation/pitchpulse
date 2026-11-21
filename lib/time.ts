export function formatKickoff(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      timeZone: "Africa/Nairobi",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return iso;
  }
}

export function formatTimeOnly(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-GB", {
      timeZone: "Africa/Nairobi",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

export function formatDateOnly(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      timeZone: "Africa/Nairobi",
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}
