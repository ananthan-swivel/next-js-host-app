import { useEffect, useRef } from "react";
import RootLayout from "../layout";
import { useParams } from "next/navigation";

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

// Accept params from Next.js App Router
export default function SyncEnginePage({
  params,
}: { params?: { slug?: string[] } } = {}) {
  const ref = useRef<HTMLDivElement | null>(null);

  // If params is undefined or slug is undefined, this is /sync-engine
  // Optionally, you can render something special for the base route
  // For now, just proceed as normal

  useEffect(() => {
    let isMounted = true;

    const loadScript = (src: string, type = "module") =>
      new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.type = type;
        s.crossOrigin = "anonymous";
        s.onload = () => resolve();
        s.onerror = reject;
        document.body.appendChild(s);
      });

    const mountApp = (el: HTMLElement) => {
      console.log("[SyncEngine] 🚀 Mounting React app");

      window.ReactMicroApp?.mount(el, {
        basePath: "/sync-engine",
        auth: window.__AUTH__,
      });
    };

    // ✅ CRITICAL: wait until micro app is available
    const waitForMicroAppAndMount = (el: HTMLElement) => {
      const tryMount = () => {
        if (!isMounted) return;

        if (window.ReactMicroApp) {
          console.log("[SyncEngine] ✅ Micro app ready");
          mountApp(el);
        } else {
          console.log("[SyncEngine] ⏳ Waiting for micro app...");
          setTimeout(tryMount, 50);
        }
      };

      tryMount();
    };

    const init = async () => {
      const el = ref.current;

      if (!el) {
        console.log("[SyncEngine] ⏳ Waiting for ref...");
        setTimeout(init, 50);
        return;
      }

      const isDev = false; // Set to true if you want to load from Vite dev server';

      try {
        if (!window.__MICRO_APP_LOADED__) {
          window.__MICRO_APP_LOADED__ = true;

          console.log("[SyncEngine] Injecting scripts...");

          if (isDev) {
            // ✅ Vite HMR client
            await loadScript("http://127.0.0.1:5173/@vite/client");

            // ✅ App entry (NO react-refresh)
            await loadScript(
              "http://127.0.0.1:5173/src/main.tsx?t=" + Date.now(),
            );
          } else {
            // ✅ Production bundle
            await loadScript(
              "https://d1xospmumlyl1c.cloudfront.net/react-micro-app.js",
              "text/javascript",
            );
          }

          console.log("[SyncEngine] ✅ Scripts loaded");
        }

        waitForMicroAppAndMount(el);
      } catch (err) {
        console.error("[SyncEngine] ❌ Failed to load micro app", err);
      }
    };

    init();

    // console.log('[SyncEngine] 🧩 SyncEnginePage initialized');
    return () => {
      isMounted = false;
      window.ReactMicroApp?.unmount();
    };
  }, []);

  return (
    <RootLayout>
      <div id="micro-root" ref={ref} />
    </RootLayout>
  );
}
