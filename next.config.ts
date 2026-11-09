import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Everything the site loads comes from its own origin (fonts included: next/font serves them itself), and the one thing it calls
// is its own /api/explain, so the policy can be tight. Next.js writes small inline scripts into every page, so scripts and styles
// need 'unsafe-inline'; React's development build needs 'unsafe-eval'.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  // The old "1; mode=block" is obsolete and can itself open holes in old browsers; "0" turns the filter off.
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
];

const nextConfig: NextConfig = {
  // Optimize for production
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  headers: async () => [{ source: "/:path*", headers: securityHeaders }],
};

export default nextConfig;
