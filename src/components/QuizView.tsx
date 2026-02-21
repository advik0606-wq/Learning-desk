import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizViewProps {
  questions: QuizQuestion[];
  onRestart: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto py-12 text-center"
      >
        <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={48} className="text-zinc-900" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Quiz Complete!</h2>
          <p className="text-zinc-500">You've finished the study session.</p>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 w-full shadow-sm">
          <div className="text-5xl font-bold text-zinc-900 mb-2">
            {Math.round((score / questions.length) * 100)}%
          </div>
          <p className="text-zinc-500 font-medium">
            Score: {score} out of {questions.length}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200"
          >
            <RefreshCcw size={18} />
            New Study Session
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto py-12">
      <div className="flex justify-between items-center px-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Question</span>
          <h2 className="text-xl font-semibold text-zinc-800">
            {currentIndex + 1} of {questions.length}
          </h2>
        </div>
        <div className="h-2 w-32 bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-zinc-900 transition-all duration-500" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
        <p className="text-xl font-medium text-zinc-900 mb-8 leading-relaxed">
          {currentQuestion.question}
        </p>

        <div className="grid gap-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrect = isAnswered && isCorrect;
            const showWrong = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={cn(
                  "flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200",
                  !isAnswered && "border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50",
                  isAnswered && !isSelected && !isCorrect && "border-zinc-50 opacity-50",
                  showCorrect && "border-emerald-500 bg-emerald-50 text-emerald-900",
                  showWrong && "border-rose-500 bg-rose-50 text-rose-900"
                )}
              >
                <span className="font-medium">{option}</span>
                {showCorrect && <CheckCircle2 size={20} className="text-emerald-500" />}
                {showWrong && <XCircle size={20} className="text-rose-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 pt-8 border-t border-zinc-100"
            >
              <div className="bg-zinc-50 rounded-2xl p-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Explanation</h4>
                <p className="text-zinc-600 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
              
              <button
                onClick={nextQuestion}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-all"
              >
                {currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
