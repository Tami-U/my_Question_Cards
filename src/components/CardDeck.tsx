"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import questionsData from "../data/questions.json";
import { DeckType, Lang, QuestionsData, t } from "@/lib/i18n";
import { sound } from "@/lib/sound";

interface CardDeckProps {
  deckType: DeckType;
  lang: Lang;
  onBack: () => void;
}

const data = questionsData as QuestionsData;

function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function CardDeck({ deckType, lang, onBack }: CardDeckProps) {
  const cards = data[deckType];
  const isB = deckType === "balance";
  const accent = isB ? "#5a6370" : "#b5482e";
  const [order, setOrder] = useState<number[]>(() => Array.from({ length: cards.length }, (_, i) => i));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const tr = t(lang);

  // Reset to natural order when deck type changes
  useEffect(() => {
    setOrder(Array.from({ length: cards.length }, (_, i) => i));
    setCurrentIndex(0);
    setDirection(0);
  }, [deckType, cards.length]);

  // end the shuffle animation
  useEffect(() => {
    if (!isShuffling) return;
    const id = window.setTimeout(() => setIsShuffling(false), 720);
    return () => window.clearTimeout(id);
  }, [isShuffling]);

  const handleShuffle = () => {
    if (isShuffling) return;
    sound.playShuffle();
    setIsShuffling(true);
    setOrder(shuffled(cards.length));
    setDirection(1);
    setCurrentIndex(0);
  };

  const paginate = (dir: 1 | -1) => {
    if (dir === 1 && currentIndex < order.length) {
      sound.playSwipe();
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    } else if (dir === -1 && currentIndex > 0) {
      sound.playSwipe();
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // desktop: ← → arrow keys flip through the deck
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentIndex < order.length) {
        sound.playSwipe();
        setDirection(1);
        setCurrentIndex((i) => i + 1);
      } else if (e.key === "ArrowLeft" && currentIndex > 0) {
        sound.playSwipe();
        setDirection(-1);
        setCurrentIndex((i) => i - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, order.length]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 50;
    if (info.offset.x > threshold) paginate(-1);
    else if (info.offset.x < -threshold) paginate(1);
  };

  // ---------- Completed ----------
  if (currentIndex === order.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center justify-center text-center max-w-sm mx-auto py-10"
      >
        {/* soft colour bloom on arrival */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible" aria-hidden>
          <motion.div
            className="absolute w-[80vw] max-w-[420px] aspect-square rounded-full blur-[90px]"
            style={{ background: accent }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1, 0.92], opacity: [0, 0.2, 0.14] }}
            transition={{ duration: 1.8, ease: "easeOut", times: [0, 0.6, 1] }}
          />
          <motion.div
            className="absolute w-[55vw] max-w-[300px] aspect-square rounded-full blur-[70px]"
            style={{ background: "#8b961a" }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.05], opacity: [0, 0.12] }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 0.15 }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="font-serif text-[11px] tracking-[0.3em] uppercase text-ink/40 mb-4">Fin</span>
          <h2 className="font-serif-kr text-2xl mb-3">{tr.doneTitle}</h2>
          <p className="font-serif-kr text-ink/55 leading-relaxed mb-10">{tr.doneBody[0]}</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={handleShuffle}
              className={`btn-quiet w-full py-4 px-6 font-serif text-sm tracking-[0.2em] uppercase bg-transparent text-ink border-ink hover:text-cream ${
                isB ? "hover:bg-smoke hover:border-smoke" : "hover:bg-rust hover:border-rust"
              }`}
            >
              {tr.shuffle}
            </button>
            <button
              onClick={onBack}
              className="btn-quiet w-full py-4 px-6 font-serif text-sm tracking-[0.2em] uppercase bg-transparent text-ink border-ink hover:bg-ink hover:text-cream"
            >
              {tr.back}
            </button>
          </div>

          <div className="mt-10 flex flex-col items-center gap-1.5">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/35">
              Special thanks to my friends
            </span>
            <a
              href="https://instagram.com/utami.zip"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-ink/45 hover:text-rust transition-colors"
            >
              Contact · @utami.zip
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  const card = cards[order[currentIndex]];
  if (!card) return null;
  const content = card[lang];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-[58vh] max-w-sm mx-auto flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`${order.join("-")}-${currentIndex}`}
            custom={direction}
            className="absolute w-full"
            initial={{ opacity: 0, x: direction * 180, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -180, scale: 0.94 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.18 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
          >
            <Card
              question={content.question}
              category={card.category}
              hint={content.hint}
              tapLabel={tr.tap}
              seed={card.id}
              isBalance={deckType === "balance"}
            />
          </motion.div>
        </AnimatePresence>

        {/* ---------- shuffle riffle overlay ---------- */}
        <AnimatePresence>
          {isShuffling && (
            <motion.div
              className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-full max-w-sm aspect-[3/4] rounded-[22px] border border-[#d8d3c9] bg-[#efece5] shadow-[0_22px_50px_-26px_rgba(40,38,34,0.5)] overflow-hidden"
                  initial={{ x: 0, y: 0, rotate: 0 }}
                  animate={{
                    x: [0, (i - 2) * 58, 0],
                    y: [0, -Math.abs(i - 2) * 14, 0],
                    rotate: [0, (i - 2) * 10, 0],
                  }}
                  transition={{ duration: 0.62, ease: "easeInOut", times: [0, 0.5, 1], delay: i * 0.04 }}
                >
                  <div className="absolute inset-0" style={{ background: accent, opacity: 0.16 }} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* progress */}
      <div className="w-full max-w-sm mx-auto mt-7 flex flex-col items-center gap-2.5">
        <div className="w-full h-px bg-ink/15 overflow-hidden">
          <motion.div
            className={`h-full ${isB ? "bg-smoke" : "bg-rust"}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / order.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="font-serif text-ink/40 text-xs tracking-[0.25em]">
          {String(currentIndex + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")}
        </p>
        {currentIndex === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-serif text-ink/35 text-[11px] tracking-[0.12em]"
          >
            {tr.swipeHint}
          </motion.p>
        )}
      </div>

      {/* shuffle wordmark */}
      <button
        onClick={handleShuffle}
        disabled={isShuffling}
        className={`mt-9 font-serif text-xl tracking-[0.32em] uppercase transition-colors disabled:opacity-50 ${
          isShuffling ? "text-ink/40" : isB ? "text-ink/80 hover:text-smoke" : "text-ink/80 hover:text-rust"
        }`}
        aria-label="shuffle"
      >
        {tr.shuffle}
      </button>
    </div>
  );
}
