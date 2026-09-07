import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "./LayoutClient";
import { QueryProvider } from "@/providers/QueryProvider";
import { GoogleProvider } from "@/providers/GoogleProvider";
import { Toaster } from "react-hot-toast";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import { getAdminSettings } from "@/features/settings/serverIndex";

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    const res = await getAdminSettings();
    settings = res?.data;
  } catch (error) {}

  return {
    title: settings?.siteName || "PressIt",
    description: settings?.siteDescription || "PressIt - Image Compression",
    icons: {
      icon: settings?.favicon?.secure_url || "/favicon.ico",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-white`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <QueryProvider>
          <GoogleProvider>
            <LayoutClient>{children}</LayoutClient>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#9333ea",
                  color: "#fff",
                  borderRadius: "8px",
                },
                success: {
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#9333ea",
                  },
                },
                error: {
                  style: {
                    background: "#ef4444",
                    color: "#fff",
                  },
                  iconTheme: {
                    primary: "#fff",
                    secondary: "#ef4444",
                  },
                },
              }}
            />
          </GoogleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
