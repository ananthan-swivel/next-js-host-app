import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import AppShell from "@/components/layout";

const MICRO_APP_SCRIPT_ID = "sync-engine-micro-app-script";
const MICRO_APP_SRC =
  "https://d1xospmumlyl1c.cloudfront.net/react-micro-app.js";

declare global {
  interface Window {
    ReactMicroApp?: {
      mount: (el: HTMLElement, props?: any) => void;
      unmount: () => void;
    };
    __AUTH__?: any;
    __MICRO_APP_LOADING__?: Promise<void>;
  }
}

export default function SyncEnginePage() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const slug = useMemo(() => {
    const routeSlug = router.query.slug;

    if (Array.isArray(routeSlug)) {
      return routeSlug;
    }

    if (typeof routeSlug === "string") {
      return [routeSlug];
    }

    return [];
  }, [router.query.slug]);

  useEffect(() => {
    let isActive = true;

    const ensureMicroApp = () => {
      if (window.ReactMicroApp) {
        return Promise.resolve();
      }

      if (window.__MICRO_APP_LOADING__) {
        return window.__MICRO_APP_LOADING__;
      }

      window.__MICRO_APP_LOADING__ = new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById(
          MICRO_APP_SCRIPT_ID,
        ) as HTMLScriptElement | null;

        const cleanup = (
          script: HTMLScriptElement,
          timeoutId: number,
          handleLoad: () => void,
          handleError: () => void,
        ) => {
          window.clearTimeout(timeoutId);
          script.removeEventListener("load", handleLoad);
          script.removeEventListener("error", handleError);
        };

        const handleReady = () => {
          if (window.ReactMicroApp) {
            resolve();
            return;
          }

          reject(
            new Error(
              "Remote script loaded, but window.ReactMicroApp was not defined.",
            ),
          );
        };

        const script = existingScript ?? document.createElement("script");

        const handleLoad = () => {
          script.dataset.loaded = "true";
          cleanup(script, timeoutId, handleLoad, handleError);
          handleReady();
        };

        const handleError = () => {
          cleanup(script, timeoutId, handleLoad, handleError);
          reject(new Error("Failed to load the remote Sync Engine bundle."));
        };

        const timeoutId = window.setTimeout(() => {
          cleanup(script, timeoutId, handleLoad, handleError);
          reject(new Error("Timed out waiting for the Sync Engine bundle."));
        }, 15000);

        if (window.ReactMicroApp) {
          cleanup(script, timeoutId, handleLoad, handleError);
          resolve();
          return;
        }

        if (existingScript?.dataset.loaded === "true") {
          cleanup(script, timeoutId, handleLoad, handleError);
          handleReady();
          return;
        }

        script.addEventListener("load", handleLoad);
        script.addEventListener("error", handleError);

        if (!existingScript) {
          script.id = MICRO_APP_SCRIPT_ID;
          script.src = MICRO_APP_SRC;
          script.type = "text/javascript";
          document.body.appendChild(script);
        }
      }).catch((loadError) => {
        window.__MICRO_APP_LOADING__ = undefined;
        throw loadError;
      });

      return window.__MICRO_APP_LOADING__;
    };

    const mountApp = async () => {
      const el = ref.current;

      if (!el) {
        setError("Sync Engine mount container was not found.");
        setIsLoading(false);
        return;
      }

      setError(null);
      setIsLoading(true);

      try {
        await ensureMicroApp();

        if (!isActive) {
          return;
        }

        window.ReactMicroApp?.mount(el, {
          basePath: "/sync-engine",
          auth: window.__AUTH__,
          path: slug,
        });
        setIsLoading(false);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load Sync Engine.";
        console.error("[SyncEngine] Failed to load micro app", loadError);

        if (isActive) {
          setError(message);
          setIsLoading(false);
        }
      }
    };

    mountApp();

    return () => {
      isActive = false;

      try {
        window.ReactMicroApp?.unmount();
      } catch (unmountError) {
        console.error("[SyncEngine] Failed to unmount micro app", unmountError);
      }
    };
  }, [slug.join("/")]);

  return (
    <AppShell>
      <div>
        {isLoading && (
          <div
            style={{
              marginBottom: 16,
              border: "1px solid #dbeafe",
              borderRadius: 8,
              background: "#eff6ff",
              color: "#1d4ed8",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Loading Sync Engine...
          </div>
        )}
        {error && (
          <div
            style={{
              marginBottom: 16,
              border: "1px solid #fecaca",
              borderRadius: 8,
              background: "#fef2f2",
              color: "#b91c1c",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}
        <div id="micro-root" ref={ref} />
      </div>
    </AppShell>
  );
}
