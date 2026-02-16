import type { Metadata } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";

export const metadata: Metadata = {
  title: "Three-Body Problem Simulator | Interactive Gravitational Physics",
  description:
    "Explore the chaotic beauty of the three-body problem with this interactive 2D/3D gravitational simulator. Experiment with stable orbits, tweak parameters, and discover the mathematics behind celestial mechanics.",
  keywords: [
    "three body problem",
    "gravitational simulation",
    "physics simulator",
    "orbital mechanics",
    "n-body problem",
    "celestial mechanics",
    "three.js",
    "interactive simulation",
  ],
  authors: [{ name: "Henry Tolenaar" }],
  creator: "Henry Tolenaar",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    title: "Three-Body Problem Simulator",
    description:
      "Interactive 2D/3D gravitational simulation of the three-body problem. Explore chaotic orbits and stable configurations.",
    siteName: "Three-Body Problem Simulator",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Three-Body Problem Simulator",
    description:
      "Interactive 2D/3D gravitational simulation of the three-body problem.",
    creator: "@henrytolenaar",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://three-body-problem.vercel.app"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Three-Body Problem Simulator",
  description:
    "Interactive 2D/3D gravitational simulation of the three-body problem with adjustable parameters and preset stable configurations.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Henry Tolenaar",
  },
  educationalUse: "Demonstration",
  learningResourceType: "Simulation",
  interactivityType: "active",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
