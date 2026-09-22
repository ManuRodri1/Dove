"use client";
import Image from "next/image";
import { externalRel, links } from "@/content/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeCookie, type Locale } from "@/i18n/config";
import { useEffect, useRef, useState } from "react";
import type { HomeContent } from "@/content/home";
import { doveMedia } from "@/content/dove-media";

type NavigationItem = HomeContent["navigation"][number];

function slugify(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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

function LegacyHeader({ home, donateActive = false, activeHref }: { home: HomeContent; donateActive?: boolean; activeHref?: string }) {
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

export default function Header({ home, donateActive = false, activeHref }: { home: HomeContent; donateActive?: boolean; activeHref?: string }) {
  const [openDesktop, setOpenDesktop] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const root = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const desktopTriggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelLinks = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    let frame = 0;
    const updateScrolled = () => { frame = 0; setScrolled(window.scrollY > 64); };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateScrolled); };
    updateScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) { setOpenDesktop(null); setOpenMobile(null); }
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (openDesktop) { const trigger = desktopTriggers.current[openDesktop]; setOpenDesktop(null); trigger?.focus(); }
      if (openMobile) { setOpenMobile(null); toggle.current?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 72rem)");
    const onResize = () => {
      if (desktop.matches) setOpenMobile(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
      desktop.removeEventListener("change", onResize);
    };
  }, [openDesktop, openMobile]);

  useEffect(() => {
    if (openMobile !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [openMobile]);

  const closeMobile = () => { setOpenMobile(null); toggle.current?.focus(); };
  const openFromKeyboard = (item: NavigationItem, event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const id = slugify(item.label);
    setOpenDesktop(id);
    window.requestAnimationFrame(() => panelLinks.current[id]?.focus());
  };

  const renderDesktopItem = (item: NavigationItem) => {
    const id = slugify(item.label);
    const active = item.children?.some((child) => child.href === activeHref) || item.href === activeHref;
    if (!item.children) return <Link key={item.label} href={item.href} className={active ? "nav-active" : undefined} aria-current={active ? "page" : undefined}>{item.label}</Link>;
    const isOpen = openDesktop === id;
    return <div className="nav-group" key={item.label} onPointerEnter={() => setOpenDesktop(id)} onPointerLeave={() => setOpenDesktop(null)}>
      <button ref={(element) => { desktopTriggers.current[id] = element; }} type="button" className={`nav-trigger ${active ? "nav-active" : ""}`} aria-expanded={isOpen} aria-controls={`desktop-menu-${id}`} aria-haspopup="true" onClick={() => setOpenDesktop(isOpen ? null : id)} onKeyDown={(event) => openFromKeyboard(item, event)}>
        {item.label}<span className="nav-chevron" aria-hidden="true">⌄</span>
      </button>
      <div id={`desktop-menu-${id}`} className="nav-submenu" hidden={!isOpen} onPointerEnter={() => setOpenDesktop(id)}>
        <div className="nav-submenu-intro"><span className="nav-submenu-kicker">{item.label}</span>{item.description && <p>{item.description}</p>}</div>
        <div className="nav-submenu-links">
          {item.children.map((child, index) => <Link key={child.label} href={child.href} ref={(element) => { if (index === 0) panelLinks.current[id] = element; }} className={child.href === activeHref ? "nav-active" : undefined} aria-current={child.href === activeHref ? "page" : undefined} onClick={() => setOpenDesktop(null)}><span>{child.label}</span>{child.description && <small>{child.description}</small>}</Link>)}
        </div>
      </div>
    </div>;
  };

  return <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`} ref={root}>
    <div className="container header-inner">
      <Link className="brand" href={links.home(home.locale)} aria-label={`Dove Youth Development — ${home.ui.home}`}><Image src={doveMedia.logo.main.src} alt={doveMedia.logo.main.alt} width={310} height={60} sizes="(min-width: 1024px) 232px, 136px" priority /></Link>
      <nav className="desktop-nav" aria-label={home.ui.mainNav}>{home.navigation.map(renderDesktopItem)}</nav>
      <div className="header-actions">
        <div className="desktop-language"><LanguageSwitch locale={home.locale} /></div>
        <Link className={`button button--primary header-donate ${donateActive ? "header-donate--active" : ""}`} href={links.donate(home.locale)} aria-current={donateActive ? "page" : undefined}>{home.actions.donate.label}</Link>
        <button className="menu-toggle" ref={toggle} type="button" aria-controls="mobile-navigation" aria-expanded={openMobile !== null} onClick={() => setOpenMobile(openMobile ? null : "__root__")} aria-label={openMobile ? home.ui.closeMenu : home.ui.openMenu}><span aria-hidden="true">{openMobile ? "×" : "☰"}</span></button>
      </div>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" hidden={openMobile === null} aria-label={home.ui.mobileNav}>
      {home.navigation.map((item) => {
        const id = slugify(item.label);
        if (!item.children) return <Link key={item.label} className={item.href === activeHref ? "nav-active" : undefined} href={item.href} aria-current={item.href === activeHref ? "page" : undefined} onClick={closeMobile}>{item.label}</Link>;
        const expanded = openMobile === id;
        return <div className="mobile-nav-group" key={item.label}><button type="button" aria-expanded={expanded} aria-controls={`mobile-menu-${id}`} onClick={() => setOpenMobile(expanded ? null : id)}>{item.label}<span className="nav-chevron" aria-hidden="true">⌄</span></button><div id={`mobile-menu-${id}`} className="mobile-nav-children" hidden={!expanded}>{item.children.map((child) => <Link className={child.href === activeHref ? "nav-active" : ""} key={child.label} href={child.href} aria-current={child.href === activeHref ? "page" : undefined} onClick={closeMobile}>{child.label}</Link>)}</div></div>;
      })}
      <div className="mobile-nav-utilities"><LanguageSwitch locale={home.locale} full /><Link className="button button--primary mobile-nav-donate" href={links.donate(home.locale)} onClick={closeMobile}>{home.actions.donate.label}</Link></div>
    </nav>
  </header>;
}
