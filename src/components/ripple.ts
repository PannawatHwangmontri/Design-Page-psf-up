import type { MouseEvent } from "react";

// Material-style ripple: spawns a circle at the pointer inside the (relative overflow-hidden) host, removes it when done.
export function ripple(e: MouseEvent<HTMLElement>) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = e.currentTarget;
  const r = host.getBoundingClientRect();
  // keyboard clicks report no pointer (detail 0): ripple from the center
  const x = e.detail === 0 ? r.width / 2 : e.clientX - r.left;
  const y = e.detail === 0 ? r.height / 2 : e.clientY - r.top;
  // size so that scale(2.6) reaches the diagonal, i.e. covers the host from any click point
  const d = Math.hypot(r.width, r.height) / 1.3;
  const dot = document.createElement("span");
  dot.className = "ripple";
  dot.style.cssText = `width:${d}px;height:${d}px;left:${x - d / 2}px;top:${y - d / 2}px`;
  dot.addEventListener("animationend", () => dot.remove(), { once: true });
  host.appendChild(dot);
}
