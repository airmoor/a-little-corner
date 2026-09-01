import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Courier_Prime } from "next/font/google";
import "./globals.css";
import PaperDefs from "@/components/paper/PaperDefs";

// Handwriting — the voice of the person who made the wall.
const hand = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hand",
  display: "swap",
});

// A soft literary serif for reading — warm, a little old-fashioned.
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// A typewriter for labels and captions — analog, matter-of-fact.
const type = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-type",
  display: "swap",
});

export const metadata: Metadata = {
  title: "A Little Corner",
  description: "A digital wall where a few small moments are kept.",
};

export const viewport: Viewport = {
  themeColor: "#E7DCC1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${hand.variable} ${serif.variable} ${type.variable}`}
    >
      <body>
        <PaperDefs />
        {children}
      </body>
    </html>
  );
}
