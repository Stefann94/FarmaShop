import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

// Politica de securitate a conținutului (CSP).
// Rulează deocamdată în modul "Report-Only": browserul doar raportează în consolă
// ce ar fi blocat, fără să blocheze efectiv nimic. Se comută pe activ după validare.
const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-inline' e necesar pentru scripturile inline injectate de App Router (inclusiv JSON-LD).
  // 'unsafe-eval' doar în development, pentru hot reload.
  // googletagmanager.com = scriptul Google Analytics 4
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ''}`,
  // CSS Modules + stilurile inline din componente
  "style-src 'self' 'unsafe-inline'",
  // Google Analytics trimite o parte din date prin pixeli-imagine
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.google-analytics.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  // Apelurile clientului Supabase (REST + realtime) + endpoint-urile de colectare GA4.
  // *.g.doubleclick.net e necesar dacă se activează ulterior legătura cu Google Ads.
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.g.doubleclick.net${isDev ? ' ws://localhost:*' : ''}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

// Headere fără niciun efect asupra funcționalității unui site care nu e
// încapsulat în iframe și nu folosește camera/microfon/geolocație.
const securityHeaders = [
  // Forțează HTTPS timp de 2 ani, inclusiv pe subdomenii
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  // Împiedică încărcarea site-ului într-un iframe pe alt domeniu (clickjacking)
  { key: 'X-Frame-Options', value: 'DENY' },
  // Interzice browserului să "ghicească" tipul unui fișier (MIME sniffing)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Nu trimite calea completă a paginii către site-uri externe
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Dezactivează API-uri de browser pe care site-ul nu le folosește
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  // Ascunde headerul "X-Powered-By: Next.js" (nu mai anunțăm tehnologia folosită)
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
