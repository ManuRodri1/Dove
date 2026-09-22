"use client";

import { useState } from "react";
import { SectionHeading } from "../ui";
import { links } from "@/content/links";

export default function TripadvisorReviews({
  eyebrow,
  heading,
  description,
  buttonLabel = "Load Tripadvisor Reviews",
  viewDirectLabel = "View on Tripadvisor",
}: {
  eyebrow: string;
  heading: string;
  description: string;
  buttonLabel?: string;
  viewDirectLabel?: string;
}) {
  const [activated, setActivated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptFailed, setScriptFailed] = useState(false);

  function handleActivate() {
    if (activated) return;
    setActivated(true);
    setLoading(true);

    const scriptId = "elfsight-platform-script";
    if (document.getElementById(scriptId)) {
      setLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://apps.elfsight.com/p/platform.js";
    script.async = true;
    script.onload = () => {
      setLoading(false);
    };
    script.onerror = () => {
      setLoading(false);
      setScriptFailed(true);
    };
    document.body.appendChild(script);
  }

  return (
    <section
      className="section section--paper travel-reviews"
      aria-labelledby="travel-reviews-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          description={description}
          id="travel-reviews-heading"
        />

        <div className="travel-reviews-embed-container" style={{ marginTop: "2rem" }}>
          {!activated ? (
            <div
              className="travel-reviews-facade"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "220px",
                backgroundColor: "var(--color-surface, #ffffff)",
                border: "1px solid var(--color-border, #e2ded8)",
                borderRadius: "8px",
                padding: "2.5rem 1.5rem",
                textAlign: "center",
                gap: "1rem",
              }}
            >
              <div style={{ fontSize: "2rem" }} aria-hidden="true">
                ⭐
              </div>
              <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text, #1a1a1a)" }}>
                {description}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="button button--primary"
                  onClick={handleActivate}
                >
                  {buttonLabel}
                </button>
                <a
                  className="button button--secondary"
                  href={links.social.tripadvisor}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {viewDirectLabel} ↗
                </a>
              </div>
            </div>
          ) : scriptFailed ? (
            <div className="travel-reviews-fallback" style={{ textAlign: "center", padding: "2rem" }}>
              <p className="travel-reviews-fallback-notice">{description}</p>
              <a
                className="button button--secondary"
                href={links.social.tripadvisor}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginTop: "1rem" }}
              >
                {viewDirectLabel} ↗
              </a>
            </div>
          ) : (
            <div>
              {loading && (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted, #666)" }}>
                  Loading reviews…
                </div>
              )}
              <div
                className="elfsight-app-bcacfda1-56c0-4d8a-a07d-b54acd1c06e3"
                data-elfsight-app-lazy
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
