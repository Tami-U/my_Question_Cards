"use client";

/* Warm golden-hour light wash + grain — soft sunlight pooling behind the hero,
   with the same paper grain texture as the cards. Light, not coloured blocks. */

export default function IntroLight() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden" aria-hidden>
      {/* directional warm sun glow from the upper-left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(115% 85% at 28% 4%, rgba(231,170,96,0.26), rgba(231,170,96,0.06) 42%, transparent 64%)",
        }}
      />
      {/* soft dappled light patches */}
      <div
        className="absolute -top-[8%] left-[6%] w-[56vmin] h-[44vmin] rounded-[46%] blur-[64px]"
        style={{ background: "rgba(238,198,142,0.34)" }}
      />
      <div
        className="absolute top-[16%] right-[4%] w-[42vmin] h-[36vmin] rounded-[50%] blur-[58px]"
        style={{ background: "rgba(233,182,124,0.26)" }}
      />
      <div
        className="absolute bottom-[4%] left-[22%] w-[50vmin] h-[32vmin] rounded-[50%] blur-[68px]"
        style={{ background: "rgba(226,166,112,0.2)" }}
      />
      {/* gentle warm shadow pooling at the lower-right so it isn't flat */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 100% at 84% 100%, rgba(86,58,30,0.1), transparent 52%)" }}
      />
      {/* card paper grain */}
      <div className="grain absolute inset-0 opacity-[0.2]" />
    </div>
  );
}
