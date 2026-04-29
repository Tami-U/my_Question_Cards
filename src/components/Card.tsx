"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CardProps {
  question: string;
  category: string;
  hint: string;
}

export default function Card({ question, category, hint }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Pick a deterministic emoji based on the question length
  const emojis = ["👻", "✨", "🐱", "💕", "💭", "🎲", "🦄", "🎈", "🌟", "🦦", "🐣", "🍀", "🎀", "🎉", "🔥", "🌈", "🍭"];
  const emoji = emojis[question.length % emojis.length];

  return (
    <div
      className="relative w-full aspect-[3/4] max-w-sm mx-auto cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Cover of Card (What you see first) */}
        <div 
          className="absolute w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] flex flex-col items-center justify-center p-3 rounded-3xl bg-purple-300 shadow-2xl border border-purple-400 transition-opacity duration-300"
          style={{ opacity: isFlipped ? 0 : 1 }}
        >
          <div className="w-full h-full rounded-2xl bg-[repeating-linear-gradient(45deg,#d8b4fe,#d8b4fe_12px,#c084fc_12px,#c084fc_24px)] border-2 border-purple-400 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <div className="absolute w-20 h-20 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-purple-300 z-10">
              <span className="text-purple-500 font-bold tracking-widest text-sm">TAP</span>
            </div>
            {/* Subtle glow effect */}
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/30 rounded-full blur-3xl" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-100/40 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Question Side (What you read) */}
        <div
          className="absolute w-full h-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] flex flex-col items-center justify-start p-8 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl overflow-hidden"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400" />
          
          <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-bold tracking-wider mt-2 mb-6 uppercase border border-slate-200">
            {category}
          </span>

          {/* Cute varied illustration */}
          <div className="text-5xl mb-6 drop-shadow-sm animate-bounce" style={{ animationDuration: "2s" }}>{emoji}</div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center leading-relaxed break-keep">
            {question}
          </h2>
          
          <div className="mt-auto pt-6 w-full border-t border-slate-100">
            <p className="text-center text-slate-500 text-base font-medium">
              💡 {hint}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
