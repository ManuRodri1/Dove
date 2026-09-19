"use client";

import Script from "next/script";
import { useState } from "react";
import { SectionHeading } from "../ui";

export default function TripadvisorReviews({
  eyebrow,
  heading,
  description,
}: {
  eyebrow: string;
  heading: string;
  description: string;
}) {
  const [scriptFailed, setScriptFailed] = useState(false);

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

        <div className="travel-reviews-embed-container">
          <Script
            src="https://apps.elfsight.com/p/platform.js"
            strategy="lazyOnload"
            id="elfsight-platform-script"
            onError={() => setScriptFailed(true)}
          />

          {!scriptFailed ? (
            <div
              className="elfsight-app-bcacfda1-56c0-4d8a-a07d-b54acd1c06e3"
              data-elfsight-app-lazy
            />
          ) : (
            <p className="travel-reviews-fallback-notice">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
