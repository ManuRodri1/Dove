import { headers } from "next/headers";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHome } from "@/content/home";
import { isLocale, type Locale } from "@/i18n/config";
import { links } from "@/content/links";

export default async function NotFound() {
  const headerList = await headers();
  const rawLocale = headerList.get("x-dove-locale");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "en";
  const home = getHome(locale);

  const isEs = locale === "es";

  const content = isEs
    ? {
        eyebrow: "Error 404",
        heading: "Página no encontrada",
        description:
          "La página que buscas no existe o ha sido movida. Puedes volver al inicio o explorar nuestras historias de impacto y opciones de contacto.",
        homeCta: "Volver al Inicio",
        storiesCta: "Explorar Historias",
        contactCta: "Ponte en Contacto",
      }
    : {
        eyebrow: "Error 404",
        heading: "Page Not Found",
        description:
          "The page you are looking for does not exist or has been moved. You can return to the homepage or explore our impact stories and contact options.",
        homeCta: "Back to Home",
        storiesCta: "Explore Stories",
        contactCta: "Get in Touch",
      };

  return (
    <>
      <Header home={home} />
      <main id="main" tabIndex={-1} className="section section--paper not-found-page">
        <div
          className="container"
          style={{
            paddingBlock: "var(--space-4xl, 5rem)",
            textAlign: "center",
            maxWidth: "42rem",
            marginInline: "auto",
          }}
        >
          <p
            className="eyebrow"
            style={{
              color: "var(--color-accent-text, #c45d3c)",
              fontWeight: 800,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "var(--space-xs, 0.5rem)",
            }}
          >
            {content.eyebrow}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display-loaded, Playfair Display, serif)",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              color: "var(--color-teal-deep, #0f3738)",
              marginBottom: "var(--space-md, 1.25rem)",
              lineHeight: 1.15,
            }}
          >
            {content.heading}
          </h1>
          <p
            className="lede"
            style={{
              fontSize: "var(--text-lg, 1.125rem)",
              color: "var(--color-ink-muted, #4a5568)",
              marginBottom: "var(--space-xl, 2rem)",
              lineHeight: 1.6,
            }}
          >
            {content.description}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "var(--space-md, 1rem)",
              alignItems: "center",
            }}
          >
            <Link className="button button--primary" href={links.home(locale)}>
              {content.homeCta}
            </Link>
            <Link className="text-link" href={links.stories(locale)}>
              {content.storiesCta} <span aria-hidden="true">→</span>
            </Link>
            <Link className="text-link" href={links.contact(locale)}>
              {content.contactCta} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer home={home} />
    </>
  );
}
