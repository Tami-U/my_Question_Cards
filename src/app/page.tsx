"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CardDeck from "@/components/CardDeck";
import SoundControl from "@/components/SoundControl";
import IntroLight from "@/components/IntroLight";
import { sound } from "@/lib/sound";
import { Lang, DeckType, t } from "@/lib/i18n";

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center gap-1.5 font-serif text-sm tracking-[0.15em]">
      {(["ko", "en"] as Lang[]).map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink/25">/</span>}
          <button
            onClick={() => {
              sound.playToggle();
              setLang(l);
            }}
            className={`transition-colors ${lang === l ? "text-rust" : "text-ink/40 hover:text-ink"}`}
          >
            {l === "ko" ? "KR" : "EN"}
          </button>
        </span>
      ))}
    </div>
  );
}

function Backdrop({ deck }: { deck: DeckType | null }) {
  const accent = deck === "balance" ? "#5a6370" : "#b5482e";
  const deep = deck === "balance" ? "#243038" : "#5e2a1a";
  return (
    <>
      {deck && (
        <motion.div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="absolute -top-[16%] left-[-8%] w-[72vw] h-[42vh] rounded-full blur-[120px] opacity-[0.18]" style={{ background: accent }} />
          <div className="absolute -top-[12%] right-[-12%] w-[55vw] h-[34vh] rounded-full blur-[120px] opacity-[0.12]" style={{ background: deep }} />
          <div className="absolute -bottom-[14%] right-[-8%] w-[66vw] h-[38vh] rounded-full blur-[120px] opacity-[0.16]" style={{ background: accent }} />
          <div className="absolute -bottom-[18%] left-[-10%] w-[48vw] h-[30vh] rounded-full blur-[120px] opacity-[0.10]" style={{ background: deep }} />
        </motion.div>
      )}
      <div className="grain pointer-events-none fixed inset-0 opacity-[0.12]" aria-hidden />
      <div className="pointer-events-none fixed inset-3 sm:inset-4 border border-ink/15 z-20" aria-hidden />
    </>
  );
}

export default function Home() {
  const [deckType, setDeckType] = useState<DeckType | null>(null);
  const [lang, setLang] = useState<Lang>("ko");
  const tr = t(lang);

  return (
    <main className="relative min-h-[100svh] flex flex-col bg-[var(--cream)] text-ink overflow-hidden">
      <Backdrop deck={deckType} />
      {!deckType && <IntroLight />}

      {/* context-aware header */}
      <header className="relative z-30 flex items-center justify-between px-6 sm:px-9 py-5">
        {deckType ? (
          <button
            onClick={() => {
              sound.playBack();
              setDeckType(null);
            }}
            className="group flex items-center gap-2 font-serif text-sm tracking-[0.18em] uppercase text-ink/70 hover:text-ink transition-colors"
          >
            <span className="text-base leading-none group-hover:-translate-x-1 transition-transform">&larr;</span>
            {tr.back}
          </button>
        ) : (
          <span className="font-serif text-base tracking-[0.25em] uppercase text-ink">
            Aida<span className="text-rust">.</span>
          </span>
        )}
        <div className="flex items-center gap-4 sm:gap-5">
          <SoundControl lang={lang} />
          <LangToggle lang={lang} setLang={setLang} />
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {!deckType ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center text-center w-full max-w-lg"
            >
              <span className="font-serif text-[11px] tracking-[0.34em] uppercase text-ink/45 mb-5">
                Question &amp; Balance
              </span>

              <h1
                className="font-jp text-[clamp(7rem,26vh,13rem)] leading-none"
                style={{ color: "#2E2823", fontWeight: 400 }}
              >
                間
              </h1>

              <p className="text-ink/55 text-sm mt-5 mb-9 tracking-wide">
                <span className="font-mono text-[11px] tracking-[0.2em] text-ink/40">Aida</span>
                {"  "}· 사이, 그리고 서로의 간격
              </p>

              <div className="w-10 h-px bg-ink/30 mb-12" />

              <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                  onClick={() => {
                    sound.playEnter();
                    setDeckType("questions");
                  }}
                  className="group flex items-center justify-center gap-3 py-4 px-6 rounded-full font-serif text-sm tracking-[0.2em] uppercase bg-[#fffaf8] border border-ink/15 text-ink shadow-[0_16px_38px_-22px_rgba(52,41,31,0.5)] hover:bg-rust hover:text-cream hover:border-rust active:scale-[0.98] transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rust group-hover:bg-cream transition-colors" />
                  {tr.questionsBtn}
                </button>
                <button
                  onClick={() => {
                    sound.playEnter();
                    setDeckType("balance");
                  }}
                  className="group flex items-center justify-center gap-3 py-4 px-6 rounded-full font-serif text-sm tracking-[0.2em] uppercase bg-[#fffaf8] border border-ink/15 text-ink shadow-[0_16px_38px_-22px_rgba(52,41,31,0.5)] hover:bg-smoke hover:text-cream hover:border-smoke active:scale-[0.98] transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-smoke group-hover:bg-cream transition-colors" />
                  {tr.balanceBtn}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="deck"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <h1 className="font-serif-kr text-2xl tracking-tight">
                  {deckType === "questions" ? tr.questionsTitle : tr.balanceTitle}
                </h1>
              </div>

              <CardDeck
                deckType={deckType}
                lang={lang}
                onBack={() => {
                  sound.playBack();
                  setDeckType(null);
                }}
              />
            </motion.div>
          )}

        {!deckType && (
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center font-mono text-[11px] tracking-[0.12em] text-ink/45 whitespace-nowrap">
            Made for Soo Kyung · by Tami
          </p>
        )}
      </div>
    </main>
  );
}
