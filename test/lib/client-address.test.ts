import { describe, expect, it } from "vitest";
import { UNKNOWN, UNTRUSTED, clientAddress, normalizeAddress, trustsForwardedHeaders } from "@/lib/client-address";

const headers = (init: Record<string, string>) => new Headers(init);

describe("trustsForwardedHeaders", () => {
  it("is off by default", () => expect(trustsForwardedHeaders({})).toBe(false));
  it("is on for Vercel", () => expect(trustsForwardedHeaders({ VERCEL: "1" })).toBe(true));
  it("is on when the owner says a proxy overwrites the headers", () => expect(trustsForwardedHeaders({ TRUST_PROXY_HEADERS: "true" })).toBe(true));
  it.each(["1", "yes", "TRUE", ""])("is not on for TRUST_PROXY_HEADERS=%j", (value) => expect(trustsForwardedHeaders({ TRUST_PROXY_HEADERS: value })).toBe(false));
});

describe("clientAddress", () => {
  it("ignores every forwarding header when nothing is known to set them: a caller cannot choose their key", () => {
    const h = headers({ "x-forwarded-for": "1.2.3.4", "x-real-ip": "5.6.7.8", "cf-connecting-ip": "9.9.9.9" });
    expect(clientAddress(h, {})).toBe(UNTRUSTED);
  });
  it("uses the first X-Forwarded-For address when trusted", () => expect(clientAddress(headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }), { VERCEL: "1" })).toBe("203.0.113.7"));
  it("prefers X-Forwarded-For, then X-Real-IP", () => {
    const env = { TRUST_PROXY_HEADERS: "true" };
    expect(clientAddress(headers({ "x-forwarded-for": "2.2.2.2", "x-real-ip": "3.3.3.3" }), env)).toBe("2.2.2.2");
    expect(clientAddress(headers({ "x-real-ip": "3.3.3.3" }), env)).toBe("3.3.3.3");
  });
  it("ignores CF-Connecting-IP on Vercel and behind any other proxy: it is a header the caller can set there", () => {
    for (const env of [{ VERCEL: "1" }, { TRUST_PROXY_HEADERS: "true" }]) {
      const a = clientAddress(headers({ "x-forwarded-for": "203.0.113.7", "cf-connecting-ip": "9.9.9.1" }), env);
      const b = clientAddress(headers({ "x-forwarded-for": "203.0.113.7", "cf-connecting-ip": "9.9.9.2" }), env);
      expect(a).toBe("203.0.113.7");
      expect(b).toBe(a);
    }
    expect(clientAddress(headers({ "cf-connecting-ip": "9.9.9.1" }), { VERCEL: "1" })).toBe(UNKNOWN);
  });
  it("reads CF-Connecting-IP only with the explicit Cloudflare opt-in", () => {
    const env = { TRUST_PROXY_HEADERS: "true", TRUST_CLOUDFLARE_HEADERS: "true" };
    expect(clientAddress(headers({ "cf-connecting-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2" }), env)).toBe("1.1.1.1");
    expect(clientAddress(headers({ "x-forwarded-for": "2.2.2.2" }), env)).toBe("2.2.2.2");
    expect(clientAddress(headers({ "cf-connecting-ip": "1.1.1.1" }), { ...env, TRUST_CLOUDFLARE_HEADERS: "yes" })).toBe(UNKNOWN);
    expect(clientAddress(headers({ "cf-connecting-ip": "1.1.1.1" }), { TRUST_CLOUDFLARE_HEADERS: "true" })).toBe(UNTRUSTED); // the opt-in does not turn trust on by itself
  });
  it("says unknown when trusted but no header is present", () => {
    expect(clientAddress(headers({}), { VERCEL: "1" })).toBe(UNKNOWN);
    expect(clientAddress(headers({ "x-forwarded-for": "  " }), { VERCEL: "1" })).toBe(UNKNOWN);
  });
  it("says unknown for a header that is not an address, so junk cannot mint keys", () => {
    for (const junk of ["not-an-ip", "999.1.1.1", "1.2.3", "<script>", "1.2.3.4.5"]) {
      expect(clientAddress(headers({ "x-forwarded-for": junk }), { VERCEL: "1" })).toBe(UNKNOWN);
    }
  });
});

describe("normalizeAddress", () => {
  it("leaves IPv4 alone", () => expect(normalizeAddress(" 203.0.113.7 ")).toBe("203.0.113.7"));
  it("maps an IPv4-mapped IPv6 address to the IPv4 address", () => {
    expect(normalizeAddress("::ffff:203.0.113.7")).toBe("203.0.113.7");
    expect(normalizeAddress("::FFFF:203.0.113.7")).toBe("203.0.113.7");
  });
  it("keys IPv6 on the /64: every address in one /64 is the same caller", () => {
    expect(normalizeAddress("2001:db8:abcd:12::1")).toBe("2001:db8:abcd:12::/64");
    expect(normalizeAddress("2001:db8:abcd:12:ffff:ffff:ffff:ffff")).toBe("2001:db8:abcd:12::/64");
    expect(normalizeAddress("2001:0DB8:abcd:0012:0:0:0:5")).toBe("2001:db8:abcd:12::/64");
  });
  it("tells different /64s apart", () => expect(normalizeAddress("2001:db8:abcd:12::1")).not.toBe(normalizeAddress("2001:db8:abcd:13::1")));
  it("handles :: at the start and the end, brackets and zone ids", () => {
    expect(normalizeAddress("::1")).toBe("0:0:0:0::/64");
    expect(normalizeAddress("fe80::")).toBe("fe80:0:0:0::/64");
    expect(normalizeAddress("[2001:db8::7]")).toBe("2001:db8:0:0::/64");
    expect(normalizeAddress("fe80::1%eth0")).toBe("fe80:0:0:0::/64");
  });
  it.each(["", "garbage", "1:2:3", "1::2::3", "gggg::1", "1:2:3:4:5:6:7:8:9", "12345::1"])("rejects %j", (bad) => expect(normalizeAddress(bad)).toBe(UNKNOWN));
});
