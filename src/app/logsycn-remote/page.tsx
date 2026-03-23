"use client";
import { useEffect, useRef } from "react";

export default function RemoteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://next-js-host-app.vercel.app/logsync/assets/index-D3fdANn-.js"; // must be a JS file
    script.async = true;

    script.onload = () => {
      if ((window as any).renderRemoteApp) {
        (window as any).renderRemoteApp(containerRef.current);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div ref={containerRef} />;
}
