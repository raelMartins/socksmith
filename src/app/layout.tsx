import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { ColorMode } from "./color-mode";
import { Providers } from "./providers";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorMode />
      </head>
      <body className={`${fraunces.variable} ${dmSans.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
