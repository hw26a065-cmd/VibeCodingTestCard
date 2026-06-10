import { HelpCircle, RefreshCw, Star, Backpack, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { RandomEvent, Card } from '../types';
import { useState } from 'react';
import { getRandomRareCard } from '../utils/gameData';

interface EventScreenProps {
  event: RandomEvent;
  playerState: {
    hp: number;
    maxHp: number;
    gold: number;
    deck: Card[];
    jobId: string;
    permanentStrength: number;
  };
  onComplete: (updatedPlayerState: any, logText: string) => void;
}

export default function EventScreen({
  event,
  playerState,
  onComplete
}: EventScreenProps) {
  const [currentEventState, setCurrentEventState] = useState<'decision' | 'card_removal' | 'rare_acquisition' | 'result'>('decision');
  const [eventLog, setEventLog] = useState<string>('');
  const [interactivePlayer, setInteractivePlayer] = useState<any>({ ...playerState });
  
  // Custom states
  const [goldBonusOnRemove, setGoldBonusOnRemove] = useState<number>(0);

  const handleChoiceSelect = (choice: any) => {
    // Fire effect callback
    const res = choice.action(interactivePlayer);
    let nextPlayer = { ...res.updatedPlayer };
    setEventLog(res.logText);

    // Deep routing if card removal flag is set
    if (nextPlayer._pendingRemoveCard) {
      delete nextPlayer._pendingRemoveCard;
      setInteractivePlayer(nextPlayer);
      setGoldBonusOnRemove(0);
      setCurrentEventState('card_removal');
    } else if (nextPlayer._pendingRemoveCardGold) {
      delete nextPlayer._pendingRemoveCardGold;
      setInteractivePlayer(nextPlayer);
      setGoldBonusOnRemove(30);
      setCurrentEventState('card_removal');
    } else if (nextPlayer._pendingRareCard) {
      delete nextPlayer._pendingRareCard;
      // Gain a rare spell
      const rareCard = getRandomRareCard(playerState.jobId);
      nextPlayer.deck = [...nextPlayer.deck, rareCard];
      setEventLog(prev => `${prev}（獲得：★ ${rareCard.name}）`);
      setInteractivePlayer(nextPlayer);
      setCurrentEventState('result');
    } else {
      setInteractivePlayer(nextPlayer);
      setCurrentEventState('result');
    }
  };

  const handleRemoveCard = (cardIdx: number) => {
    const nextDeck = [...interactivePlayer.deck];
    const removedCard = nextDeck.splice(cardIdx, 1)[0];

    const bonusMsg = goldBonusOnRemove > 0 ? ` +${goldBonusOnRemove}G 獲得` : '';
    setEventLog(prev => `${prev} [デッキ整理完了] 「${removedCard.name}」をデッキから完全に破棄しました。${bonusMsg}`);
    
    setInteractivePlayer(prev => ({
      ...prev,
      deck: nextDeck
    }));
    setCurrentEventState('result');
  };

  const handleFinishEvent = () => {
    onComplete(interactivePlayer, eventLog);
  };

  return (
    <div className="flex flex-col min-h-[80vh] justify-center bg-slate-950/80 rounded-2xl border border-slate-850 p-6 md:p-12 relative overflow-hidden select-none glass-panel">
      
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-3xl" />

      <AnimatePresence mode="wait">
        
        {/* PHASE A: DECISION MAKING */}
        {currentEventState === 'decision' && (
          <motion.div
            key="decision"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-10 max-w-2xl mx-auto w-full text-center"
          >
            <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-505/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-xl shadow-indigo-500/5">
              <HelpCircle className="w-8 h-8 animate-pulse" />
            </div>

            <header className="mb-6">
              <span className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase block mb-1">UNEXPECTED SITE</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100">{event.title}</h2>
            </header>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 max-w-xl mx-auto italic font-medium">
              ”{event.description}”
            </p>

            {/* Choices Box list */}
            <div className="flex flex-col gap-3.5 text-left">
              {event.choices.map((choice, i) => {
                const satisfies = choice.requirement ? choice.requirement(interactivePlayer) : true;
                return (
                  <button
                    key={i}
                    disabled={!satisfies}
                    onClick={() => handleChoiceSelect(choice)}
                    className={`w-full p-4 rounded-xl border-2 text-left font-sans text-sm font-semibold transition-all flex justify-between items-center gap-4 ${
                      satisfies 
                        ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900 cursor-pointer active:translate-y-0.5' 
                        : 'bg-slate-950 border-slate-900 opacity-35 cursor-not-allowed text-slate-600'
                    }`}
                  >
                    <div>
                      <span className="text-slate-200 block text-sm md:text-base font-bold">{choice.text}</span>
                      <span className="text-xs text-slate-400 font-medium block mt-1">{choice.effectText}</span>
                    </div>
                    {satisfies ? (
                      <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono border border-rose-900/40 text-rose-500/60 px-2 py-0.5 rounded uppercase">条件不足</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* PHASE B: CARD REMOVAL (Thinning deck) */}
        {currentEventState === 'card_removal' && (
          <motion.div
            key="card_removal"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative z-10 max-w-2xl mx-auto w-full"
          >
            <header className="mb-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-slate-200">デッキ整理 (破棄するカードを1枚選択)</h3>
              <p className="text-xs text-rose-400 mt-1">選択したカードをデッキから永久に削除します（ドロー効率アップに最適）。</p>
            </header>

            {/* List to choose */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-900/40 p-5 rounded-xl border border-slate-900 max-h-[350px] overflow-y-auto mb-6">
              {interactivePlayer.deck.map((card: Card, idx: number) => {
                return (
                  <div
                    key={`${card.id}-removal-${idx}`}
                    onClick={() => handleRemoveCard(idx)}
                    className="cursor-pointer bg-slate-950 border border-slate-850 hover:border-rose-500 hover:bg-slate-900 p-3.5 rounded-xl text-center flex flex-col justify-between h-30 transition group shrink-0 select-none"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-mono bg-slate-900 text-slate-400 px-1 py-0.5 rounded border border-slate-800">
                        {card.cost}コ
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-505" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-200 group-hover:text-rose-400 transition truncate">{card.name}</h4>
                      <p className="text-[8px] text-slate-500 mt-0.5 uppercase tracking-tight">{card.type}</p>
                    </div>
                    <p className="text-[8px] text-slate-400 leading-snug line-clamp-2 mt-1.5 font-medium">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <p className="text-slate-500 text-center text-xs font-semibold">
              ※ デッキ枚数が少ないほど、強いカードを引く確率が上がります
            </p>
          </motion.div>
        )}

        {/* PHASE D: SHOW RESULTS */}
        {currentEventState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative z-10 max-w-md mx-auto w-full text-center"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6 shadow-md shadow-indigo-500/5 animate-[bounce_2s_infinite]">
              <Star className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-200 mb-4 tracking-tight">イベントが終息しました</h3>

            <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-sm font-semibold text-slate-350 max-w-sm mx-auto mb-8 font-sans leading-relaxed">
              ” {eventLog} ”
            </div>

            <button
              onClick={handleFinishEvent}
              className="px-10 py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-slate-100 font-extrabold text-xs uppercase tracking-widest rounded-lg border border-indigo-400 shadow-xl shadow-indigo-500/10 cursor-pointer transition active:translate-y-0.5"
            >
              近くの道へ進出する
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
