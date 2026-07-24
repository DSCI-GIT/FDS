import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pink Ledger",
  description: "A soft fictional social world of private profiles, evolving rooms, attentive chat and collectible art.",
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
