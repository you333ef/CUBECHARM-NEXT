"use client";

import { useEffect, useRef } from "react";
import "@photo-sphere-viewer/core/index.css";

export default function PhotoSphereViewer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let viewer: any;

    const init = async () => {
      const { Viewer } = await import("@photo-sphere-viewer/core");

      viewer = new Viewer({
        container: containerRef.current as HTMLElement, 
        panorama: src,
        navbar: ["zoom", "move", "fullscreen"],
        loadingTxt: "Loading 360°...",
        defaultZoomLvl: 60,
        mousewheelCtrlKey: true,
      });
    };

    init();

    return () => {
      if (viewer) viewer.destroy();
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] rounded-xl bg-black"
    />
  );
}
