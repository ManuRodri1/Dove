import Image from "next/image";
import { externalRel } from "@/content/links";
import type { ReactNode } from "react";
import type { Destination } from "@/content/home";
import type { DoveImage } from "@/content/dove-media";

// Links remain native, keyboard-accessible anchors.
export function Action({
  link,
  variant = "primary",
}: {
  link: Destination;
  variant?: "primary" | "secondary" | "teal";
}) {
  return (
    <a className={`button button--${variant}`} href={link.href} rel={externalRel(link.href)}>
      {link.label}
    </a>
  );
}
export function TextLink({
  link,
  className = "",
}: {
  link: Destination;
  className?: string;
}) {
  return (
    <a className={`text-link ${className}`} href={link.href} rel={externalRel(link.href)}>
      {link.label}
      <span aria-hidden="true">→</span>
    </a>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description && <p className="lede">{description}</p>}
    </div>
  );
}
export function Photo({
  media,
  sizes = "(min-width: 768px) 45vw, 100vw",
  className = "",
  children,
  preload = false,
}: {
  media: DoveImage;
  sizes?: string;
  className?: string;
  children?: ReactNode;
  preload?: boolean;
}) {
  return (
    <figure className={`photo ${className}`}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        priority={preload}
        sizes={sizes}
        style={{ objectPosition: media.position }}
      />
      {children}
    </figure>
  );
}
export function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    education: (
      <>
        <path d="m2 9 10-5 10 5-10 5-10-5Z" />
        <path d="M6 11v6l6 3 6-3v-6M22 9v7" />
      </>
    ),
    tools: (
      <>
        <path d="m5 3 15 15-4 4L2 8l3-5Z" />
        <path d="m5 8 3-3M10 13l3-3M15 18l3-3" />
      </>
    ),
    program: (
      <>
        <path d="m12 2 4 7H8l4-7Z" />
        <rect x="3" y="14" width="6" height="6" />
        <circle cx="17" cy="17" r="3" />
      </>
    ),
    partner: (
      <>
        <path d="m2 10 5-6 5 2 5-2 5 6-4 4M6 14l6 6 3-3M7 10l4-3 4 4-3 3-3-3M2 10l4 4M18 14l-3 3" />
      </>
    ),
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.partner}
    </svg>
  );
}
