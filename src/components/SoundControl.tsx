"use client";

import { useState } from "react";
import { sound, Ambient } from "@/lib/sound";
import { Lang } from "@/lib/i18n";

const L = {
  ko: { sound: "사운드", sfx: "효과음", ambient: "앰비언트", off: "끄기", forest: "숲", rain: "빗소리", fire: "장작불" },
  en: { sound: "Sound", sfx: "Effects", ambient: "Ambient", off: "Off", forest: "Forest", rain: "Rain", fire: "Fireplace" },
};

export default function SoundControl({ lang, dark }: { lang: Lang; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);
  const [amb, setAmb] = useState<Ambient>("off");
  const tl = L[lang];

  const active = sfxOn || amb !== "off";
  const idle = dark ? "text-[#ece6df]/55 hover:text-[#ece6df]" : "text-ink/45 hover:text-ink";

  const toggleSfx = () => {
    const next = !sfxOn;
    setSfxOn(next);
    sound.setSfx(next);
  };

  const pickAmbient = (a: Ambient) => {
    setAmb(a);
    sound.setAmbient(a);
  };

  const AMB: { k: Ambient; label: string }[] = [
    { k: "off", label: tl.off },
    { k: "forest", label: tl.forest },
    { k: "rain", label: tl.rain },
    { k: "fire", label: tl.fire },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={tl.sound}
        className={`flex items-center transition-colors ${active ? "text-rust" : idle}`}
      >
        {/* speaker glyph */}
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {active ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 6a9 9 0 0 1 0 12" />
            </>
          ) : (
            <path d="M22 9l-6 6M16 9l6 6" />
          )}
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-3 w-44 z-50 bg-[#f3f0ea] border border-ink/15 p-4 shadow-[0_18px_40px_-22px_rgba(40,38,34,0.6)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-[11px] tracking-[0.22em] uppercase text-ink/60">{tl.sfx}</span>
              <button
                onClick={toggleSfx}
                className={`font-serif text-[11px] tracking-[0.16em] uppercase transition-colors ${
                  sfxOn ? "text-rust" : "text-ink/40 hover:text-ink"
                }`}
              >
                {sfxOn ? "ON" : "OFF"}
              </button>
            </div>

            <span className="font-serif text-[11px] tracking-[0.22em] uppercase text-ink/60">{tl.ambient}</span>
            <div className="mt-2.5 flex flex-col">
              {AMB.map((o) => (
                <button
                  key={o.k}
                  onClick={() => pickAmbient(o.k)}
                  className={`flex items-center gap-2 py-1.5 font-serif-kr text-sm text-left transition-colors ${
                    amb === o.k ? "text-rust" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${amb === o.k ? "bg-rust" : "bg-ink/20"}`}
                  />
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
