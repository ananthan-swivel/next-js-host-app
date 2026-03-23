"use client";
import { useEffect, useState } from "react";

export default function RemoteComponent() {
  const [Comp, setComp] = useState<any>(null);

  useEffect(() => {
     // @ts-ignore
    import("https://d1xospmumlyl1c.cloudfront.net").then((mod) =>
      setComp(() => mod.default),
    );
  }, []);

  if (!Comp) return <div>Loading...</div>;

  return <Comp />;
}
