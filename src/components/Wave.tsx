export // wavy edge between two sections: the top strip overlaps the section above, and the wave line drifts sideways forever.
// The fill comes from the text-* class (currentColor), so it matches the section it sits on. Off with reduced motion.
function Wave({ fill }: { fill: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 -top-12 z-10 h-12 overflow-hidden md:-top-16 md:h-16 ${fill}`}>
      <svg className="wave-track absolute left-0 top-0 h-full w-[200%]" viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path fill="currentColor" fillOpacity="0.45" className="wave-track-slow" d="M0,70 C200,20 400,120 600,70 S1000,20 1200,70 S1600,120 1800,70 S2200,20 2400,70 L2400,120 L0,120 Z" />
        <path fill="currentColor" d="M0,90 C200,50 400,110 600,90 S1000,50 1200,90 S1600,110 1800,90 S2200,50 2400,90 L2400,120 L0,120 Z" />
      </svg>
    </div>
  );
}
