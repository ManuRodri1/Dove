"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { DonateContent } from "@/content/donate";
import { Action, TextLink } from "./ui";

function playerCommand(frame: HTMLIFrameElement | null, command: "playVideo" | "pauseVideo") {
  frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "https://www.youtube-nocookie.com");
}

export default function DonateHeroVideo({ content }: { content: DonateContent }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const userPaused = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [userActivated, setUserActivated] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

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

  const embed = `https://www.youtube-nocookie.com/embed/${content.video.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${content.video.youtubeId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3`;

  return (
    <section className={`donate-hero ${userActivated ? "is-user-activated" : ""}`} aria-labelledby="donate-heading">
      <div className="donate-hero-media">
        <Image src={content.video.poster} alt="" fill sizes="100vw" preload quality={85} />
        {loaded && !failed && <iframe
          ref={frame}
          className={ready ? "is-ready" : ""}
          src={embed}
          title={content.hero.videoTitle}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          tabIndex={-1}
          onLoad={() => {
            setReady(true);
            if (playing) playerCommand(frame.current, "playVideo");
          }}
          onError={() => setFailed(true)}
        />}
      </div>
      <div className="donate-hero-overlay" aria-hidden="true" />
      <div className="container donate-hero-content">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="donate-heading">{content.hero.heading}</h1>
        <p>{content.hero.description}</p>
        <div className="donate-hero-actions">
          <Action link={content.heroPrimary} />
          <TextLink link={content.heroSecondary} />
        </div>
      </div>
      {!failed && <button className="donate-video-toggle" type="button" onClick={toggle} aria-label={playing ? content.hero.pause : content.hero.play}>
        <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
        <span>{playing ? content.hero.pause : content.hero.play}</span>
      </button>}
      <span className="sr-only" role="status">{failed ? content.hero.unavailable : ""}</span>
    </section>
  );
}
