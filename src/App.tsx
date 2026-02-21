import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Brain, Sparkles, Loader2, ChevronLeft, LayoutGrid, CheckSquare } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { FlashcardList } from './components/FlashcardList';
import { QuizView } from './components/QuizView';
import { processStudyMaterial, type StudyMaterial } from './services/geminiService';
import { cn } from './lib/utils';

type ViewState = 'upload' | 'processing' | 'dashboard' | 'flashcards' | 'quiz';

export default function App() {
  const [view, setView] = useState<ViewState>('upload');
  const [images, setImages] = useState<string[]>([]);
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (newFiles: string[]) => {
    setImages(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const startProcessing = async () => {
    if (images.length === 0) return;
    
    setView('processing');
    setError(null);
    
    try {
      const result = await processStudyMaterial(images);
      setStudyMaterial(result);
      setView('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setView('upload');
    }
  };

  const reset = () => {
    setImages([]);
    setStudyMaterial(null);
    setView('upload');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-zinc-200/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('upload')}
          >
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Sparkles size={18} />
            </div>
            <span className="font-bold tracking-tight text-lg">StudySnap AI</span>
          </div>
          
          {view !== 'upload' && view !== 'processing' && (
            <button 
              onClick={reset}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {view === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-12 md:py-20"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Turn notes into <span className="italic serif">knowledge.</span>
                </h1>
                <p className="text-zinc-500 text-lg max-w-xl mx-auto">
                  Upload photos of your study materials and let AI generate personalized flashcards and quizzes for you.
                </p>
              </div>

              <FileUpload 
                files={images} 
                onFilesSelected={handleFilesSelected} 
                onRemoveFile={handleRemoveFile} 
              />

              {error && (
                <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="mt-12 flex justify-center">
                <button
                  onClick={startProcessing}
                  disabled={images.length === 0}
                  className={cn(
                    "px-10 py-4 rounded-2xl font-semibold text-lg transition-all shadow-xl flex items-center gap-3",
                    images.length > 0 
                      ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-200" 
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
                  )}
                >
                  <Brain size={20} />
                  Generate Study Set
                </button>
              </div>
            </motion.div>
          )}

          {view === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-32 flex flex-col items-center justify-center text-center"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-zinc-900/5 blur-3xl rounded-full" />
                <Loader2 className="w-16 h-16 text-zinc-900 animate-spin relative" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Analyzing your materials...</h2>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Gemini is extracting concepts and crafting your personalized study set. This usually takes a few seconds.
              </p>
            </motion.div>
          )}

          {view === 'dashboard' && studyMaterial && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12"
            >
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-2">Your Study Set is Ready</h2>
                <p className="text-zinc-500">Choose how you want to learn today.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <button
                  onClick={() => setView('flashcards')}
                  className="group relative bg-white border border-zinc-200 rounded-[32px] p-8 text-left transition-all hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <LayoutGrid size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Flashcards</h3>
                  <p className="text-zinc-500 mb-8">Master key terms and concepts with active recall.</p>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    {studyMaterial.flashcards.length} Cards <ChevronLeft className="rotate-180" size={16} />
                  </div>
                </button>

                <button
                  onClick={() => setView('quiz')}
                  className="group relative bg-white border border-zinc-200 rounded-[32px] p-8 text-left transition-all hover:shadow-2xl hover:shadow-zinc-200 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <CheckSquare size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Practice Quiz</h3>
                  <p className="text-zinc-500 mb-8">Test your knowledge with multiple choice questions.</p>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors">
                    {studyMaterial.quiz.length} Questions <ChevronLeft className="rotate-180" size={16} />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {(view === 'flashcards' || view === 'quiz') && (
            <motion.div
              key="study-session"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setView('dashboard')}
                className="mt-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-medium transition-colors"
              >
                <ChevronLeft size={20} />
                Back to Study Set
              </button>

              {view === 'flashcards' && studyMaterial && (
                <FlashcardList flashcards={studyMaterial.flashcards} />
              )}

              {view === 'quiz' && studyMaterial && (
                <QuizView questions={studyMaterial.quiz} onRestart={reset} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
