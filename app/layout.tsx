import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./figma-polish.css";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

export const metadata: Metadata = {
  title: "Percha",
  description: "Tu armario, sin repetir",
  manifest: "/manifest.json",
  applicationName: "Percha",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Percha" },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="percha-fonts">
      <body>{children}<ServiceWorkerRegister /></body>
    </html>
  );
}
