"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { VolunteerContent } from "@/content/volunteer";
import { Action, TextLink } from "./ui";

function command(frame: HTMLIFrameElement | null, action: "playVideo" | "pauseVideo") {
  frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: action, args: [] }), "https://www.youtube-nocookie.com");
}

export default function VolunteerHeroVideo({ content }: { content: VolunteerContent }) {
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
        command(frame.current, "pauseVideo");
      }
    };
    const visibility = () => {
      if (document.hidden) command(frame.current, "pauseVideo");
      else if (!userPaused.current && !motion.matches) {
        setPlaying(true);
        command(frame.current, "playVideo");
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
    userPaused.current = playing;
    setPlaying(!playing);
    command(frame.current, playing ? "pauseVideo" : "playVideo");
  }

  const video = content.media.hero;
  const embed = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?start=18&autoplay=1&mute=1&loop=1&playlist=${video.youtubeId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3`;
  return <section className={`volunteer-hero ${userActivated ? "is-user-activated" : ""}`} aria-labelledby="volunteer-heading">
    <div className="volunteer-hero-media">
      <Image src={video.poster} alt="" fill sizes="100vw" preload quality={85} />
      {loaded && !failed && <iframe ref={frame} className={ready ? "is-ready" : ""} src={embed}
        title={content.hero.videoTitle} allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin" tabIndex={-1}
        onLoad={() => { setReady(true); if (playing) command(frame.current, "playVideo"); }}
        onError={() => setFailed(true)} />}
    </div>
    <div className="volunteer-hero-overlay" aria-hidden="true" />
    <div className="container volunteer-hero-content">
      <p className="eyebrow">{content.hero.eyebrow}</p>
      <h1 id="volunteer-heading">{content.hero.heading}</h1>
      <p>{content.hero.description}</p>
      <div className="volunteer-hero-actions"><Action link={content.heroLinks.primary} /><TextLink link={content.heroLinks.secondary} /></div>
    </div>
    {!failed && <button className="volunteer-video-toggle" type="button" onClick={toggle}
      aria-label={playing ? content.hero.pause : content.hero.play}>
      <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span><span>{playing ? content.hero.pause : content.hero.play}</span>
    </button>}
    <span className="sr-only" role="status">{failed ? content.hero.unavailable : ""}</span>
  </section>;
}
