"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "./Card";
import questionsData from "../data/questions.json";
import { DeckType } from "@/app/page";

interface CardDeckProps {
  deckType: DeckType;
}

export default function CardDeck({ deckType }: CardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for right, -1 for left

  // Reset index when deck type changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [deckType]);

  const deck = questionsData[deckType];

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      // Swiped right -> Previous card
      if (currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex(currentIndex - 1);
      }
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left -> Next card
      if (currentIndex < deck.length) {
        setDirection(1);
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  if (currentIndex === deck.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center justify-center h-[60vh] max-w-sm mx-auto text-center z-10"
      >
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-4">수경님 나랑 놀아줘서 고마워요!</h2>
        <p className="text-white/60 mb-8 leading-relaxed">모든 카드를 다 읽었습니다.<br/>오늘 즐거웠길 바라요!</p>
        <button 
          onClick={() => setCurrentIndex(0)}
          className={`py-3 px-8 ${deckType === "questions" ? "bg-purple-500 hover:bg-purple-400" : "bg-blue-500 hover:bg-blue-400"} active:scale-95 text-white rounded-xl font-medium shadow-lg transition-all`}
        >
          처음부터 다시하기
        </button>
      </motion.div>
    );
  }

  const currentQuestion = deck[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="relative w-full h-[60vh] max-w-sm mx-auto flex items-center justify-center perspective-1000">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          className="absolute w-full"
          initial={{ opacity: 0, x: direction * 200, scale: 0.9, rotateY: direction * 10 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, x: direction * -200, scale: 0.9, rotateY: direction * -10 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
        >
          <Card
            question={currentQuestion.question}
            category={currentQuestion.category}
            hint={currentQuestion.hint}
            isBalance={deckType === "balance"}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Progress indicator */}
      <div className="absolute -bottom-16 left-0 w-full flex flex-col items-center gap-2">
        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${deckType === "questions" ? "bg-gradient-to-r from-purple-400 to-indigo-500" : "bg-gradient-to-r from-blue-400 to-cyan-500"}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-white/60 text-sm font-light">
          {currentIndex + 1} / {deck.length}
        </p>
      </div>
    </div>
  );
}
