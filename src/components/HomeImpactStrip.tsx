"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./ui";

export type Metric = {
  value: string;
  label: string;
};

type MetricValues = {
  type: "range" | "plus" | "single";
  min: number;
  max?: number;
};

function parseMetric(val: string): MetricValues {
  if (val.includes("–") || val.includes("-")) {
    const parts = val.split(/[–-]/).map((s) => parseInt(s.trim(), 10));
    return { type: "range", min: parts[0] || 0, max: parts[1] || 0 };
  }
  if (val.endsWith("+")) {
    return { type: "plus", min: parseInt(val.replace("+", ""), 10) };
  }
  return { type: "single", min: parseInt(val, 10) };
}

function formatMetricDisplay(parsed: MetricValues, progress: number): string {
  if (progress >= 1) {
    if (parsed.type === "range") return `${parsed.min}–${parsed.max}`;
    if (parsed.type === "plus") return `${parsed.min}+`;
    return `${parsed.min}`;
  }

  // Smooth ease-out cubic curve: 1 - (1 - t)^3
  const easeOut = 1 - Math.pow(1 - progress, 3);

  if (parsed.type === "range") {
    const currentMin = Math.round(parsed.min * easeOut);
    const currentMax = Math.round(parsed.max! * easeOut);
    return `${currentMin}–${currentMax}`;
  }
  if (parsed.type === "plus") {
    const current = Math.round(parsed.min * easeOut);
    return `${current}+`;
  }
  const current = Math.round(parsed.min * easeOut);
  return `${current}`;
}

export default function HomeImpactStrip({
  eyebrow,
  title,
  description,
  metrics,
  id = "impact",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  metrics: readonly Metric[];
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [progresses, setProgresses] = useState<number[]>(() =>
    metrics.map(() => 0)
  );

  useEffect(() => {
    // Jump to final static state immediately if reduced motion is preferred
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setProgresses(metrics.map(() => 1));
      setHasAnimated(true);
      return;
    }

    const element = sectionRef.current;
    if (!element || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 1100; // ms
          const stagger = 100; // ms per item
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            let allDone = true;

            const nextProgresses = metrics.map((_, i) => {
              const itemStart = i * stagger;
              if (elapsed < itemStart) {
                allDone = false;
                return 0;
              }
              const itemElapsed = elapsed - itemStart;
              const itemProgress = Math.min(1, itemElapsed / duration);
              if (itemProgress < 1) allDone = false;
              return itemProgress;
            });

            setProgresses(nextProgresses);

            if (!allDone) {
              requestAnimationFrame(animate);
            } else {
              setProgresses(metrics.map(() => 1));
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasAnimated, metrics]);

  return (
    <section
      className="section home-impact"
      id={id}
      ref={sectionRef}
      aria-labelledby="impact-heading"
    >
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          id="impact-heading"
        />
        <dl className="home-metrics-grid">
          {metrics.map((metric, i) => {
            const parsed = parseMetric(metric.value);
            const currentProgress = progresses[i] ?? 1;
            const displayVal = formatMetricDisplay(parsed, currentProgress);

            return (
              <div key={metric.label} className="home-metric-item">
                <dd className="home-metric-value">
                  {/* Visually animated number — hidden from screen readers */}
                  <span aria-hidden="true">{displayVal}</span>
                  {/* Screen readers receive the static final value */}
                  <span className="sr-only">{metric.value}</span>
                </dd>
                <dt className="home-metric-label">{metric.label}</dt>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
