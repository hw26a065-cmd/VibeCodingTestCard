import { Sparkles, Play, Shield, Wand2, BookOpen, Settings, X, Heart, Zap, Flame, Trash2, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface TitleScreenProps {
  onStart: () => void;
  onStartDevMode: () => void;
}

export default function TitleScreen({ onStart, onStartDevMode }: TitleScreenProps) {
  const [showDictionary, setShowDictionary] = useState<boolean>(false);

  // Dictionary items definitions
  const dictItems = [
    {
      title: '筋力 (Strength)',
      icon: <Flame className="w-5 h-5 text-rose-500 fill-rose-500/10" />,
      tag: 'BUFF / バフ効果',
      color: 'border-rose-500/20 bg-rose-500/5',
      desc: 'すべての攻撃カード（アタック）に [筋力値] 分の追加ダメージを恒久的にプラスします。怒りの一撃やウォークライ等で獲得できます。'
    },
    {
      title: 'シールド (Shield)',
      icon: <Shield className="w-5 h-5 text-cyan-400 fill-cyan-400/10" />,
      tag: 'DEFENSE / 防御効果',
      color: 'border-cyan-500/20 bg-cyan-500/5',
      desc: 'ターン中の敵の攻撃ダメージを直接吸収・相殺する盾です。プレイヤーのターン開始時に消失（0にリセット）します。'
    },
    {
      title: '脆弱 (Vulnerable)',
      icon: <HelpCircle className="w-5 h-5 text-amber-500" />,
      tag: 'DEBUFF / デバフ効果',
      color: 'border-amber-500/20 bg-amber-500/5',
      desc: '受ける「攻撃ダメージ」が 1.5 倍（50%増加）に跳ね上がる弱体化呪い効果です。バッシュやアイスボルト等で敵・自身に付与されます。'
    },
    {
      title: '消滅 (Exhaust)',
      icon: <Trash2 className="w-5 h-5 text-red-400" />,
      tag: 'RULE / 特別規則',
      color: 'border-red-500/20 bg-red-500/5',
      desc: '「戦闘中にプレイヤーの攻撃力を増加させるカード」は強力すぎるため、一度使用すると自動的に消滅。本バトルの山札・捨て札・手札から完全除外されます。'
    },
    {
      title: 'エネルギー (Energy)',
      icon: <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400/10" />,
      tag: 'COST / コスト',
      color: 'border-yellow-500/20 bg-yellow-500/5',
      desc: 'カードの使用費用の基本パラメータです。ターンごとに最大3まで充填。コスト制限を超えてカードをプレイすることはできません。'
    },
    {
      title: '脆弱性（魔物側シールド消失）',
      icon: <Settings className="w-5 h-5 text-purple-400" />,
      tag: 'RULE / 敵の防御リセット',
      color: 'border-purple-500/20 bg-purple-500/5',
      desc: '敵自身が得たシールド数値についても、敵のターン開始時に綺麗に 0 に初期化されるため、ターンごとに攻撃を組み立てて防壁を崩す必要があります。'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative overflow-hidden bg-slate-950/80 backend-blur-lg rounded-2xl border border-slate-800/80 shadow-2xl p-12 glass-panel">
      {/* Background Decor */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating icons block */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex gap-4 mb-8"
      >
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 shadow-lg shadow-amber-500/5 backdrop-blur-md">
          <Shield className="w-8 h-8" />
        </div>
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shadow-lg shadow-indigo-500/5 backdrop-blur-md">
          <Wand2 className="w-8 h-8" />
        </div>
      </motion.div>

      {/* Main Typography */}
      <motion.h1 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="font-serif text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-zinc-300 select-none drop-shadow-lg mb-6 leading-tight"
      >
        ルイン・カード・ダンジョン
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-slate-400 font-sans text-sm md:text-base max-w-lg mb-12 leading-relaxed"
      >
        選択した職業の特性を活かし、ダンジョンを探索しながら強力なスペルや必殺技を組み立てる、本格ローグライク・デッキ構築カードゲーム。
      </motion.p>

      {/* Primary Actions Group */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10 w-full max-w-lg"
      >
        {/* Play game */}
        <button
          id="btn-game-start"
          onClick={onStart}
          className="w-full sm:w-auto min-w-[200px] group relative inline-flex items-center justify-center px-8 py-4.5 font-sans text-md font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 rounded-xl shadow-xl shadow-amber-500/10 active:translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden border border-amber-300/30"
        >
          {/* Shine effect inside button */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <Play className="w-4 h-4 mr-2.5 fill-slate-950 text-slate-950" />
          探索を始める
        </button>

        {/* Dictionary button */}
        <button
          onClick={() => setShowDictionary(true)}
          className="w-full sm:w-auto min-w-[150px] inline-flex items-center justify-center px-6 py-4.5 font-sans font-bold text-slate-300 hover:text-slate-100 bg-slate-900 hover:bg-slate-850/80 rounded-xl border border-slate-800 transition cursor-pointer text-sm"
        >
          <BookOpen className="w-4 h-4 mr-2 text-indigo-400" />
          キーワード図鑑
        </button>

        {/* Dev sandbox mode */}
        <button
          onClick={onStartDevMode}
          className="w-full sm:w-auto min-w-[150px] inline-flex items-center justify-center px-6 py-4.5 font-sans font-bold text-emerald-400 hover:text-emerald-350 bg-slate-900 border border-emerald-950/40 hover:border-emerald-800/40 hover:bg-slate-850/60 rounded-xl transition cursor-pointer text-sm"
        >
          <Settings className="w-4 h-4 mr-2 text-emerald-500 animate-spin-slow" />
          開発者モード
        </button>
      </motion.div>

      {/* Micro Info Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 flex items-center gap-2 text-xs text-slate-600 font-mono tracking-wide"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500/50 animate-pulse" />
        <span>PROTOTYPE v1.2 • SANDBOX & SYSTEM DICTIONARY ENABLED</span>
      </motion.div>

      {/* 📘 SYSTEM DICTIONARY POPUP MODAL 📘 */}
      <AnimatePresence>
        {showDictionary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 text-left"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-slate-100">戦闘キーワード・状態効果図鑑</h3>
                    <p className="text-xs text-slate-400">ルイン・カード・ダンジョンの戦闘ルールと状態効果の定義解説</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowDictionary(false)}
                  className="p-1 px-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition flex items-center text-xs gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>閉じる</span>
                </button>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto scroll-hide pr-1">
                {dictItems.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-xl border ${item.color} flex flex-col justify-between transition-all hover:scale-[1.01]`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-950/40 border border-white/5">
                            {item.icon}
                          </div>
                          <span className="font-bold text-sm text-slate-100">{item.title}</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 font-extrabold">{item.tag}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-500 font-mono">
                  ※ それぞれの特性を利用した高度なシナジー（例：脆弱ターンの延長や、筋力バフによる多段アタック強化）が勝利の鍵となります。
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
