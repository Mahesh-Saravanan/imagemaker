import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Collage Maker — A4 Print Ready",
  description: "Create beautiful, customizable image collages perfectly sized for A4 paper printing. Upload images, configure grids, and print seamlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
