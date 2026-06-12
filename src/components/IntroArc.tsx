"use client";

/* Thin circular arc with two rust dots, gently orbiting behind the intro hero.
   Line + single accent only — adds quiet motion without clutter. */

export default function IntroArc() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] flex items-center justify-center" aria-hidden>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        className="w-[min(94vw,80vh)] h-[min(94vw,80vh)] max-w-none animate-[spin_80s_linear_infinite]"
      >
        <circle cx="200" cy="200" r="190" stroke="#34291f" strokeOpacity="0.15" strokeWidth="0.7" />
        <circle cx="200" cy="10" r="5.5" fill="#b5482e" />
        <circle cx="387" cy="233" r="4.5" fill="#b5482e" />
      </svg>
    </div>
  );
}
