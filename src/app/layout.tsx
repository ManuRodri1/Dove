import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { getHome } from "@/content/home";
import { isLocale } from "@/i18n/config";
import { doveMedia } from "@/content/dove-media";
import { siteUrl } from "@/lib/seo";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema";
import { JsonLd } from "@/components/StructuredData";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dove Youth Development",
    template: "%s | Dove Youth Development",
  },
  description: "Dove Youth Development supports children and young people in Puerto Plata through education, skills development, vocational training, sponsorship, volunteering and community partnerships.",
  applicationName: "Dove Youth Development",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
  robots: { index: process.env.SITE_INDEXABLE === "true", follow: process.env.SITE_INDEXABLE === "true" },
  openGraph: {
    title: "Dove Youth Development",
    description: "Dove Youth Development supports children and young people in Puerto Plata through education, skills development, vocational training, sponsorship, volunteering and community partnerships.",
    siteName: "Dove Youth Development",
    url: "/",
    locale: "en_US",
    type: "website",
    images: [{ url: doveMedia.hero.poster.src, alt: "Dove Youth Development, Puerto Plata" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dove Youth Development",
    description: "Dove Youth Development supports children and young people in Puerto Plata through education, skills development, vocational training, sponsorship, volunteering and community partnerships.",
    images: [doveMedia.hero.poster.src],
  },
};
export const viewport: Viewport = {
  themeColor: "oklch(29% 0.045 190)",
  colorScheme: "light",
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const value = (await headers()).get("x-dove-locale");
  const locale = isLocale(value) ? value : "en";
  const home = getHome(locale);
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationSchema(), getWebSiteSchema()],
  };
  return (
    <html lang={locale} className={`${display.variable} ${body.variable}`}>
      <body>
        <JsonLd data={globalSchema} />
        <a className="skip-link" href="#main">
          {home.ui.skip}
        </a>
        {children}
      </body>
    </html>
  );
}
