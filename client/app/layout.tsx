import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "./LayoutClient";
import QueryClientWrapper from "@/providers/QueryClientWrapper";
import { GoogleProvider } from "@/providers/GoogleProvider";
import { Toaster } from "react-hot-toast";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";


config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PressIt — Image Compression",
  description: "Compress images beautifully, right in your browser.",
};

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

        <QueryClientWrapper>
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
        </QueryClientWrapper>
      </body>
    </html>
  );
}
