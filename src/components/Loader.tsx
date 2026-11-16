"use client";

import { useEffect, useState } from "react";

// Full-screen loader: the university mark and a moving bar. It fades out once the page has loaded (at least 700 ms),
// so the first paint is the loader on the server and in the browser alike.
export function Loader() {
  const [state, setState] = useState<"on" | "fading" | "off">("on");

  useEffect(() => {
    let timer = 0;
    const finish = () => {
      timer = window.setTimeout(() => setState("fading"), 700);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (state !== "fading") return;
    const t = window.setTimeout(() => setState("off"), 600);
    return () => window.clearTimeout(t);
  }, [state]);

  if (state === "off") return null;
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-page transition-opacity duration-500 ${
        state === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <img src="/brand/logo-up-mark.png" alt="" width={72} height={72} className="loader-logo h-18 w-18 object-contain" />
      <div className="relative h-1 w-44 overflow-hidden rounded-full bg-raised">
        <span className="loader-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-accent" />
      </div>
    </div>
  );
}
