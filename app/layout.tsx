import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Percha",
  description: "Tu armario, sin repetir",
  manifest: "/manifest.json",
  applicationName: "Percha",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Percha",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon-256.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf6f2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${playfair.variable} ${plexMono.variable}`}
    >
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
