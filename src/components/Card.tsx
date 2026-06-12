"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sound } from "@/lib/sound";

interface CardProps {
  question: string;
  category: string;
  hint: string;
  tapLabel: string;
  seed: number;
  isBalance?: boolean;
}

/* per-deck colour fields — Question runs warm (terracotta), Balance runs cool (smoke).
   [primary, secondary, dark, soft] */
const WARM = [
  "rgba(178, 66, 40, 0.74)", // terracotta
  "rgba(150, 166, 26, 0.55)", // olive
  "rgba(38, 36, 32, 0.78)", // char
  "rgba(201, 128, 99, 0.5)", // clay
];
const COOL = [
  "rgba(82, 99, 112, 0.72)", // smoke blue
  "rgba(120, 150, 150, 0.5)", // cool sage
  "rgba(38, 36, 32, 0.78)", // char
  "rgba(95, 115, 140, 0.5)", // slate
];

type Shape = { ci: number; top: number; left: number; w: number; h: number; rot: number; round?: boolean };

const COMPOSITIONS: Shape[][] = [
  [
    { ci: 1, top: 18, left: -6, w: 62, h: 34, rot: -3 },
    { ci: 2, top: 40, left: 30, w: 26, h: 52, rot: 11 },
    { ci: 0, top: 66, left: 8, w: 40, h: 26, rot: -6, round: true },
  ],
  [
    { ci: 3, top: 12, left: 20, w: 58, h: 22, rot: 2 },
    { ci: 0, top: 30, left: 14, w: 50, h: 44, rot: -2 },
    { ci: 2, top: 62, left: 38, w: 44, h: 34, rot: 24 },
  ],
  [
    { ci: 0, top: 16, left: 8, w: 48, h: 30, rot: -8 },
    { ci: 1, top: 34, left: 36, w: 38, h: 40, rot: 6 },
    { ci: 2, top: 58, left: 6, w: 30, h: 38, rot: -14 },
  ],
  [
    { ci: 0, top: 20, left: 24, w: 44, h: 50, rot: 4 },
    { ci: 2, top: 48, left: -4, w: 40, h: 30, rot: -10, round: true },
    { ci: 3, top: 60, left: 44, w: 28, h: 34, rot: 18 },
  ],
];

function Material({ seed, palette, dim = false }: { seed: number; palette: string[]; dim?: boolean }) {
  const comp = COMPOSITIONS[((seed % COMPOSITIONS.length) + COMPOSITIONS.length) % COMPOSITIONS.length];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className={`absolute inset-0 ${dim ? "opacity-45" : "opacity-100"}`}>
        {comp.map((s, i) => (
          <div
            key={i}
            className="absolute float-slow mix-blend-multiply"
            style={
              {
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: `${s.w}%`,
                height: `${s.h}%`,
                background: palette[s.ci],
                borderRadius: s.round ? "9999px" : "2px",
                ["--rot" as string]: `${s.rot}deg`,
                transform: `rotate(${s.rot}deg)`,
                animationDelay: `${i * 1.3}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className={`frost-pane absolute inset-0 ${dim ? "opacity-95" : "opacity-75"}`} />
      <div className="grain absolute inset-0 opacity-30" />
    </div>
  );
}

export default function Card({ question, category, hint, tapLabel, seed, isBalance = false }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const num = String(((seed - 1) % 99) + 1).padStart(2, "0");

  const palette = isBalance ? COOL : WARM;
  const accent = isBalance ? "#5a6370" : "#b5482e";

  return (
    <div
      className="relative h-[var(--ch)] w-[calc(var(--ch)*0.75)] mx-auto cursor-pointer [perspective:1500px] outline-none focus-visible:ring-2 focus-visible:ring-ink/30 rounded-[22px]"
      role="button"
      tabIndex={0}
      aria-label={isFlipped ? "show cover / 앞면 보기" : "flip card / 카드 뒤집기"}
      onClick={() => {
        sound.playFlip();
        setIsFlipped(!isFlipped);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          sound.playFlip();
          setIsFlipped((f) => !f);
        }
      }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.65, type: "spring", stiffness: 210, damping: 25 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ---------- COVER (material object) ---------- */}
        <div
          className="absolute w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[22px] overflow-hidden bg-[#efece5] border border-[#d8d3c9] shadow-[0_22px_50px_-26px_rgba(40,38,34,0.5)]"
          style={{
            opacity: isFlipped ? 0 : 1,
            transition: "opacity 0.3s",
            clipPath: "inset(0 round 22px)",
            WebkitClipPath: "inset(0 round 22px)",
          }}
        >
          <Material seed={seed} palette={palette} />

          {/* labels */}
          <div className="absolute inset-0 p-7 flex flex-col">
            <div className="flex items-start">
              <span className="font-serif text-[11px] tracking-[0.28em] uppercase text-[#34291f]/70">
                {category}
              </span>
            </div>

            <span
              className="mt-auto font-serif text-[64px] leading-none self-start"
              style={{ color: accent, opacity: 0.42 }}
            >
              {num}
            </span>
            <span className="mt-3 font-serif-kr text-[11px] tracking-[0.18em] text-[#34291f]/55">
              {tapLabel}
            </span>
          </div>
        </div>

        {/* ---------- QUESTION SIDE ---------- */}
        <div
          className="absolute w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] rounded-[22px] overflow-hidden bg-[#f3f0ea] border border-[#d8d3c9] shadow-[0_22px_50px_-26px_rgba(40,38,34,0.5)]"
          style={{
            transform: "rotateY(180deg)",
            clipPath: "inset(0 round 22px)",
            WebkitClipPath: "inset(0 round 22px)",
          }}
        >
          <Material seed={seed} palette={palette} dim />

          <div className="absolute inset-0 p-8 flex flex-col">
            <div className="flex items-start">
              <span className="font-serif text-[11px] tracking-[0.28em] uppercase text-[#34291f]/55">
                {category}
              </span>
            </div>

            <div className="flex-1 flex items-center">
              <h2 className="font-serif-kr text-[1.5rem] leading-[1.7] text-[#34291f] break-keep">{question}</h2>
            </div>

            <div className="pt-4 border-t border-[#34291f]/15 flex items-baseline gap-2.5">
              <span className="font-serif text-[12px] tracking-[0.1em] shrink-0" style={{ color: accent }}>
                N° {num}
              </span>
              <span className="font-serif-kr text-[13px] text-[#34291f]/55">{hint}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
