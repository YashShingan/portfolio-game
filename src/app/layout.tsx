import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P, VT323 } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixelFont = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const retroFont = VT323({
  variable: "--font-retro",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yash Shingan — Creative Developer | Interactive Portfolio Game",
  description:
    "Portfolio of Yash Shingan, creative developer — presented as a playable 2D pixel world. Explore projects, skills and contact info by walking through a retro RPG. (Static version below for recruiters in a hurry.)",
  keywords: [
    "Yash Shingan",
    "creative developer",
    "portfolio game",
    "interactive portfolio",
    "Phaser 3",
    "Next.js",
    "TypeScript",
    "front-end developer",
  ],
  authors: [{ name: "Yash Shingan" }],
  openGraph: {
    title: "Yash Shingan — Portfolio, but it's a game",
    description:
      "A portfolio you can walk through: 2D pixel world, projects on noticeboards, skills in the garden, a secret in the north-east.",
    type: "website",
    siteName: "Yash Shingan — Portfolio Game",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yash Shingan — Portfolio, but it's a game",
    description:
      "A portfolio you can walk through: 2D pixel world, projects on noticeboards, skills in the garden.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pixelFont.variable} ${retroFont.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-center" offset={72} />
      </body>
    </html>
  );
}
