"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { doveMedia } from "@/content/dove-media";
import type { HomeContent } from "@/content/home";
import { Action, TextLink } from "./ui";

export default function HeroVideo({ home }: { home: HomeContent }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const userPaused = useRef(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const setSource = () => {
      if (!element.getAttribute("src"))
        element.src =
          window.innerWidth < 768
            ? doveMedia.hero.mobileVideo
            : doveMedia.hero.desktopVideo;
    };
    const applyPreference = () => {
      if (motion.matches || connection?.saveData) {
        element.pause();
        element.removeAttribute("src");
        element.load();
      } else if (!userPaused.current) {
        setSource();
        void element.play().catch(() => {});
      }
    };
    // Delay video bytes until critical page resources have finished loading.
    if (document.readyState === "complete") applyPreference();
    else window.addEventListener("load", applyPreference, { once: true });
    motion.addEventListener("change", applyPreference);
    const visibility = () => {
      if (document.hidden) element.pause();
      else if (!motion.matches && !connection?.saveData && !userPaused.current)
        void element.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("load", applyPreference);
      motion.removeEventListener("change", applyPreference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  const toggleVideo = () => {
    const element = video.current;
    if (!element) return;
    if (playing) {
      userPaused.current = true;
      element.pause();
    } else {
      userPaused.current = false;
      if (!element.getAttribute("src"))
        element.src =
          window.innerWidth < 768
            ? doveMedia.hero.mobileVideo
            : doveMedia.hero.desktopVideo;
      void element.play().catch(() => setFailed(true));
    }
  };
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-media" aria-hidden="true">
        <Image
          src={doveMedia.hero.poster.src}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={85}
        />
        <video
          ref={video}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={doveMedia.hero.poster.src}
          tabIndex={-1}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          className={failed ? "video-failed" : ""}
        />
      </div>
      <div className="container hero-content">
        <p className="location-label">
          <span aria-hidden="true" />
          {home.hero.location}
        </p>
        <h1 id="hero-heading">{home.hero.heading}</h1>
        <p className="hero-description">{home.hero.description}</p>
        <div className="hero-actions">
          <Action link={home.actions.sponsor} />
          <TextLink link={home.actions.story} />
        </div>
      </div>
      {!failed && (
        <button
          className="video-toggle"
          type="button"
          onClick={toggleVideo}
          aria-label={playing ? home.hero.pause : home.hero.play}
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
          <span className="video-toggle-label">
            {playing ? home.ui.pause : home.ui.play}
          </span>
        </button>
      )}
      <span className="sr-only" role="status">
        {failed ? home.hero.unavailable : ""}
      </span>
    </section>
  );
}
