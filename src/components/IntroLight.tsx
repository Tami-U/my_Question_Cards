"use client";

/* Even warm light wash + grain — soft, balanced sunlight behind the hero,
   with the same paper grain as the cards. Light, not coloured blocks. */

export default function IntroLight() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden>
      {/* even, centred warm wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 105% at 50% 32%, rgba(231,178,110,0.15), rgba(231,178,110,0.04) 56%, transparent 80%)",
        }}
      />
      {/* two soft, balanced light pools (diagonal) so it doesn't clump to one side */}
      <div
        className="absolute top-[12%] left-[16%] w-[52vmin] h-[42vmin] rounded-[50%] blur-[72px]"
        style={{ background: "rgba(238,200,148,0.15)" }}
      />
      <div
        className="absolute bottom-[14%] right-[14%] w-[52vmin] h-[42vmin] rounded-[50%] blur-[72px]"
        style={{ background: "rgba(232,184,128,0.13)" }}
      />
      {/* card paper grain */}
      <div className="grain absolute inset-0 opacity-[0.2]" />
    </div>
  );
}
