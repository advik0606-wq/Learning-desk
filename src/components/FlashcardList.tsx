import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw } from 'lucide-react';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardListProps {
  flashcards: Flashcard[];
}

export const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  if (flashcards.length === 0) return null;

  const currentCard = flashcards[currentIndex];

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto py-12">
      <div className="flex justify-between w-full items-center px-4">
        <h2 className="text-2xl font-semibold text-zinc-800">Flashcards</h2>
        <span className="text-sm font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      <div 
        className="relative w-full aspect-[3/2] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-transform duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border border-zinc-200 rounded-3xl shadow-sm flex flex-col items-center justify-center p-12 text-center">
            <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Question</span>
            <p className="text-2xl font-medium text-zinc-800 leading-relaxed">
              {currentCard.question}
            </p>
            <div className="absolute bottom-6 flex items-center gap-2 text-zinc-400 text-xs font-medium">
              <RotateCw size={14} />
              Click to flip
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-800 rounded-3xl shadow-xl flex flex-col items-center justify-center p-12 text-center"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="absolute top-6 left-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Answer</span>
            <p className="text-xl font-normal text-zinc-100 leading-relaxed">
              {currentCard.answer}
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={(e) => { e.stopPropagation(); prevCard(); }}
          className="px-6 py-3 rounded-2xl bg-white border border-zinc-200 text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextCard(); }}
          className="px-6 py-3 rounded-2xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
        >
          Next Card
        </button>
      </div>
    </div>
  );
};
