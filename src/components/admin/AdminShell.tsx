"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { doveMedia } from "@/content/dove-media";

const navigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/stories", label: "Stories" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
];

export default function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { displayName: string; email: string; role: "admin" | "editor" };
}) {
  const pathname = usePathname();
  return (
    <div className="admin-root">
      <aside className="admin-sidebar" aria-label="CMS navigation">
        <Link className="admin-brand" href="/admin" aria-label="Dove CMS dashboard">
          <Image
            src={doveMedia.logo.main.src}
            alt={doveMedia.logo.main.alt}
            width={160}
            height={36}
            style={{ width: "auto", height: "30px", objectFit: "contain" }}
            priority
          />
          <span className="admin-brand-tag">CMS</span>
        </Link>
        <nav className="admin-nav">
          {navigation.map((item) => {
            const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="admin-stage">
        <header className="admin-topbar">
          <Link className="admin-mobile-brand" href="/admin" aria-label="Dove CMS dashboard">
            <Image
              src={doveMedia.logo.main.src}
              alt={doveMedia.logo.main.alt}
              width={140}
              height={32}
              style={{ width: "auto", height: "24px", objectFit: "contain" }}
            />
            <span className="admin-brand-tag">CMS</span>
          </Link>
          <div className="admin-user">
            <span><strong>{user.displayName}</strong><small>{user.email}</small></span>
            <span className="admin-role">{user.role}</span>
            <form action="/api/auth/signout" method="POST">
              <button className="admin-text-button" type="submit">Sign out</button>
            </form>
          </div>
        </header>
        <main id="main" className="admin-main">{children}</main>
      </div>
    </div>
  );
}
