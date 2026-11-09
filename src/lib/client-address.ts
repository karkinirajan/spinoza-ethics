/**
 * Who is calling, for rate limits.
 *
 * X-Forwarded-For, X-Real-IP and CF-Connecting-IP are plain request headers: anyone can send them, so believing them lets a
 * caller pick their own rate-limit key (and use a new one on every request). They are believed only where something in front of
 * the app is known to set them: Vercel (the VERCEL variable is set there) or, elsewhere, TRUST_PROXY_HEADERS=true for a proxy
 * you control that overwrites them. Otherwise every caller shares the key "untrusted", so limits then count all callers together.
 *
 * CF-Connecting-IP is a Cloudflare header: Vercel and other proxies pass it through untouched, so on them it is just another
 * header the caller can set. It is read only with the extra opt-in TRUST_CLOUDFLARE_HEADERS=true, for a site whose origin accepts
 * traffic only from Cloudflare.
 *
 * IPv6 callers are keyed on their /64 (a single customer is normally handed a whole /64, so keying on the full address would
 * give them 2^64 free keys), and an IPv4-mapped IPv6 address is treated as the IPv4 address it wraps.
 */
export const UNTRUSTED = "untrusted";
export const UNKNOWN = "unknown";

export function trustsForwardedHeaders(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.VERCEL) || env.TRUST_PROXY_HEADERS === "true";
}

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

function isIpv4(value: string): boolean {
  const m = IPV4.exec(value);
  return Boolean(m) && m!.slice(1).every((part) => Number(part) <= 255);
}

/** The text of an address in one canonical form: IPv4 as is, IPv6 reduced to its /64 in lower-case groups. */
export function normalizeAddress(raw: string): string {
  let value = raw.trim().toLowerCase();
  if (value.startsWith("[") && value.includes("]")) value = value.slice(1, value.indexOf("]"));
  value = value.replace(/%.*$/, ""); // a zone id, as in fe80::1%eth0
  if (isIpv4(value)) return value;
  const mapped = /^(?:0{0,4}:){0,5}:?ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(value) ?? /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(value);
  if (mapped?.[1] && isIpv4(mapped[1])) return mapped[1];
  // expand "::" to the zero groups it stands for
  const halves = value.split("::");
  if (halves.length > 2) return UNKNOWN;
  const head = halves[0] ? halves[0].split(":") : [];
  const tail = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const fill = halves.length === 2 ? 8 - head.length - tail.length : 0;
  const groups = [...head, ...Array<string>(Math.max(fill, 0)).fill("0"), ...tail];
  if (groups.length !== 8 || groups.some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return UNKNOWN;
  return groups.slice(0, 4).map((g) => g.replace(/^0+(?=.)/, "")).join(":") + "::/64";
}

export function clientAddress(headers: Headers, env: Record<string, string | undefined> = process.env): string {
  if (!trustsForwardedHeaders(env)) return UNTRUSTED;
  const cloudflare = env.TRUST_CLOUDFLARE_HEADERS === "true" ? headers.get("cf-connecting-ip") : null;
  const candidate = cloudflare ?? headers.get("x-forwarded-for")?.split(",")[0] ?? headers.get("x-real-ip");
  if (!candidate || !candidate.trim()) return UNKNOWN;
  return normalizeAddress(candidate);
}
