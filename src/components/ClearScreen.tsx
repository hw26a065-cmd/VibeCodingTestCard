import { Crown, Skull, Backpack, RefreshCw, Trophy, Coins, Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../types';

interface ClearScreenProps {
  isVictory: boolean;
  playerState: {
    hp: number;
    maxHp: number;
    gold: number;
    jobName: string;
    deck: Card[];
  };
  combatStats: {
    normalWins: number;
    eliteWins: number;
    bossWins: number;
    eventsTriggered: number;
    highestDepth: number;
  };
  onRestart: () => void;
}

export default function ClearScreen({
  isVictory,
  playerState,
  combatStats,
  onRestart
}: ClearScreenProps) {
  
  // Dynamic score calculator
  const basePoints = isVictory ? 2000 : 200;
  const depthBonus = combatStats.highestDepth * 300;
  const normalBonus = combatStats.normalWins * 150;
  const eliteBonus = combatStats.eliteWins * 400;
  const bossBonus = combatStats.bossWins * 1200;
  const goldBonus = Math.floor(playerState.gold * 1.5);
  // Rogue players strive for compact decks, reward compact or premium decks
  const cardsCount = playerState.deck.length;
  const deckBonus = cardsCount <= 12 ? 600 : cardsCount <= 15 ? 300 : 0;
  const hpBonus = isVictory ? Math.floor((playerState.hp / playerState.maxHp) * 500) : 0;

  const totalScore = basePoints + depthBonus + normalBonus + eliteBonus + bossBonus + goldBonus + deckBonus + hpBonus;

  return (
    <div className="flex flex-col min-h-[85vh] bg-slate-950/80 font-sans text-slate-100 rounded-2xl border border-slate-850 p-6 md:p-10 relative overflow-hidden glass-panel">
      
      {/* Visual background flares */}
      {isVictory ? (
        <div className="absolute top-0 inset-x-0 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      ) : (
        <div className="absolute top-0 inset-x-0 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="max-w-3xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        {/* RESULT GREETING HERO BAR */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          {isVictory ? (
            <div className="flex flex-col items-center">
              <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
                <Crown className="w-12 h-12 animate-[bounce_2s_infinite]" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-300 drop-shadow-sm mb-2">
                ダンジョン完全制覇！
              </h1>
              <p className="text-sm text-amber-400/80 font-semibold tracking-wide uppercase">
                神話の深淵を乗り越え、魔王を討伐しました！
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-500 mb-4 shadow-lg shadow-rose-500/10">
                <Skull className="w-12 h-12 text-rose-500 animate-[shake_1.5s_infinite]" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-400 to-orange-400 drop-shadow-sm mb-2">
                力尽き、果ててしまった...
              </h1>
              <p className="text-sm text-rose-400/80 font-semibold tracking-wide uppercase">
                深淵の闇は深く、英雄の魂はキャンプの灰に散った
              </p>
            </div>
          )}
        </motion.div>

        {/* SCORE SUMMARY BOARD */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl w-full mb-8 relative">
          <div className="absolute top-3 right-4 flex items-center gap-1 text-[10px] text-slate-500 font-mono">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>RUN SUMMARY</span>
          </div>

          <h3 className="text-slate-200 text-sm font-bold uppercase tracking-wider border-b border-slate-800 pb-2.5 mb-4">
            リザルト・スコア計算
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 text-sm">
            
            {/* Base score */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-indigo-400" />
                基礎ポイント ({isVictory ? 'クリア達成' : 'リタイア'})
              </span>
              <span className="font-mono font-bold text-slate-300">+{basePoints}</span>
            </div>

            {/* Depth reward */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-emerald-400" />
                最高到達深度 (第 {combatStats.highestDepth} 階層)
              </span>
              <span className="font-mono font-bold text-slate-300">+{depthBonus}</span>
            </div>

            {/* Combat stats: Normal */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                ⚔️ 魔物討伐数 (通常 x {combatStats.normalWins})
              </span>
              <span className="font-mono font-bold text-slate-300">+{normalBonus}</span>
            </div>

            {/* Combat stats: Elite */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                👹 強敵討伐数 (エリート x {combatStats.eliteWins})
              </span>
              <span className="font-mono font-bold text-slate-300">+{eliteBonus}</span>
            </div>

            {/* Boss combat */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                🐉 ボス討伐数 (x {combatStats.bossWins})
              </span>
              <span className="font-mono font-bold text-slate-300">+{bossBonus}</span>
            </div>

            {/* Remaining gold */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-500" />
                残存金貨 (x {playerState.gold}G)
              </span>
              <span className="font-mono font-bold text-amber-400">+{goldBonus}</span>
            </div>

            {/* Deck optimization */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                <Backpack className="w-4 h-4 text-cyan-400" />
                デッキ最適化ボーナス ({cardsCount}枚デッキ)
              </span>
              <span className="font-mono font-bold text-cyan-300">+{deckBonus}</span>
            </div>

            {/* Remaining player health */}
            <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 text-slate-400">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" />
                生存比率ボーナス (HP {playerState.hp}/{playerState.maxHp})
              </span>
              <span className="font-mono font-bold text-rose-400">+{hpBonus}</span>
            </div>

          </div>

          {/* TOTAL SCORE CALC BLOCK */}
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
            <span className="text-base font-extrabold text-slate-350">統合最終スコア</span>
            <div className="text-2xl md:text-3xl font-black font-mono text-amber-400 tracking-wide">
              {totalScore.toLocaleString()} pts
            </div>
          </div>
        </div>

        {/* FINAL DECK VIEW BOX */}
        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-850 w-full mb-8">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h4 className="text-sm font-extrabold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <Backpack className="w-4 h-4 text-indigo-400" />
              最終デッキ構成 ({cardsCount} 枚)
            </h4>
            <span className="text-xs font-semibold text-slate-504">使用ジョブ: {playerState.jobName}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 max-h-[280px] overflow-y-auto pr-1">
            {playerState.deck.map((card, idx) => (
              <div 
                key={`${card.id}-finalpack-${idx}`}
                className="bg-slate-950 p-3 rounded-lg border border-slate-850 flex flex-col justify-between h-28 shrink-0 hover:border-slate-800 transition"
              >
                <div>
                  <div className="flex justify-between items-center mb-1 leading-none">
                    <span className="text-[9px] font-mono bg-slate-900 text-slate-300 border border-slate-850 px-1 rounded">
                      {card.cost}コ
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${card.type === 'attack' ? 'bg-red-500' : 'bg-blue-500'}`} />
                  </div>
                  <h5 className="text-xs font-black text-slate-200 truncate">{card.name}</h5>
                </div>
                <div>
                  <p className="text-[8px] text-slate-500 leading-normal line-clamp-2">
                    {card.description}
                  </p>
                  <span className={`inline-block text-[7px] uppercase font-bold tracking-widest font-mono ${
                    card.type === 'attack' ? 'text-rose-400' : 'text-cyan-400'
                  }`}>
                    {card.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PLAY AGAIN RESTART BUTTON */}
        <button
          onClick={onRestart}
          className="group relative inline-flex items-center justify-center px-10 py-4 font-sans text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-xl shadow-amber-500/10 cursor-pointer active:translate-y-0.5 transition-all w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2.5 text-slate-950 animate-[spin_5s_infinite]" />
          もう一度遊ぶ
        </button>

      </div>
    </div>
  );
}
