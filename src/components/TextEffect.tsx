"use client";

import { useMemo, useSyncExternalStore, type CSSProperties, type ElementType } from "react";

type Part = { space: string } | { chars: string[] };

// Words via Intl.Segmenter (knows Thai word boundaries), then graphemes inside each word, so Thai vowels
// and tone marks stay attached to their consonant. Punctuation is merged into the preceding word.
function split(text: string): Part[] {
  const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  const parts: Part[] = [];
  for (const { segment, isWordLike } of new Intl.Segmenter(undefined, { granularity: "word" }).segment(text)) {
    const chars = [...graphemes.segment(segment)].map((g) => g.segment);
    const prev = parts[parts.length - 1];
    if (/^\s+$/.test(segment)) parts.push({ space: segment });
    else if (!isWordLike && prev && "chars" in prev) prev.chars.push(...chars);
    else parts.push({ chars });
  }
  return parts;
}

const noop = () => () => {};

// Per-character reveal (rotateX 90deg -> 0, rise 10px, fade); styles in globals.css (.text-char).
export function TextEffect({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  step = 50,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number; // ms before the first character
  step?: number; // ms between characters
}) {
  // plain (hidden) text on the server and during hydration, split text after mount
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const parts = useMemo(() => (mounted ? split(text) : null), [mounted, text]);
  let n = 0;
  return (
    <Tag className={`${className ?? ""} ${parts ? "" : "text-effect-pending"}`} style={{ "--d": `${delay}ms`, "--s": `${step}ms` } as CSSProperties}>
      {parts ? (
        <>
          <span className="sr-only">{text}</span>
          {/* key = text, so a language switch remounts the spans and replays the effect */}
          <span key={text} aria-hidden="true">
            {parts.map((p, k) =>
              "space" in p ? (
                p.space
              ) : (
                <span key={k} className="inline-block whitespace-nowrap">
                  {p.chars.map((c, j) => (
                    <span key={j} className="text-char" style={{ "--i": n++ } as CSSProperties}>
                      {c}
                    </span>
                  ))}
                </span>
              ),
            )}
          </span>
        </>
      ) : (
        text
      )}
    </Tag>
  );
}
