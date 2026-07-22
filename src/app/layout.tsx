import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhlenbruch Insurance Agency",
  description: "Protection you can trust from Muhlenbruch Insurance Agency in Dows, Iowa."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
