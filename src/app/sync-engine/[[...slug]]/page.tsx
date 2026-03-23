"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    ReactMicroApp?: {
      mount: (el: HTMLElement, props?: any) => void;
      unmount: () => void;
    };
    __AUTH__?: any;
    __MICRO_APP_LOADED__?: boolean;
  }
}

export default function SyncEnginePage({
  params,
}: { params?: { slug?: string[] } } = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadScript = (src: string, type = "module") =>
      new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.type = type;
        script.crossOrigin = "anonymous";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.body.appendChild(script);
      });

    const mountApp = (el: HTMLElement) => {
      window.ReactMicroApp?.mount(el, {
        basePath: "/sync-engine",
        auth: window.__AUTH__,
        path: params?.slug ?? [],
      });
    };

    const waitForMicroAppAndMount = (el: HTMLElement) => {
      const tryMount = () => {
        if (!isMounted) {
          return;
        }

        if (window.ReactMicroApp) {
          mountApp(el);
          return;
        }

        setTimeout(tryMount, 50);
      };

      tryMount();
    };

    const init = async () => {
      const el = ref.current;

      if (!el) {
        setTimeout(init, 50);
        return;
      }

      const isDev = false;

      try {
        if (!window.__MICRO_APP_LOADED__) {
          window.__MICRO_APP_LOADED__ = true;

          if (isDev) {
            await loadScript(
              "https://d1xospmumlyl1c.cloudfront.net/react-micro-app.js",
            );
            await loadScript(
              `https://d1xospmumlyl1c.cloudfront.net/react-micro-app.js?t=${Date.now()}`,
            );
          } else {
            await loadScript(
              "https://d1xospmumlyl1c.cloudfront.net/react-micro-app.js",
              "text/javascript",
            );
          }
        }

        waitForMicroAppAndMount(el);
      } catch (error) {
        console.error("[SyncEngine] Failed to load micro app", error);
      }
    };

    init();

    return () => {
      isMounted = false;
      window.ReactMicroApp?.unmount();
    };
  }, [params]);

  return <div id="micro-root" ref={ref} />;
}
