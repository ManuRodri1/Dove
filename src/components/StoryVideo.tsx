"use client";
import { useState } from "react";
import type { StoryVideoData } from "@/content/our-story";

export default function StoryVideo({ video, playLabel, consent }: { video: StoryVideoData; playLabel: string; consent: string }) {
  const [loaded, setLoaded] = useState(false);
  if (!video.verified || !/^[\w-]{11}$/.test(video.youtubeId)) return null;
  return <figure className="story-video">
    <div className="story-video-frame">
      {loaded ? <iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`} title={video.title} loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> :
        <button type="button" onClick={() => setLoaded(true)} aria-label={`${playLabel}: ${video.title}`}><span aria-hidden="true">▷</span><strong>{video.title}</strong><span>{playLabel}</span><small>{consent}</small></button>}
    </div><figcaption>{video.caption}</figcaption>
  </figure>;
}
