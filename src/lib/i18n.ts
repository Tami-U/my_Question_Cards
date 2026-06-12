export type Lang = "ko" | "en";
export type DeckType = "questions" | "balance";

export interface CardContent {
  question: string;
  hint: string;
}

export interface CardData {
  id: number;
  category: string;
  ko: CardContent;
  en: CardContent;
}

export interface QuestionsData {
  questions: CardData[];
  balance: CardData[];
}

// UI strings for both languages
export const ui = {
  ko: {
    appTitle: "할 말이 없을 때 열어봐",
    intro: ["친구랑 하려고 만든", "질문 카드랑 밸런스 카드 헤헿"],
    questionsBtn: "질문 카드",
    balanceBtn: "밸런스 카드",
    questionsTitle: "질문 카드",
    balanceTitle: "밸런스 카드",
    swipeHint: "옆으로 넘기기 · ← →",
    tap: "탭하면 뒤집혀요",
    shuffle: "SHUFFLE",
    back: "처음으로",
    doneTitle: "오늘 이야기는 여기까지",
    doneBody: ["나눈 말들이 오래 남기를."],
    restart: "처음부터 다시하기",
  },
  en: {
    appTitle: "Open me when there's nothing to say",
    intro: ["Made to play with a friend —", "question cards & balance cards hehe"],
    questionsBtn: "Question Cards",
    balanceBtn: "Balance Cards",
    questionsTitle: "Question Cards",
    balanceTitle: "Balance Cards",
    swipeHint: "Swipe or press ← →",
    tap: "tap to flip",
    shuffle: "SHUFFLE",
    back: "Start over",
    doneTitle: "That's where today ends",
    doneBody: ["May the words stay a while."],
    restart: "Start over",
  },
} satisfies Record<Lang, Record<string, string | string[]>>;

export function t(lang: Lang) {
  return ui[lang];
}
