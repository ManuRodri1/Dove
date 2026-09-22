"use client";

import { useState } from "react";

export function StoryVideoEmbed({
  videoId,
  title,
  startTime,
}: {
  videoId: string;
  title?: string;
  startTime?: number;
}) {
  const [loaded, setLoaded] = useState(false);

  if (!videoId || !/^[\w-]{11}$/.test(videoId)) return null;

  if (loaded) {
    return (
      <div className="story-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&start=${startTime || 0}`}
          title={title || "Dove video"}
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  const posterUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="story-video story-video--facade">
      <button
        type="button"
        className="story-video-facade-btn"
        onClick={() => setLoaded(true)}
        aria-label={`Play video: ${title || "Dove video"}`}
        style={{
          backgroundImage: `url(${posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            color: "#ffffff",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            transition: "transform 0.2s ease",
          }}
          aria-hidden="true"
        >
          ▷
        </span>
      </button>
    </div>
  );
}
