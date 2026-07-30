'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, HelpCircle, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LessonQuizProps {
  quiz?: QuizQuestion;
  onComplete?: () => void;
}

const DEFAULT_QUIZ: QuizQuestion = {
  question: 'In Solana programming, where is contract state stored?',
  options: [
    'Inside contract EVM storage slots',
    'In separate Data Accounts owned by the program',
    'In client local storage',
    'On IPFS pinned nodes'
  ],
  correctIndex: 1,
  explanation: 'Solana explicitly separates code (executable program accounts) from data (non-executable data accounts).'
};

export function LessonQuiz({ quiz = DEFAULT_QUIZ, onComplete }: LessonQuizProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionClick = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
  };

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setSubmitted(true);
    if (selectedIndex === quiz.correctIndex) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      toast.success('Correct answer! +50 XP Earned!');
      if (onComplete) onComplete();
    } else {
      toast.error('Incorrect. Review the explanation below!');
    }
  };

  const isCorrect = selectedIndex === quiz.correctIndex;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4 my-6">
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
        <HelpCircle className="w-4 h-4" />
        Lesson Knowledge Check
      </div>

      <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
        {quiz.question}
      </h4>

      <div className="space-y-2">
        {quiz.options.map((option, idx) => {
          let stateStyle = 'bg-[#f8f8f8] dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500/50';

          if (submitted) {
            if (idx === quiz.correctIndex) {
              stateStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold';
            } else if (idx === selectedIndex) {
              stateStyle = 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-800 dark:text-red-300';
            }
          } else if (selectedIndex === idx) {
            stateStyle = 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium';
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={submitted}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all flex items-center justify-between ${stateStyle}`}
            >
              <span>{option}</span>
              {submitted && idx === quiz.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              {submitted && idx === selectedIndex && idx !== quiz.correctIndex && (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={selectedIndex === null}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Submit Answer
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-2">
          <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            {isCorrect ? (
              <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct!</span>
            ) : (
              <span className="text-red-600 flex items-center gap-1"><XCircle className="w-4 h-4" /> Not quite right</span>
            )}
          </div>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}
