"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { TeamContent } from "@/content/team";

function command(frame: HTMLIFrameElement | null, action: "playVideo" | "pauseVideo") {
  frame?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: action, args: [] }), "https://www.youtube-nocookie.com");
}

export default function OurTeamHeroVideo({ content }: { content: TeamContent }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const userPaused = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const preference = () => {
      if (motion.matches) {
        userPaused.current = true;
        setPlaying(false);
        command(frame.current, "pauseVideo");
      }
    };
    const visibility = () => {
      if (document.hidden) command(frame.current, "pauseVideo");
      else if (!userPaused.current && !motion.matches && loaded) {
        setPlaying(true);
        command(frame.current, "playVideo");
      }
    };
    motion.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      motion.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [loaded]);

  function toggle() {
    if (!loaded) {
      userPaused.current = false;
      setLoaded(true);
      setPlaying(true);
      return;
    }
    userPaused.current = playing;
    setPlaying(!playing);
    command(frame.current, playing ? "pauseVideo" : "playVideo");
  }

  const video = content.video;
  const embed = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?start=${video.start}&autoplay=1&mute=1&loop=1&playlist=${video.youtubeId}&controls=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3`;

  return <section className="team-hero section" aria-labelledby="team-heading">
    <div className="container team-hero-grid">
      <div className="team-hero-copy">
        <p className="eyebrow">{content.hero.eyebrow}</p>
        <h1 id="team-heading">{content.hero.heading}</h1>
        <p className="team-hero-statement">{content.hero.statement}</p>
        <p className="lede">{content.hero.description}</p>
      </div>
      <figure className="team-hero-visual">
        <div className="team-hero-media">
          <Image src={video.poster} alt="" fill sizes="(min-width: 768px) 58vw, 100vw" priority quality={85} />
          {loaded && !failed && <iframe ref={frame} className={ready ? "is-ready" : ""} src={embed}
            title={content.hero.videoTitle} allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin" tabIndex={-1}
            onLoad={() => { setReady(true); if (playing) command(frame.current, "playVideo"); }}
            onError={() => setFailed(true)} />}
          {!failed && <button className="team-video-toggle" type="button" onClick={toggle}
            aria-label={playing ? content.hero.pause : content.hero.play}>
            <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span><span>{playing ? content.hero.pause : content.hero.play}</span>
          </button>}
        </div>
        <figcaption>{content.hero.caption}</figcaption>
      </figure>
    </div>
    <span className="sr-only" role="status">{failed ? content.hero.unavailable : ""}</span>
  </section>;
}
