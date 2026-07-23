import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pink Ledger",
  description: "A fictional-currency anime chat tribute game prototype.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
