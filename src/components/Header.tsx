"use client";
import Image from "next/image";
import { externalRel } from "@/content/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeCookie, type Locale } from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import type { HomeContent } from "@/content/home";
import { doveMedia } from "@/content/dove-media";

export function LanguageSwitch({ locale, full = false }: { locale: Locale; full?: boolean }) {
  const pathname = usePathname();
  return <div className={`language ${full ? "language--full" : ""}`}>
    {(["en", "es"] as const).map((next, index) => <span key={next} className="language-option">
      {index > 0 && <span aria-hidden="true">|</span>}
      <a href={pathname.replace(/^\/(en|es)(?=\/|$)/, `/${next}`)} lang={next} hrefLang={next}
        aria-current={locale === next ? "true" : undefined}
        aria-label={next === "en" ? "English" : "Español"}
        onClick={(event) => {
          document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
          // Full navigation updates the root html lang and avoids stale router caches.
          event.currentTarget.href = `${pathname.replace(/^\/(en|es)(?=\/|$)/, `/${next}`)}${location.search}${location.hash}`;
        }}>{full ? (next === "en" ? "English" : "Español") : next.toUpperCase()}</a>
    </span>)}
  </div>;
}

export default function Header({ home, donateActive = false, activeHref }: { home: HomeContent; donateActive?: boolean; activeHref?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const closeOutside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const closeEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 72rem)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);
  return (
    <header className="site-header" ref={root}>
      <div className="container header-inner">
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
            sizes="(min-width: 768px) 258px, 160px"
            preload
          />
        </Link>
        <nav className="desktop-nav" aria-label={home.ui.mainNav}>
          {home.navigation.map((item) => {
            const childActive = item.children?.some((child) => child.href === activeHref);
            const active = item.href === activeHref || childActive;
            return item.children ? <div className="nav-group" key={item.label}>
              <a href={item.href} className={active ? "nav-active" : undefined}>
                {item.label}<span aria-hidden="true">⌄</span>
              </a>
              <div className="nav-submenu">
                {item.children.map((child) => <a key={child.label} href={child.href}
                  className={child.href === activeHref ? "nav-active" : undefined}
                  aria-current={child.href === activeHref ? "page" : undefined}>{child.label}</a>)}
              </div>
            </div> : <a key={item.label} href={item.href} className={active ? "nav-active" : undefined} aria-current={active ? "page" : undefined}>
              {item.label}
            </a>;
          })}
        </nav>
        <div className="header-actions">
          <LanguageSwitch locale={home.locale} />
          <a
            className={`button button--primary header-donate ${donateActive ? "header-donate--active" : ""}`}
            href={home.actions.donate.href} rel={externalRel(home.actions.donate.href)}
            data-active={donateActive || undefined}
          >
            {home.actions.donate.label}
          </a>
          <button
            className="menu-toggle"
            ref={toggle}
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            aria-label={open ? home.ui.closeMenu : home.ui.openMenu}
          >
            <span aria-hidden="true">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        hidden={!open}
        aria-label={home.ui.mobileNav}
      >
        {home.navigation.map((item) => <div className="mobile-nav-group" key={item.label}>
          <a href={item.href} className={item.href === activeHref ? "nav-active" : undefined} aria-current={item.href === activeHref ? "page" : undefined} onClick={() => setOpen(false)}>
            {item.label}<span aria-hidden="true">→</span>
          </a>
          {item.children?.map((child) => <a className={`mobile-nav-child ${child.href === activeHref ? "nav-active" : ""}`} key={child.label}
            href={child.href} aria-current={child.href === activeHref ? "page" : undefined} onClick={() => setOpen(false)}>{child.label}</a>)}
        </div>)}
        <LanguageSwitch locale={home.locale} full />
      </nav>
    </header>
  );
}
