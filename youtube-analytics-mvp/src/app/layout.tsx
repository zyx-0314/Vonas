import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Analytics MVP",
  description: "A minimal techno design for YouTube analytics visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-freight-neo-pro bg-whitesmoke text-ebony-clay`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
