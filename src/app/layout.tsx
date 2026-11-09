import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import GeometricAdvisor from "@/components/GeometricAdvisor";
import { SpinozaProvider } from "@/context/SpinozaContext";
import ThemeProvider from "@/context/ThemeContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL("https://spinoza-ethics.vercel.app"),
  title: {
    default: "Spinoza's Ethics - Interactive Visual Exploration",
    template: "%s | Spinoza's Ethics",
  },
  description:
    "Explore Baruch Spinoza's Ethics through interactive diagrams and AI-powered explanations. Visualize the hierarchy of being, attributes, modes, and the path to blessedness.",
  keywords: [
    "Spinoza",
    "Ethics",
    "Philosophy",
    "Interactive",
    "Visualization",
    "Diagram",
    "Metaphysics",
    "Epistemology",
    "God",
    "Nature",
    "Substance",
    "Baruch Spinoza",
    "Benedict de Spinoza",
    "AI",
    "Artificial Intelligence",
    "Educational",
  ],
  authors: [{ name: "Kneerazon", url: "https://kneeraazon.com" }],
  creator: "Kneerazon",
  publisher: "Kneerazon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Spinoza's Ethics - Interactive Visual Exploration",
    description:
      "Explore Baruch Spinoza's Ethics through interactive diagrams and AI-powered explanations.",
    url: "https://spinoza-ethics.vercel.app",
    siteName: "Spinoza's Ethics Interactive",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Spinoza's Ethics Interactive Diagram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spinoza's Ethics - Interactive Visual Exploration",
    description:
      "Explore Baruch Spinoza's Ethics through interactive diagrams and AI-powered explanations.",
    images: ["/og-image.png"],
    creator: "@kneeraazon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  category: "Education",
  alternates: {
    canonical: "https://spinoza-ethics.vercel.app",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Spinoza's Ethics Interactive",
    description: "Interactive visual exploration of Spinoza's Ethics.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Kneerazon",
      url: "https://kneeraazon.com",
    },
    inLanguage: "en",
    image: "/og-image.png",
    url: "https://spinoza-ethics.vercel.app",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <title>Spinoza Ethics Interactive Diagram</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SpinozaProvider>
            {children}
            <GeometricAdvisor />
          </SpinozaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
