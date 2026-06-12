"use client";

/* Open (partial) arc with two fixed rust dots behind the intro hero.
   Static line + single accent — quiet, no motion, minimal distraction. */

export default function IntroArc() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] flex items-center justify-center" aria-hidden>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="w-[min(94vw,80vh)] h-[min(94vw,80vh)] max-w-none"
      >
        {/* open arc — sweeps the long way (left/bottom), leaving the top-right open */}
        <path
          d="M 200 10 A 190 190 0 1 0 387 233"
          stroke="#34291f"
          strokeOpacity="0.15"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <circle cx="200" cy="10" r="5" fill="#b5482e" />
      </svg>
    </div>
  );
}
