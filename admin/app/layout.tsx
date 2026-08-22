import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryClientWrapper from "../providers/QueryClientWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getAdminSettings } from "../features/admin/serverIndex";

export async function generateMetadata(): Promise<Metadata> {
  let settings;
  try {
    const res = await getAdminSettings();
    settings = res?.data;
  } catch (error) {
  }

  return {
    title: settings?.siteName || "PressIt Admin",
    description: "Admin Dashboard for PressIt",
    icons: {
      icon: settings?.favicon?.secure_url || "/favicon.ico",
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <QueryClientWrapper>
          {children}
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
        </QueryClientWrapper>
      </body>
    </html>
  );
}
