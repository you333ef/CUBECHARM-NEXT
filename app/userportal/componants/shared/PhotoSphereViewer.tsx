"use client";

import { useEffect, useRef } from "react";
import "@photo-sphere-viewer/core/index.css";

interface PhotoSphereViewerProps {
  src: string | null;
  active: boolean;
}

function getProxyUrlIfExternal(url: string | null): string | null {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function PhotoSphereViewer({ src, active }: PhotoSphereViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  const proxiedSrc = getProxyUrlIfExternal(src);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current || !active || !proxiedSrc) return;

    const init = async () => {
      console.log("PhotoSphereViewer: Trying to load src:", proxiedSrc);
      const { Viewer } = await import("@photo-sphere-viewer/core");

      viewerRef.current = new Viewer({
        container: containerRef.current as HTMLElement,
        panorama: proxiedSrc,
        navbar: ["zoom", "move", "fullscreen"],
        loadingTxt: "360°",
        defaultZoomLvl: 60,
        mousewheelCtrlKey: true,
      });
    };

    init();
  }, [active, proxiedSrc]);

  useEffect(() => {
    if (!viewerRef.current || !proxiedSrc) return;
    try {
      viewerRef.current.setPanorama(proxiedSrc);
    } catch (err) {
      console.error("PhotoSphere setPanorama failed", err);
    }
  }, [proxiedSrc]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 rounded-xl bg-black transition-opacity duration-300 ${
        active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    />
  );
}
