import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Coffee, 
  IceCream, 
  BookOpen, 
  CheckCircle2, 
  RefreshCw, 
  User, 
  MessageSquare,
  ChevronRight,
  Star,
  Trophy,
  Bird
} from 'lucide-react';

interface DialogueStep {
  speaker: 'José' | 'Paulina';
  text: string;
  translation: string;
  blanks: {
    word: string;
    options: string[];
  }[];
}

const DIALOGUE: DialogueStep[] = [
  {
    speaker: 'José',
    text: '¡Hola, Paulina! Tengo mucha [hambre]. ¿Quieres un [bistec]?',
    translation: 'Ողջույն, Պաուլինա՛: Ես շատ սոված եմ: Սթեյք ուզո՞ւմ ես:',
    blanks: [
      { word: 'hambre', options: ['hambre', 'sed', 'sueño'] },
      { word: 'bistec', options: ['bistec', 'pollo', 'pescado'] }
    ]
  },
  {
    speaker: 'Paulina',
    text: '¡Hola! No, hoy no quiero [carne]. Quiero una [paella] con mariscos.',
    translation: 'Ո՛չ, այսօր միս չեմ ուզում: Ծովամթերքով պաելյա եմ ուզում:',
    blanks: [
      { word: 'carne', options: ['carne', 'fruta', 'verdura'] },
      { word: 'paella', options: ['paella', 'sopa', 'pizza'] }
    ]
  },
  {
    speaker: 'José',
    text: '¡Qué buena idea! Yo también quiero paella entonces. Pero primero tengo que [beber] algo, tengo mucha [sed].',
    translation: 'Ի՜նց լավ գաղափար է: Դե ուրեմն ես նույնպես պաելյա եմ ուզում: Բայց նախ ես պետք է մի բան խմեմ, շատ ծարավ եմ:',
    blanks: [
      { word: 'beber', options: ['beber', 'comer', 'dormir'] },
      { word: 'sed', options: ['sed', 'hambre', 'calor'] }
    ]
  },
  {
    speaker: 'Paulina',
    text: 'Yo también tengo sed. Quiero un [jugo] de naranja.',
    translation: 'Ես նույնպես ծարավ եմ: Նարնջի հյութ եմ ուզում:',
    blanks: [
      { word: 'jugo', options: ['jugo', 'agua', 'leche'] }
    ]
  },
  {
    speaker: 'José',
    text: '¡Perfecto! Y de [postre]… ¿quieres un [helado] de chocolate?',
    translation: 'Հիանալի է: Իսկ դեսերտին... շոկոլադե պաղպաղակ ուզո՞ւմ ես:',
    blanks: [
      { word: 'postre', options: ['postre', 'entrada', 'plato'] },
      { word: 'helado', options: ['helado', 'pastel', 'fruta'] }
    ]
  },
  {
    speaker: 'Paulina',
    text: '¡Sí! Tengo ganas de un helado frío. Pero, José, tenemos que [estudiar] después de comer. Mañana hay [examen].',
    translation: 'Այո՛: Սառը պաղպաղակի ցանկություն ունեմ: Բայց, Խոսե՛, ուտելուց հետո մենք պետք է սովորենք: Վաղը քննություն կա:',
    blanks: [
      { word: 'estudiar', options: ['estudiar', 'jugar', 'trabajar'] },
      { word: 'examen', options: ['examen', 'fiesta', 'viaje'] }
    ]
  },
  {
    speaker: 'José',
    text: 'Es verdad. Tengo que sacar una buena [nota]. ¡Vamos a comer rápido!',
    translation: 'Էս վերջը: Պետք է լավ գնահատական ստանամ: Արի արագ ուտենք:',
    blanks: [
      { word: 'nota', options: ['nota', 'foto', 'carta'] }
    ]
  }
];

