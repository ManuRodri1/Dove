"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/config";

const YOUTUBE_ID = "VD4kv9FogV8";
const POSTER_URL = "https://i.ytimg.com/vi/VD4kv9FogV8/maxresdefault.jpg";

function playerCommand(frame: HTMLIFrameElement | null, command: "playVideo" | "pauseVideo") {
  frame?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: command, args: [] }),
    "https://www.youtube-nocookie.com"
  );
}

export default function CampaignsHeroVideo({
  locale,
  copy,
}: {
  locale: Locale;
  copy: { eyebrow: string; heading: string; intro: string };
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const userPaused = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [userActivated, setUserActivated] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const isEs = locale === "es";
  const playLabel = isEs ? "Reproducir video" : "Play video";
  const pauseLabel = isEs ? "Pausar video" : "Pause video";
  const videoTitle = isEs ? "Video de campañas de Dove" : "Dove campaigns video";
  const unavailableNotice = isEs
    ? "El video no está disponible. Se muestra una imagen."
    : "Video is unavailable. An image is shown.";

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

    const activate = () => {
      if (!motion.matches && !saveData) {
        setLoaded(true);
        setPlaying(true);
      }
    };

    if (document.readyState === "complete") activate();
    else window.addEventListener("load", activate, { once: true });

    const preference = () => {
      if (motion.matches) {
        userPaused.current = true;
        setPlaying(false);
        playerCommand(frame.current, "pauseVideo");
      }
    };

    const visibility = () => {
      if (document.hidden) playerCommand(frame.current, "pauseVideo");
      else if (!userPaused.current && !motion.matches) {
        setPlaying(true);
        playerCommand(frame.current, "playVideo");
      }
    };

    motion.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);

    return () => {
      window.removeEventListener("load", activate);
      motion.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  function toggle() {
    if (!loaded) {
      userPaused.current = false;
      setUserActivated(true);
      setLoaded(true);
      setPlaying(true);
      return;
    }
    if (playing) {
      userPaused.current = true;
      setPlaying(false);
      playerCommand(frame.current, "pauseVideo");
    } else {
      userPaused.current = false;
      setPlaying(true);
      playerCommand(frame.current, "playVideo");
    }
  }

  const embed = `https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_ID}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3`;

  return (
    <header className={`campaigns-hero ${userActivated ? "is-user-activated" : ""}`} aria-labelledby="campaigns-heading">
      <div className="campaigns-hero-media">
        <Image src={POSTER_URL} alt="" fill sizes="100vw" priority quality={85} />
        {loaded && !failed && (
          <iframe
            ref={frame}
            className={ready ? "is-ready" : ""}
            src={embed}
            title={videoTitle}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            tabIndex={-1}
            onLoad={() => {
              setReady(true);
              if (playing) playerCommand(frame.current, "playVideo");
            }}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className="campaigns-hero-overlay" aria-hidden="true" />
      <div className="container campaigns-hero-content">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="campaigns-heading">{copy.heading}</h1>
        <p className="lede">{copy.intro}</p>
      </div>
      {!failed && (
        <button
          className="campaigns-video-toggle"
          type="button"
          onClick={toggle}
          aria-label={playing ? pauseLabel : playLabel}
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
          <span>{playing ? pauseLabel : playLabel}</span>
        </button>
      )}
      <span className="sr-only" role="status">
        {failed ? unavailableNotice : ""}
      </span>
    </header>
  );
}
