"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardDeck from "@/components/CardDeck";
import { MessageCircleHeart } from "lucide-react";

export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center z-10 w-full max-w-sm"
          >
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-40 rounded-full"></div>
              <MessageCircleHeart className="w-24 h-24 text-purple-400 relative z-10" strokeWidth={1.5} />
            </div>

            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
              질문 카드
            </h1>
            <p className="text-slate-300 text-lg mb-12 leading-relaxed">
              수경님이랑 금욜 만나면 하려고 만든<br />
              질문카드 헤헿
            </p>

            <button
              onClick={() => setStarted(true)}
              className="w-full py-4 px-8 bg-white/10 hover:bg-white/20 active:scale-95 transition-all rounded-2xl border border-white/20 backdrop-blur-md text-white font-medium text-lg shadow-xl"
            >
              시작하기
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="deck"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full z-10 flex flex-col h-full justify-center"
          >
            <div className="mb-12 text-center relative z-20">
              <h1 className="text-2xl font-semibold text-white/90">질문 카드</h1>
              <p className="text-white/50 text-sm mt-1">좌우로 스와이프하여 카드를 넘기세요</p>
            </div>

            <div className="relative z-20">
              <CardDeck />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
