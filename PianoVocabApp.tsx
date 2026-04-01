import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Trophy, 
  RefreshCw, 
  Play,
  CheckCircle2,
  BookOpen,
  Music2,
  Volume2,
  VolumeX,
} from 'lucide-react';

// --- Types ---
interface WordPair {
  spanish: string;
  armenian: string;
  note: number; // Frequency in Hz
  name: string; // Note name for display
}

// --- Constants ---
const MELODY_WORDS: WordPair[] = [
  { spanish: 'Sol', armenian: 'Արև', note: 261.63, name: 'C4' },
  { spanish: 'Luna', armenian: 'Լուսին', note: 293.66, name: 'D4' },
  { spanish: 'Nube', armenian: 'Ամպ', note: 329.63, name: 'E4' },
  { spanish: 'Flor', armenian: 'Ծաղիկ', note: 349.23, name: 'F4' },
  { spanish: 'Mar', armenian: 'Ծով', note: 392.00, name: 'G4' },
  { spanish: 'Casa', armenian: 'Տուն', note: 440.00, name: 'A4' },
  { spanish: 'Mesa', armenian: 'Սեղան', note: 493.88, name: 'B4' },
  { spanish: 'Silla', armenian: 'Աթոռ', note: 523.25, name: 'C5' },
  { spanish: 'Libro', armenian: 'Գիրք', note: 261.63, name: 'C4' },
  { spanish: 'Rojo', armenian: 'Կարմիր', note: 329.63, name: 'E4' },
  { spanish: 'Azul', armenian: 'Կապույտ', note: 392.00, name: 'G4' },
  { spanish: 'Verde', armenian: 'Կանաչ', note: 440.00, name: 'A4' },
];

