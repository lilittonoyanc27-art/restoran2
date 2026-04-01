import React, { useState } from 'react';
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
  Lightbulb
} from 'lucide-react';

// --- Types ---
interface ExceptionWord {
  word: string;
  article: 'el' | 'la';
  translation: string;
  category: string;
}

// --- Data ---
const EXCEPTIONS: ExceptionWord[] = [
  // Masculine ending in -a
  { word: 'problema', article: 'el', translation: 'խնդիր', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'sistema', article: 'el', translation: 'համակարգ', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'mapa', article: 'el', translation: 'քարտեզ', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'tema', article: 'el', translation: 'թեմա', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'sofá', article: 'el', translation: 'բազմոց', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'día', article: 'el', translation: 'օր', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'idioma', article: 'el', translation: 'լեզու', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'planeta', article: 'el', translation: 'մոլորակ', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'clima', article: 'el', translation: 'կլիմա', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  { word: 'programa', article: 'el', translation: 'ծրագիր', category: 'Արական սեռի բառեր, որոնք ավարտվում են -a-ով' },
  
  // Feminine ending in -o
  { word: 'mano', article: 'la', translation: 'ձեռք', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -o-ով' },
  { word: 'moto', article: 'la', translation: 'մոտոցիկլետ', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -o-ով' },
  { word: 'foto', article: 'la', translation: 'լուսանկար', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -o-ով' },
  { word: 'radio', article: 'la', translation: 'ռադիո', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -o-ով' },
  
  // Consonants and others
  { word: 'flor', article: 'la', translation: 'ծաղիկ', category: 'Իգական սեռի բառեր, որոնք ավարտվում են բաղաձայնով' },
  { word: 'luz', article: 'la', translation: 'լույս', category: 'Իգական սեռի բառեր, որոնք ավարտվում են բաղաձայնով' },
  { word: 'paz', article: 'la', translation: 'խաղաղություն', category: 'Իգական սեռի բառեր, որոնք ավարտվում են բաղաձայնով' },
  { word: 'sed', article: 'la', translation: 'ծարավ', category: 'Իգական սեռի բառեր, որոնք ավարտվում են բաղաձայնով' },
  { word: 'leche', article: 'la', translation: 'կաթ', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -e-ով' },
  { word: 'noche', article: 'la', translation: 'գիշեր', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -e-ով' },
  
  // -z endings
  { word: 'voz', article: 'la', translation: 'ձայն', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -z-ով' },
  { word: 'nariz', article: 'la', translation: 'քիթ', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -z-ով' },
  { word: 'vez', article: 'la', translation: 'անգամ', category: 'Իգական սեռի բառեր, որոնք ավարտվում են -z-ով' },

  // -ante / -ista (Common gender - usually both, but let's add them for theory)
  { word: 'estudiante', article: 'la', translation: 'ուսանող(ուհի)', category: 'Երկսեռ բառեր (-ante, -ista)' },
  { word: 'artista', article: 'el', translation: 'արվեստագետ', category: 'Երկսեռ բառեր (-ante, -ista)' },
  { word: 'dentista', article: 'la', translation: 'ատամնաբույժ', category: 'Երկսեռ բառեր (-ante, -ista)' },
  { word: 'cantante', article: 'el', translation: 'երգիչ', category: 'Երկսեռ բառեր (-ante, -ista)' },
];

export default function SpanishExceptionsApp() {
  const [view, setView] = useState<'theory' | 'game'>('theory');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'el' | 'la' | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([...EXCEPTIONS].sort(() => Math.random() - 0.5));

  const handleAnswer = (article: 'el' | 'la') => {
    setSelectedOption(article);
    const correct = shuffledWords[currentWordIndex].article === article;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    if (currentWordIndex < shuffledWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      setGameFinished(true);
    }
  };

  const restartGame = () => {
    setShuffledWords([...EXCEPTIONS].sort(() => Math.random() - 0.5));
    setCurrentWordIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowFeedback(false);
    setGameFinished(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-2 rounded-lg">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Spanish Exceptions</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setView('theory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'theory' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <BookOpen className="w-4 h-4" />
              Տեսություն
            </button>
            <button 
              onClick={() => setView('game')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${view === 'game' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
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
              <header className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                  Իսպաներենի Բացառությունները
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
                  Իսպաներենում բառերի սեռը սովորաբար որոշվում է վերջավորությամբ, բայց կան բառեր, որոնք «խաբում են» մեզ:
                </p>
              </header>

              <div className="grid gap-8">
                {/* Rule 1 */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-center gap-3 text-orange-600">
                    <Info className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Կանոն 1. -a վերջավորությամբ արական բառեր</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Շատ բառեր, որոնք ունեն հունական ծագում և ավարտվում են <b>-ma</b> կամ <b>-pa</b> վերջավորությամբ, արական սեռի են, թեև ավարտվում են <b>-a</b>-ով:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {EXCEPTIONS.filter(w => w.category.includes('-a-ով') && w.article === 'el').map(w => (
                      <div key={w.word} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-orange-600 font-black mr-2">el</span>
                        <span className="font-bold">{w.word}</span>
                        <p className="text-xs text-slate-400 mt-1">{w.translation}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Rule 2 */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-center gap-3 text-blue-600">
                    <Info className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Կանոն 2. -o վերջավորությամբ իգական բառեր</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Որոշ բառեր իգական սեռի են, թեև ավարտվում են <b>-o</b>-ով: Հաճախ դրանք ավելի երկար բառերի կրճատ տարբերակներն են (օրինակ՝ fotografía → foto):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {EXCEPTIONS.filter(w => w.category.includes('-o-ով')).map(w => (
                      <div key={w.word} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-blue-600 font-black mr-2">la</span>
                        <span className="font-bold">{w.word}</span>
                        <p className="text-xs text-slate-400 mt-1">{w.translation}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Rule 3 */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-center gap-3 text-purple-600">
                    <Info className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Կանոն 3. -z վերջավորությամբ իգական բառեր</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Բառերը, որոնք ավարտվում են <b>-z</b>-ով, հիմնականում իգական սեռի են:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {EXCEPTIONS.filter(w => w.category.includes('-z-ով') || w.category.includes('բաղաձայնով')).map(w => (
                      <div key={w.word} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-blue-600 font-black mr-2">la</span>
                        <span className="font-bold">{w.word}</span>
                        <p className="text-xs text-slate-400 mt-1">{w.translation}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Rule 4 */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <Info className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Կանոն 4. -ante և -ista վերջավորություններ</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Այս վերջավորություններով բառերը սովորաբար <b>երկսեռ</b> են (común en cuanto al género): Սեռը որոշվում է միայն հոդով՝ կախված նրանից, թե ում մասին է խոսքը:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 font-black mr-2">el/la</span>
                      <span className="font-bold">artista</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 font-black mr-2">el/la</span>
                      <span className="font-bold">estudiante</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-slate-400 font-black mr-2">el/la</span>
                      <span className="font-bold">dentista</span>
                    </div>
                  </div>
                </section>

                {/* Rule 5 */}
                <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-center gap-3 text-rose-600">
                    <Info className="w-6 h-6" />
                    <h2 className="text-xl font-bold uppercase tracking-wider">Կանոն 5. Ածականներ (grande)</h2>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Ածականները, որոնք ավարտվում են <b>-e</b>-ով կամ բաղաձայնով, չեն փոխում իրենց ձևը ըստ սեռի:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="px-6 py-3 bg-rose-50 text-rose-700 rounded-2xl font-bold border border-rose-100">
                      el coche grande / la casa grande
                    </div>
                    <div className="px-6 py-3 bg-rose-50 text-rose-700 rounded-2xl font-bold border border-rose-100">
                      el chico inteligente / la chica inteligente
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setView('game')}
                  className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                >
                  Սկսել Խաղը
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
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Հարց {currentWordIndex + 1} / {shuffledWords.length}</p>
                      <h2 className="text-3xl font-black text-slate-900">Գուշակիր հոդը</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Միավորներ</p>
                      <p className="text-3xl font-black text-orange-500">{score}</p>
                    </div>
                  </div>

                  {/* Word Card */}
                  <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-slate-100 text-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                      <motion.div 
                        className="h-full bg-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentWordIndex + 1) / shuffledWords.length) * 100}%` }}
                      />
                    </div>

                    <motion.div
                      key={shuffledWords[currentWordIndex].word}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="space-y-2"
                    >
                      <p className="text-slate-400 font-medium italic text-lg">{shuffledWords[currentWordIndex].translation}</p>
                      <h3 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight">
                        {shuffledWords[currentWordIndex].word}
                      </h3>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6 pt-8">
                      <button
                        onClick={() => handleAnswer('el')}
                        disabled={showFeedback}
                        className={`py-6 rounded-3xl text-2xl font-black transition-all border-4 ${
                          showFeedback && shuffledWords[currentWordIndex].article === 'el'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : showFeedback && selectedOption === 'el' && !isCorrect
                            ? 'bg-rose-50 border-rose-500 text-rose-700'
                            : 'bg-white border-slate-100 hover:border-orange-500 text-slate-900 hover:shadow-xl'
                        }`}
                      >
                        EL
                      </button>
                      <button
                        onClick={() => handleAnswer('la')}
                        disabled={showFeedback}
                        className={`py-6 rounded-3xl text-2xl font-black transition-all border-4 ${
                          showFeedback && shuffledWords[currentWordIndex].article === 'la'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : showFeedback && selectedOption === 'la' && !isCorrect
                            ? 'bg-rose-50 border-rose-500 text-rose-700'
                            : 'bg-white border-slate-100 hover:border-blue-500 text-slate-900 hover:shadow-xl'
                        }`}
                      >
                        LA
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-3xl border-2 flex items-center justify-between gap-4 ${
                          isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {isCorrect ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                          <div>
                            <p className="font-black text-xl">{isCorrect ? 'Ճիշտ է!' : 'Սխալ է:'}</p>
                            <p className="font-medium opacity-80">
                              {isCorrect 
                                ? `Այո, դա ${shuffledWords[currentWordIndex].article} ${shuffledWords[currentWordIndex].word} է:` 
                                : `Ճիշտ տարբերակն է՝ ${shuffledWords[currentWordIndex].article} ${shuffledWords[currentWordIndex].word}:`}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={nextQuestion}
                          className="bg-white px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                        >
                          Հաջորդը
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-2 border-slate-100 text-center space-y-8">
                  <Trophy className="w-20 h-20 text-yellow-400 mx-auto" />
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 uppercase">Ավարտ</h2>
                    <p className="text-xl text-slate-500 font-medium">Դուք հավաքեցիք {score} միավոր {shuffledWords.length}-ից:</p>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={restartGame}
                      className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-3"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Կրկին Փորձել
                    </button>
                    <button 
                      onClick={() => setView('theory')}
                      className="text-slate-500 font-bold hover:text-slate-900 transition-all"
                    >
                      Վերադառնալ Տեսությանը
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Tip */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-100">
        <div className="bg-orange-50 p-6 rounded-2xl flex gap-4 items-start">
          <Lightbulb className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
          <div>
            <p className="font-bold text-orange-900 mb-1">Օգտակար խորհուրդ</p>
            <p className="text-orange-800 text-sm leading-relaxed">
              Եթե բառը ավարտվում է <b>-ma</b>-ով և նշանակում է ինչ-որ վերացական բան (թեմա, համակարգ, խնդիր), ապա 99% դեպքերում այն <b>արական</b> է (el):
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
