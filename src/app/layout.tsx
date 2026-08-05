import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { ColorMode } from "./color-mode";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  // Space Grotesk ships 300–700 only — no 800/900 faces
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Socksmith — Join the waitlist",
  description: "Premium socks, crafted with obsession. Be first in line.",
  icons: {
    icon: "/images/icons/socksmith-icon.jpeg",
    apple: "/images/icons/socksmith-icon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${manrope.variable}`}
    >
      <head>
        <ColorMode />
      </head>
      <body className={manrope.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
