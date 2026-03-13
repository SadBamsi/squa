import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SQUA - Test Task",
  description: "Test Task for SQUA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
