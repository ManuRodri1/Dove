import Image from "next/image";
import { externalRel } from "@/content/links";
import Link from "next/link";
import type { HomeContent } from "@/content/home";
import { doveMedia } from "@/content/dove-media";
import { LanguageSwitch } from "./Header";

export default function Footer({ home }: { home: HomeContent }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <Link
              className="brand"
              href={`/${home.locale}`}
              aria-label={`Dove Youth Development — ${home.ui.home}`}
            >
              <Image
                src={doveMedia.logo.main.src}
                alt={doveMedia.logo.main.alt}
                width={310}
                height={60}
                sizes="258px"
              />
            </Link>
            <p>{home.footer.mission}</p>
            <a className="text-link" href={home.footer.contact.href}>
              {home.footer.contact.label}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <nav aria-label={home.ui.footerNav}>
            <h2>{home.footer.navigationLabel}</h2>
            {home.navigation.map((link) => (
              <a href={link.href} rel={externalRel(link.href)} key={link.label}>
                {link.label}
              </a>
            ))}
            <a href={home.footer.contact.href}>{home.footer.contact.label}</a>
          </nav>
          <nav aria-label={home.ui.supportNav}>
            <h2>{home.footer.supportLabel}</h2>
            {home.footer.support.map((link) => (
              <a href={link.href} rel={externalRel(link.href)} key={link.label}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="footer-location">
            <h2>{home.footer.locationLabel}</h2>
            <p>
              {home.footer.location}
              <br />
              {home.footer.country}
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {home.footer.copyright}
          </p>
          <div>
            <LanguageSwitch locale={home.locale} full />
            <a href={home.footer.privacy.href} rel={externalRel(home.footer.privacy.href)}>{home.footer.privacy.label}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
