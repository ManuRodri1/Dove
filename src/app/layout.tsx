import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { getHome } from "@/content/home";
import { isLocale } from "@/i18n/config";

import "../../tokens.css";
import "./globals.css";

const display = localFont({
  src: "../../node_modules/@fontsource-variable/playfair-display/files/playfair-display-latin-wght-normal.woff2",
  variable: "--font-display-loaded",
  display: "swap",
  weight: "400 900",
  fallback: ["Georgia"],
  adjustFontFallback: "Times New Roman",
});
const body = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-body-loaded",
  display: "swap",
  weight: "200 800",
  fallback: ["Arial"],
  adjustFontFallback: "Arial",
});
export const metadata: Metadata = {
  robots: { index: process.env.SITE_INDEXABLE === "true", follow: process.env.SITE_INDEXABLE === "true" },
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const value = (await headers()).get("x-dove-locale");
  const locale = isLocale(value) ? value : "en";
  const home = getHome(locale);
  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          {home.ui.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
