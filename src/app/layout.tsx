import "~/styles/globals.css";

import { type Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Solotrading",
  description: "Expense tracking for sole traders",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display-ref",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${syne.variable} ${jakarta.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
