import type { Locale } from "@/i18n/config";
import type { LegalDocument } from "@/content/legal/privacy";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHome } from "@/content/home";

export function LegalPageLayout({
  locale,
  doc,
}: {
  locale: Locale;
  doc: LegalDocument;
}) {
  const home = getHome(locale);

  return (
    <>
      <Header home={home} />
      <main id="main-content" tabIndex={-1} className="legal-page">
        <header className="section section--paper legal-header">
          <div className="container" style={{ maxWidth: "840px" }}>
            <p className="eyebrow">{doc.eyebrow}</p>
            <h1>{doc.title}</h1>
            <p className="legal-meta" style={{ color: "var(--color-text-muted, #666)", fontSize: "0.95rem", marginBottom: "1rem" }}>
              {locale === "es" ? "Última actualización: " : "Last updated: "}
              {doc.lastUpdated}
            </p>
            <p className="lede" style={{ fontSize: "1.15rem", lineHeight: "1.6" }}>
              {doc.summary}
            </p>
          </div>
        </header>

        <div className="section">
          <div className="container" style={{ maxWidth: "840px" }}>
            <nav className="legal-toc" aria-label={locale === "es" ? "Índice del documento" : "Table of contents"} style={{
              backgroundColor: "var(--color-surface, #f9f8f5)",
              border: "1px solid var(--color-border, #e2ded8)",
              borderRadius: "8px",
              padding: "1.5rem",
              marginBottom: "3rem",
            }}>
              <h2 style={{ fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 0, marginBottom: "0.75rem" }}>
                {locale === "es" ? "Contenido" : "Contents"}
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {doc.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} style={{ textDecoration: "underline", color: "var(--color-primary, #0f4c5c)" }}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <article className="legal-content" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {doc.sections.map((section) => (
                <section key={section.id} id={section.id} className="legal-section">
                  <h2 style={{ fontSize: "1.4rem", marginBottom: "1rem", paddingTop: "1rem" }}>
                    {section.title}
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", lineHeight: "1.7", color: "var(--color-text, #222)" }}>
                    {section.content.map((paragraph, idx) => (
                      <p key={idx} style={{ margin: 0 }}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </main>
      <Footer home={home} />
    </>
  );
}
