"use client";

import { useState } from "react";
import { links } from "@/content/links";

export function ContactMap({
  title,
  embedUrl,
  directionsLabel,
  viewInteractiveLabel = "View Interactive Map",
}: {
  title: string;
  embedUrl: string;
  directionsLabel: string;
  viewInteractiveLabel?: string;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        title={title}
        src={embedUrl}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <div
      className="contact-map-facade"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "360px",
        backgroundColor: "var(--color-surface, #f6f3ee)",
        border: "1px solid var(--color-border, #e2ded8)",
        borderRadius: "8px",
        padding: "2rem",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <div style={{ fontSize: "2.2rem" }} aria-hidden="true">
        📍
      </div>
      <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text, #1a1a1a)" }}>
        {links.location.label}
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
        <button
          type="button"
          className="button button--primary"
          onClick={() => setActive(true)}
        >
          {viewInteractiveLabel}
        </button>
        <a
          className="button button--secondary"
          href={links.location.directions}
          target="_blank"
          rel="noopener noreferrer"
        >
          {directionsLabel} ↗
        </a>
      </div>
    </div>
  );
}