export default function PianoVocabApp() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'playback' | 'end'>('start');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectedNotes, setCollectedNotes] = useState<WordPair[]>([]);
  const [pianoKeys, setPianoKeys] = useState<WordPair[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [playbackIndex, setPlaybackIndex] = useState<number | null>(null);

  const audioCtx = useRef<AudioContext | null>(null);

  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playNote = useCallback((freq: number, duration = 0.5) => {
    if (isMuted) return;
    initAudio();
    const ctx = audioCtx.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [isMuted]);

  const startGame = () => {
    setCurrentIndex(0);
    setCollectedNotes([]);
    setGameState('playing');
    prepareKeys(0);
  };

  const prepareKeys = (index: number) => {
    const correctWord = MELODY_WORDS[index];
    const others = MELODY_WORDS.filter(w => w.spanish !== correctWord.spanish);
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 5);
    const keys = [correctWord, ...shuffledOthers].sort(() => Math.random() - 0.5);
    setPianoKeys(keys);
  };

  const handleKeyClick = (key: WordPair) => {
    if (gameState !== 'playing' || feedback) return;

    const correctWord = MELODY_WORDS[currentIndex];
    setActiveKey(key.armenian);
    playNote(key.note);

    if (key.spanish === correctWord.spanish) {
      setFeedback('correct');
      setCollectedNotes(prev => [...prev, correctWord]);
      
      setTimeout(() => {
        setFeedback(null);
        setActiveKey(null);
        if (currentIndex + 1 < MELODY_WORDS.length) {
          setCurrentIndex(prev => prev + 1);
          prepareKeys(currentIndex + 1);
        } else {
          startPlayback();
        }
      }, 800);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback(null);
        setActiveKey(null);
      }, 800);
    }
  };

  const startPlayback = async () => {
    setGameState('playback');
    for (let i = 0; i < MELODY_WORDS.length; i++) {
      setPlaybackIndex(i);
      playNote(MELODY_WORDS[i].note, 0.6);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    setPlaybackIndex(null);
    setGameState('end');
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] text-slate-900 flex flex-col overflow-hidden selection:bg-orange-200">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Մեղեդային Բառարան</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Սովորիր և նվագիր</p>
          </div>
        </div>

        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-3 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-orange-500" />}
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 md:p-8 space-y-8 max-w-5xl mx-auto w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {gameState === 'start' ? (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center space-y-8 py-12"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-orange-200 blur-3xl rounded-full opacity-50" />
                <BookOpen className="w-32 h-32 text-orange-500 relative z-10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black tracking-tight uppercase leading-tight">
                  Ստեղծիր քո <br /> <span className="text-orange-500">Մեղեդին</span>
                </h2>
                <p className="text-slate-500 max-w-md font-medium">
                  Ճիշտ թարգմանիր իսպաներեն բառերը և հավաքիր նոտաներ քո տետրում: Վերջում դու կլսես քո ստեղծած մեղեդին:
                </p>
              </div>
              <button 
                onClick={startGame}
                className="group relative px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 overflow-hidden"
              >
                <Play className="w-6 h-6 fill-current" />
                Սկսել Խաղը
                <motion.div 
                  className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
                />
              </button>
            </motion.div>
          ) : (
            <div className="w-full space-y-8">
              {/* Notebook / Staff Area */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-12 relative overflow-hidden min-h-[300px]"
              >
                {/* Notebook Lines */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div className="relative z-10 space-y-12">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Իմ Տետրը</p>
                      <h3 className="text-2xl font-black text-slate-800">Մեղեդու Ընթացքը</h3>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-full border border-slate-100 flex items-center gap-2">
                      <Music2 className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-black text-slate-600">{collectedNotes.length} / {MELODY_WORDS.length}</span>
                    </div>
                  </div>

                  {/* Musical Staff */}
                  <div className="relative h-32 flex items-center px-4">
                    <div className="absolute left-0 right-0 h-[1px] bg-slate-200 top-0" />
                    <div className="absolute left-0 right-0 h-[1px] bg-slate-200 top-1/4" />
                    <div className="absolute left-0 right-0 h-[1px] bg-slate-200 top-1/2" />
                    <div className="absolute left-0 right-0 h-[1px] bg-slate-200 top-3/4" />
                    <div className="absolute left-0 right-0 h-[1px] bg-slate-200 bottom-0" />
                    
                    <div className="flex gap-4 md:gap-6 items-center overflow-x-auto pb-4 scrollbar-hide">
                      <AnimatePresence>
                        {collectedNotes.map((note, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0 }}
                            animate={{ 
                              opacity: 1, 
                              y: 0, 
                              scale: playbackIndex === i ? 1.5 : 1,
                              color: playbackIndex === i ? '#f97316' : '#0f172a'
                            }}
                            className="flex flex-col items-center gap-1 shrink-0"
                          >
                            <Music2 className={`w-8 h-8 ${playbackIndex === i ? 'text-orange-500' : 'text-slate-900'}`} />
                            <span className="text-[8px] font-black uppercase opacity-50">{note.name}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {gameState === 'playing' && (
                        <motion.div 
                          animate={{ opacity: [0.2, 0.5, 0.2] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-8 h-8 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center shrink-0"
                        >
                          <span className="text-[10px] font-black text-slate-300">?</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Interaction Area */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
                {/* Question Card */}
                <div className="md:col-span-1">
                  <AnimatePresence mode="wait">
                    {gameState === 'playing' && (
                      <motion.div 
                        key={currentIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group"
                      >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <Music className="w-20 h-20 rotate-12" />
                        </div>
                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Իսպաներեն Բառ</p>
                        <h4 className="text-4xl font-black tracking-tight">{MELODY_WORDS[currentIndex].spanish}</h4>
                        
                        <div className="mt-8 flex items-center gap-2">
                          <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-orange-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(currentIndex / MELODY_WORDS.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {gameState === 'end' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500 text-white p-8 rounded-[2rem] shadow-xl text-center space-y-4"
                    >
                      <Trophy className="w-12 h-12 mx-auto" />
                      <h4 className="text-2xl font-black uppercase">Հրաշալի է:</h4>
                      <p className="text-sm font-medium opacity-90">Դուք սովորեցիք բոլոր բառերը և լսեցիք մեղեդին:</p>
                      <button 
                        onClick={startGame}
                        className="w-full py-3 bg-white text-emerald-600 rounded-xl font-black uppercase tracking-widest hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Նորից
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Piano Keyboard */}
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ընտրիր ճիշտ թարգմանությունը</p>
                    {feedback && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-2 text-xs font-black uppercase ${feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}
                      >
                        {feedback === 'correct' ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-4 h-4 animate-spin" />}
                        {feedback === 'correct' ? 'Ճիշտ է' : 'Սխալ է'}
                      </motion.div>
                    )}
                  </div>
                  <div className="flex gap-2 h-40">
                    {pianoKeys.map((key, i) => (
                      <button
                        key={i}
                        disabled={gameState !== 'playing' || feedback !== null}
                        onPointerDown={() => handleKeyClick(key)}
                        className={`
                          flex-1 rounded-2xl flex flex-col items-center justify-end pb-6 transition-all relative overflow-hidden active:scale-95 touch-none border-b-8
                          ${activeKey === key.armenian 
                            ? feedback === 'correct' ? 'bg-emerald-500 border-emerald-700 text-white' : 'bg-rose-500 border-rose-700 text-white'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                          }
                          ${gameState !== 'playing' ? 'opacity-50 grayscale' : ''}
                        `}
                      >
                        <span className="text-[10px] font-black uppercase tracking-tighter text-center px-1">
                          {key.armenian}
                        </span>
                        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/5 to-transparent" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center border-t border-slate-200 bg-white/50">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Իսպաներեն - Հայերեն Երաժշտական Խաղ
        </p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
