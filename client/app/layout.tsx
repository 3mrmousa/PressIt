import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutClient } from "./LayoutClient";
import QueryClientWrapper from "@/providers/QueryClientWrapper";
import { GoogleProvider } from "@/providers/GoogleProvider";
import { PaddleProvider } from "@/providers/PaddleProvider";
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
            <PaddleProvider>
              <LayoutClient>{children}</LayoutClient>
            </PaddleProvider>
          </GoogleProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