export default function RestaurantGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [filledBlanks, setFilledBlanks] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [completedDialogue, setCompletedDialogue] = useState<{speaker: string, text: string}[]>([]);

  const step = DIALOGUE[currentStep];

  const currentBlankIndex = filledBlanks.length;
  const isStepComplete = currentBlankIndex === step.blanks.length;

  const handleOptionClick = (option: string) => {
    if (isStepComplete || feedback) return;

    const correctWord = step.blanks[currentBlankIndex].word;
    if (option === correctWord) {
      setFilledBlanks([...filledBlanks, option]);
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 600);
    }
  };

  const nextStep = () => {
    const fullText = step.text.replace(/\[(.*?)\]/g, (_, word) => word);
    setCompletedDialogue([...completedDialogue, { speaker: step.speaker, text: fullText }]);
    
    if (currentStep < DIALOGUE.length - 1) {
      setCurrentStep(currentStep + 1);
      setFilledBlanks([]);
    } else {
      setGameState('finished');
    }
  };

  const renderTextWithBlanks = () => {
    let parts = step.text.split(/(\[.*?\])/);
    let blankCounter = 0;

    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const currentBlank = blankCounter++;
        const isFilled = filledBlanks[currentBlank];
        return (
          <span 
            key={index}
            className={`mx-1 px-2 py-0.5 rounded-lg border-b-2 transition-all duration-300 ${
              isFilled 
                ? 'bg-emerald-100 border-emerald-500 text-emerald-700 font-bold' 
                : currentBlank === currentBlankIndex 
                  ? 'bg-orange-50 border-orange-400 min-w-[60px] inline-block animate-pulse' 
                  : 'bg-slate-100 border-slate-300 min-w-[60px] inline-block'
            }`}
          >
            {isFilled || '...'}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const restart = () => {
    setCurrentStep(0);
    setFilledBlanks([]);
    setGameState('playing');
    setCompletedDialogue([]);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] text-slate-900 font-sans selection:bg-orange-200 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight uppercase text-orange-600">En el Restaurante</span>
          </div>
          <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            <Star className="w-4 h-4 text-orange-500 fill-current" />
            <span className="text-xs font-black text-orange-700">{currentStep + 1} / {DIALOGUE.length}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Restaurant Scene Visualization */}
        <div className="relative h-64 bg-gradient-to-b from-sky-100 to-orange-50 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden flex items-end justify-center gap-20 pb-8">
          {/* Background elements */}
          <div className="absolute top-10 left-10 opacity-20"><Bird className="w-12 h-12 text-orange-500" /></div>
          <div className="absolute top-20 right-20 opacity-20 rotate-12"><Coffee className="w-16 h-16 text-orange-300" /></div>
          
          {/* Table */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-orange-200 rounded-t-full border-t-4 border-orange-300 z-10 flex items-center justify-center">
             <div className="flex gap-4 -mt-10">
                <Utensils className="w-6 h-6 text-orange-400 opacity-50" />
                <IceCream className="w-6 h-6 text-orange-400 opacity-50" />
             </div>
          </div>

          {/* José */}
          <motion.div 
            animate={{ 
              scale: step.speaker === 'José' ? 1.1 : 1,
              y: step.speaker === 'José' ? -10 : 0,
              opacity: step.speaker === 'José' ? 1 : 0.7
            }}
            className="relative z-20 flex flex-col items-center"
          >
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-xl transition-colors duration-500 ${step.speaker === 'José' ? 'bg-orange-500 border-white' : 'bg-slate-200 border-slate-300'}`}>
              <User className={`w-12 h-12 ${step.speaker === 'José' ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <span className={`mt-2 font-black text-xs uppercase tracking-widest ${step.speaker === 'José' ? 'text-orange-600' : 'text-slate-400'}`}>José</span>
            {step.speaker === 'José' && !isStepComplete && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg border border-orange-100"
              >
                <MessageSquare className="w-4 h-4 text-orange-500" />
              </motion.div>
            )}
          </motion.div>

          {/* Paulina */}
          <motion.div 
            animate={{ 
              scale: step.speaker === 'Paulina' ? 1.1 : 1,
              y: step.speaker === 'Paulina' ? -10 : 0,
              opacity: step.speaker === 'Paulina' ? 1 : 0.7
            }}
            className="relative z-20 flex flex-col items-center"
          >
            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center shadow-xl transition-colors duration-500 ${step.speaker === 'Paulina' ? 'bg-pink-500 border-white' : 'bg-slate-200 border-slate-300'}`}>
              <User className={`w-12 h-12 ${step.speaker === 'Paulina' ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <span className={`mt-2 font-black text-xs uppercase tracking-widest ${step.speaker === 'Paulina' ? 'text-pink-600' : 'text-slate-400'}`}>Paulina</span>
            {step.speaker === 'Paulina' && !isStepComplete && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-4 -left-4 bg-white p-2 rounded-full shadow-lg border border-pink-100"
              >
                <MessageSquare className="w-4 h-4 text-pink-500" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Dialogue Area */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {gameState === 'playing' ? (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-orange-50 relative"
              >
                {/* Speaker Indicator */}
                <div className={`absolute -top-4 left-10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md ${step.speaker === 'José' ? 'bg-orange-500' : 'bg-pink-500'}`}>
                  {step.speaker} dice:
                </div>

                <div className="space-y-6">
                  <div className="text-2xl md:text-3xl font-medium leading-relaxed text-slate-800">
                    {renderTextWithBlanks()}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-sm italic text-slate-400 leading-relaxed">
                      {step.translation}
                    </p>
                  </div>

                  {/* Options */}
                  {!isStepComplete ? (
                    <div className="pt-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Selecciona la palabra correcta:</p>
                      <div className="flex flex-wrap gap-3">
                        {step.blanks[currentBlankIndex].options.map((option) => (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOptionClick(option)}
                            className="px-6 py-3 bg-slate-50 hover:bg-orange-500 hover:text-white rounded-2xl font-bold text-lg border-2 border-slate-100 hover:border-orange-400 transition-all shadow-sm"
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-6 flex justify-end"
                    >
                      <button 
                        onClick={nextStep}
                        className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                      >
                        Continuar <ChevronRight className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Feedback Overlay */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                    >
                      <div className={`p-6 rounded-full shadow-2xl ${feedback === 'correct' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                        {feedback === 'correct' ? <CheckCircle2 className="w-12 h-12 text-white" /> : <RefreshCw className="w-12 h-12 text-white animate-spin" />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[3rem] shadow-2xl border border-orange-100 text-center space-y-8"
              >
                <div className="relative inline-block">
                  <Trophy className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-[0_0_20px_rgba(250,204,21,0.3)]" />
                  <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute -top-4 -right-4 bg-emerald-500 p-3 rounded-full shadow-lg"
                  >
                    <Star className="w-6 h-6 text-white fill-current" />
                  </motion.div>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-4xl font-black tracking-tight text-slate-800 uppercase">¡Excelente trabajo!</h2>
                  <p className="text-slate-500 font-medium max-w-md mx-auto">Has completado el diálogo en el restaurante y estás listo para tu examen.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left space-y-4 max-h-64 overflow-y-auto">
                   {completedDialogue.map((d, i) => (
                     <div key={i} className="flex gap-3">
                        <span className={`font-black text-[10px] uppercase tracking-widest mt-1 ${d.speaker === 'José' ? 'text-orange-500' : 'text-pink-500'}`}>{d.speaker}:</span>
                        <p className="text-sm text-slate-700">{d.text}</p>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={restart}
                  className="px-12 py-5 bg-orange-500 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 flex items-center gap-3 mx-auto"
                >
                  <RefreshCw className="w-5 h-5" />
                  Jugar de nuevo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Mascot Tip */}
        <footer className="flex items-center justify-center gap-6 py-8 border-t border-orange-100">
          <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-100">
            <Bird className="w-8 h-8 text-white" />
          </div>
          <div className="max-w-xs">
            <p className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1">Consejo de Jose</p>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Ուշադրություն դարձրեք բայերին: "Quiero" նշանակում է «ուզում եմ», իսկ "Tengo hambre"՝ «սոված եմ»:
            </p>
          </div>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}} />
    </div>
  );
}
