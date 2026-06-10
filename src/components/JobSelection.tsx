import { Shield, Wand2, Heart, Coins, Lightbulb, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Job } from '../types';
import { JOBS } from '../utils/gameData';
import { useState } from 'react';

interface JobSelectionProps {
  onSelect: (job: Job) => void;
  onBack: () => void;
}

export default function JobSelection({ onSelect, onBack }: JobSelectionProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(JOBS[0].id);

  const selectedJob = JOBS.find(j => j.id === selectedJobId) || JOBS[0];

  return (
    <div className="flex flex-col min-h-[80vh] bg-slate-950/80 text-slate-100 rounded-2xl border border-slate-800/80 p-6 md:p-10 relative overflow-hidden glass-panel">
      <div className="max-w-4xl mx-auto w-full">
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-serif font-black tracking-tight text-amber-300 mb-2">
            職業（ジョブ）を選択
          </h2>
          <p className="text-slate-400 text-sm">
            あなたの戦闘スタイルに合ったジョブを選んで、ダンジョンの深淵へ挑みましょう。
          </p>
        </header>

        {/* Jobs Choice Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {JOBS.map((job) => {
            const isSelected = job.id === selectedJobId;
            return (
              <motion.div
                key={job.id}
                whileHover={{ scale: 1.01, y: -2 }}
                onClick={() => setSelectedJobId(job.id)}
                className={`cursor-pointer rounded-xl p-5 border-2 transition-all relative ${
                  isSelected 
                    ? 'bg-slate-900/90 border-amber-400 shadow-xl shadow-amber-500/10' 
                    : 'bg-slate-950/30 border-slate-850 hover:border-slate-700 hover:bg-slate-900/20'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 p-1 rounded-full shadow">
                    <Check className="w-4 h-4 stroke-[3px]" />
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-lg ${job.id === 'knight' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-violet-500/10 text-violet-400 border border-violet-500/20'}`}>
                    {job.id === 'knight' ? <Shield className="w-6 h-6" /> : <Wand2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-200">{job.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">初期デッキ: {job.initialDeck.length}枚</span>
                  </div>
                </div>

                <p className="text-sm text-slate-450 leading-relaxed mb-4 font-sans font-medium">
                  {job.description}
                </p>

                {/* Micro Stats Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-900">
                  <div className="flex items-center gap-1.5 justify-center">
                    <Heart className="w-4 h-4 text-rose-505 fill-rose-500/10" />
                    <span className="text-xs font-bold font-mono text-slate-300">{job.hp} HP</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <Lightbulb className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold font-mono text-slate-300">{job.energy} コスト</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold font-mono text-slate-300">{job.gold} G</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Deck Preview Box */}
        <div className="bg-slate-900/40 rounded-xl p-5 border border-slate-850/80 mb-8">
          <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
            [{selectedJob.name}] の初期搭載カードプレビュー (合計 {selectedJob.initialDeck.length} 枚)
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {selectedJob.initialDeck.map((card, i) => (
              <div 
                key={`${card.id}-${i}`}
                className="bg-slate-950/60 p-3 rounded-xl border border-slate-850/80 text-center flex flex-col justify-between h-28 hover:border-slate-700 hover:bg-slate-900/40 transition"
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-400 font-bold">
                      {card.cost}コ
                    </span>
                    <span className={`w-2 h-2 rounded-full ${card.type === 'attack' ? 'bg-rose-500' : 'bg-cyan-500'}`} />
                  </div>
                  <h5 className="text-xs font-bold text-slate-200 truncate">{card.name}</h5>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-snug">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action controls */}
        <div className="flex justify-between items-center sm:gap-4 mt-8">
          <button
            onClick={onBack}
            className="px-5 py-3 font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-slate-850/85 rounded-lg cursor-pointer transition text-sm"
          >
            タイトルに戻る
          </button>
          
          <button
            id="btn-confirm-job"
            onClick={() => onSelect(selectedJob)}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-lg cursor-pointer transition shadow-lg shadow-amber-500/10 text-sm flex items-center border border-amber-300/20"
          >
            この職業で探索を開始
          </button>
        </div>
      </div>
    </div>
  );
}
