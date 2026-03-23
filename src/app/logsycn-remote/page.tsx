"use client";
import { useEffect, useRef } from "react";

export default function RemoteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://d1xospmumlyl1c.cloudfront.net"; // must be a JS file
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
