import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Gamepad2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight, 
  Info,
  Star,
  Trophy,
  Lightbulb,
  Bird,
  ArrowRight
} from 'lucide-react';

// --- Types ---
interface Sentence {
  id: number;
  full: string;
  words: string[];
  translation: string;
  explanation: string;
  verb: 'ser' | 'estar';
}

// --- Data ---
const SENTENCES: Sentence[] = [
  { 
    id: 1, 
    full: 'Yo soy estudiante', 
    words: ['Yo', 'soy', 'estudiante'], 
    translation: 'Ես ուսանող եմ', 
    explanation: 'Ser-ն օգտագործվում է մասնագիտության համար:',
    verb: 'ser'
  },
  { 
    id: 2, 
    full: 'Ella está feliz', 
    words: ['Ella', 'está', 'feliz'], 
    translation: 'Նա երջանիկ է', 
    explanation: 'Estar-ն օգտագործվում է ժամանակավոր վիճակների և էմոցիաների համար:',
    verb: 'estar'
  },
  { 
    id: 3, 
    full: 'Nosotros somos de Armenia', 
    words: ['Nosotros', 'somos', 'de', 'Armenia'], 
    translation: 'Մենք Հայաստանից ենք', 
    explanation: 'Ser-ն օգտագործվում է ծագման համար:',
    verb: 'ser'
  },
  { 
    id: 4, 
    full: 'El libro está en la mesa', 
    words: ['El', 'libro', 'está', 'en', 'la', 'mesa'], 
    translation: 'Գիրքը սեղանի վրա է', 
    explanation: 'Estar-ն օգտագործվում է տեղադրության համար:',
    verb: 'estar'
  },
  { 
    id: 5, 
    full: 'Hoy es lunes', 
    words: ['Hoy', 'es', 'lunes'], 
    translation: 'Այսօր երկուշաբթի է', 
    explanation: 'Ser-ն օգտագործվում է ժամանակի և ամսաթվի համար:',
    verb: 'ser'
  },
  { 
    id: 6, 
    full: 'La sopa está caliente', 
    words: ['La', 'sopa', 'está', 'caliente'], 
    translation: 'Ապուրը տաք է', 
    explanation: 'Estar-ն օգտագործվում է ֆիզիկական վիճակի համար:',
    verb: 'estar'
  },
  { 
    id: 7, 
    full: 'Tú eres muy inteligente', 
    words: ['Tú', 'eres', 'muy', 'inteligente'], 
    translation: 'Դու շատ խելացի ես', 
    explanation: 'Ser-ն օգտագործվում է բնավորության գծերի և հատկանիշների համար:',
    verb: 'ser'
  },
  { 
    id: 8, 
    full: 'Madrid está en España', 
    words: ['Madrid', 'está', 'en', 'España'], 
    translation: 'Մադրիդը Իսպանիայում է', 
    explanation: 'Estar-ն օգտագործվում է աշխարհագրական տեղադրության համար:',
    verb: 'estar'
  }
];

