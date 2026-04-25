"use client";

interface VideoBackgroundProps {
  src?: string;
  youtubeId?: string;
  poster?: string;
  overlayOpacity?: number;
  className?: string;
}

export default function VideoBackground({
  src,
  youtubeId,
  poster,
  overlayOpacity = 0.5,
  className = "",
}: VideoBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {youtubeId ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&disablekb=1&playlist=${youtubeId}&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`}
          title="Background video"
          allow="autoplay; encrypted-media"
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "177.78vh",
            height: "100%",
            minWidth: "100%",
            minHeight: "56.25vw",
            border: "none",
            pointerEvents: "none",
          }}
        />
      ) : src ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : poster ? (
        /* Image-only fallback */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : null}

      <div
        className="absolute inset-0"
        style={{ background: "#0A0A0A", opacity: overlayOpacity }}
      />
    </div>
  );
}