export default function SerEstarApp() {
  const [view, setView] = useState<'theory' | 'game'>('theory');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const currentSentence = SENTENCES[currentSentenceIndex];

  useEffect(() => {
    if (view === 'game' && currentSentence) {
      setShuffledWords([...currentSentence.words].sort(() => Math.random() - 0.5));
      setSelectedWords([]);
      setFeedback(null);
    }
  }, [view, currentSentenceIndex]);

  const handleWordClick = (word: string, index: number) => {
    if (feedback?.isCorrect) return;
    
    setSelectedWords([...selectedWords, word]);
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (feedback?.isCorrect) return;

    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setShuffledWords([...shuffledWords, word]);
  };

  const checkSentence = () => {
    const isCorrect = selectedWords.join(' ') === currentSentence.full;
    setFeedback({
      isCorrect,
      message: isCorrect ? 'Հիանալի է!' : 'Փորձիր նորից:'
    });
    if (isCorrect) setScore(score + 1);
  };

  const nextSentence = () => {
    if (currentSentenceIndex < SENTENCES.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    setCurrentSentenceIndex(0);
    setScore(0);
    setGameFinished(false);
    setView('theory');
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="bg-white border-b border-sky-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200"
            >
              <Bird className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-black text-lg tracking-tight uppercase">Ser vs Estar</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('theory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'theory' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-sky-100'}`}
            >
              <BookOpen className="w-4 h-4" />
              Տեսություն
            </button>
            <button 
              onClick={() => setView('game')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'game' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-sky-100'}`}
            >
              <Gamepad2 className="w-4 h-4" />
              Խաղ
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 md:p-12">
        <AnimatePresence mode="wait">
          {view === 'theory' ? (
            <motion.div 
              key="theory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <header className="text-center space-y-4">
                <div className="inline-block bg-orange-100 p-4 rounded-full mb-4">
                  <Bird className="w-12 h-12 text-orange-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  Ser թե՞ Estar
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                  Իսպաներենում «լինել» բայը ունի երկու ձև: Սովորենք, թե երբ օգտագործել դրանցից յուրաքանչյուրը:
                </p>
              </header>

              <div className="grid md:grid-cols-2 gap-8">
                {/* SER Card */}
                <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-orange-100 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Star className="w-24 h-24 text-orange-500" />
                  </div>
                  <div className="flex items-center gap-3 text-orange-600">
                    <div className="bg-orange-500 p-2 rounded-lg text-white">
                      <h2 className="text-2xl font-black">SER</h2>
                    </div>
                    <span className="font-bold uppercase tracking-widest text-sm">Մշտական</span>
                  </div>
                  <p className="text-slate-600 font-medium">Օգտագործվում է հիմնական հատկանիշների համար (DOCTOR):</p>
                  <ul className="space-y-3">
                    {[
                      { l: 'D', t: 'Description', a: 'Նկարագրություն' },
                      { l: 'O', t: 'Occupation', a: 'Մասնագիտություն' },
                      { l: 'C', t: 'Characteristic', a: 'Բնավորություն' },
                      { l: 'T', t: 'Time', a: 'Ժամանակ' },
                      { l: 'O', t: 'Origin', a: 'Ծագում' },
                      { l: 'R', t: 'Relation', a: 'Կապ/Ազգակցություն' }
                    ].map(item => (
                      <li key={item.t} className="flex items-center gap-3 bg-orange-50/50 p-2 rounded-xl">
                        <span className="font-black text-orange-500 w-4">{item.l}</span>
                        <span className="text-sm font-bold text-slate-700">{item.t}</span>
                        <span className="text-xs text-slate-400 italic ml-auto">{item.a}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* ESTAR Card */}
                <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-sky-100 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <RefreshCw className="w-24 h-24 text-sky-500" />
                  </div>
                  <div className="flex items-center gap-3 text-sky-600">
                    <div className="bg-sky-500 p-2 rounded-lg text-white">
                      <h2 className="text-2xl font-black">ESTAR</h2>
                    </div>
                    <span className="font-bold uppercase tracking-widest text-sm">Ժամանակավոր</span>
                  </div>
                  <p className="text-slate-600 font-medium">Օգտագործվում է վիճակների և տեղադրության համար (PLACE):</p>
                  <ul className="space-y-3">
                    {[
                      { l: 'P', t: 'Position', a: 'Դիրք' },
                      { l: 'L', t: 'Location', a: 'Տեղադրություն' },
                      { l: 'A', t: 'Action', a: 'Գործողություն' },
                      { l: 'C', t: 'Condition', a: 'Վիճակ' },
                      { l: 'E', t: 'Emotion', a: 'Էմոցիա' }
                    ].map(item => (
                      <li key={item.t} className="flex items-center gap-3 bg-sky-50/50 p-2 rounded-xl">
                        <span className="font-black text-sky-500 w-4">{item.l}</span>
                        <span className="text-sm font-bold text-slate-700">{item.t}</span>
                        <span className="text-xs text-slate-400 italic ml-auto">{item.a}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setView('game')}
                  className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-sky-200 flex items-center gap-3"
                >
                  Սկսել Վարժությունը
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              {!gameFinished ? (
                <div className="space-y-8">
                  {/* Game Header */}
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-md border border-sky-100">
                        <Bird className="w-8 h-8 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Վարժություն {currentSentenceIndex + 1} / {SENTENCES.length}</p>
                        <h2 className="text-2xl font-black text-slate-900">Կազմիր նախադասությունը</h2>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Միավորներ</p>
                      <p className="text-3xl font-black text-orange-500">{score}</p>
                    </div>
                  </div>

                  {/* Translation Hint */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-sky-50 text-center">
                    <p className="text-xl font-bold text-slate-700 italic">« {currentSentence.translation} »</p>
                  </div>

                  {/* Sentence Builder Area */}
                  <div className="space-y-8">
                    {/* Selected Words (Drop Area) */}
                    <div className="min-h-[120px] bg-white/50 rounded-[2.5rem] border-4 border-dashed border-sky-200 p-6 flex flex-wrap gap-3 items-center justify-center">
                      {selectedWords.map((word, i) => (
                        <motion.button
                          layoutId={`word-${word}-${i}`}
                          key={`selected-${i}`}
                          onClick={() => handleRemoveWord(word, i)}
                          className="bg-white px-6 py-3 rounded-2xl font-bold text-lg shadow-md border-2 border-sky-100 hover:border-rose-300 transition-all"
                        >
                          {word}
                        </motion.button>
                      ))}
                      {selectedWords.length === 0 && (
                        <p className="text-slate-300 font-bold uppercase tracking-widest text-sm">Ընտրիր բառերը ստորև</p>
                      )}
                    </div>

                    {/* Shuffled Words (Source Area) */}
                    <div className="flex flex-wrap gap-6 justify-center py-12 px-4 bg-white/30 rounded-[3rem] border-2 border-sky-100/50 backdrop-blur-sm">
                      {shuffledWords.map((word, i) => (
                        <motion.button
                          layoutId={`word-${word}-${i}`}
                          key={`shuffled-${i}`}
                          initial={{ 
                            rotate: Math.random() * 40 - 20,
                            x: Math.random() * 20 - 10,
                            y: Math.random() * 20 - 10
                          }}
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 0, 
                            zIndex: 10,
                            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                          }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleWordClick(word, i)}
                          className="bg-white px-8 py-4 rounded-2xl font-black text-xl shadow-lg border-2 border-white hover:border-sky-400 hover:text-sky-600 transition-all cursor-grab active:cursor-grabbing"
                        >
                          {word}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Feedback */}
                  <div className="space-y-4">
                    {!feedback ? (
                      <button
                        onClick={checkSentence}
                        disabled={selectedWords.length === 0}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl"
                      >
                        Ստուգել
                      </button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-[2rem] border-2 space-y-4 ${
                          feedback.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl ${feedback.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'} text-white`}>
                            {feedback.isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                          </div>
                          <div className="flex-1">
                            <p className={`font-black text-xl mb-1 ${feedback.isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                              {feedback.message}
                            </p>
                            {feedback.isCorrect && (
                              <div className="space-y-2">
                                <p className="text-emerald-700 font-medium">{currentSentence.explanation}</p>
                                <div className="bg-white/50 p-3 rounded-xl border border-emerald-100 inline-flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-emerald-500" />
                                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Կանոն: {currentSentence.verb.toUpperCase()}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={feedback.isCorrect ? nextSentence : () => {
                            setShuffledWords([...currentSentence.words].sort(() => Math.random() - 0.5));
                            setSelectedWords([]);
                            setFeedback(null);
                          }}
                          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                            feedback.isCorrect ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-rose-600 text-white hover:bg-rose-700'
                          }`}
                        >
                          {feedback.isCorrect ? (
                            <>
                              Հաջորդը
                              <ChevronRight className="w-5 h-5" />
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-5 h-5" />
                              Փորձել նորից
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-sky-100 text-center space-y-8">
                  <div className="relative inline-block">
                    <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-2 -right-2 bg-orange-500 text-white p-2 rounded-full"
                    >
                      <Bird className="w-6 h-6" />
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Հիանալի աշխատանք:</h2>
                    <p className="text-xl text-slate-500 font-medium">Դուք յուրացրեցիք Ser և Estar բայերի տարբերությունները:</p>
                  </div>
                  
                  <div className="bg-sky-50 p-6 rounded-3xl border-2 border-sky-100">
                    <p className="text-sm font-black text-sky-400 uppercase tracking-widest mb-1">Վերջնական արդյունք</p>
                    <p className="text-5xl font-black text-slate-900">{score} / {SENTENCES.length}</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={restartGame}
                      className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl shadow-sky-100"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Սկսել նորից
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-sky-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-sky-100">
              <Bird className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="font-black text-slate-900 uppercase tracking-tight">Jose-ի խորհուրդը</p>
              <p className="text-slate-500 text-sm max-w-xs">Հիշիր՝ <b>Ser</b>-ը այն է, ինչ դու <b>ես</b>, իսկ <b>Estar</b>-ը այն է, թե ինչպես ես քեզ <b>զգում</b> կամ որտեղ ես:</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900">8</div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Նախադասություն</div>
            </div>
            <div className="h-8 w-px bg-sky-100" />
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900">2</div>
              <div className="text-[10px] font-black text-slate-400 uppercase">Կանոն</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
