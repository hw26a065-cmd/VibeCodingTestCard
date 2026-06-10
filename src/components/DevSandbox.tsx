import { useState } from 'react';
import { Card, Job, Enemy } from '../types';
import { KNIGHT_CARDS, MAGE_CARDS, JOBS, NORMAL_ENEMIES, ELITE_ENEMIES, BOSS_ENEMIES, generateEnemy } from '../utils/gameData';
import { Shield, Wand2, Plus, Trash2, Play, ArrowLeft, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DevSandboxProps {
  onBack: () => void;
  onLaunchBattle: (customDeck: Card[], customJob: Job, customEnemy: Enemy) => void;
}

export default function DevSandbox({ onBack, onLaunchBattle }: DevSandboxProps) {
  const [selectedJobId, setSelectedJobId] = useState<'knight' | 'mage'>('knight');
  const [customDeck, setCustomDeck] = useState<Card[]>([
    ...JOBS[0].initialDeck // Default with Knight starting cards
  ]);
  
  // Custom combat settings
  const [customHp, setCustomHp] = useState<number>(80);
  const [strengthBuff, setStrengthBuff] = useState<number>(0);
  
  // Opponent custom parameters
  const [enemyCategory, setEnemyCategory] = useState<'normal' | 'elite' | 'boss'>('normal');
  const [enemyIndex, setEnemyIndex] = useState<number>(0);
  const [combatDepth, setCombatDepth] = useState<number>(3); // Standard Level 3 modifier

  // Categorized Enemy Lists
  const getEnemyList = () => {
    switch (enemyCategory) {
      case 'normal': return NORMAL_ENEMIES;
      case 'elite': return ELITE_ENEMIES;
      case 'boss': return BOSS_ENEMIES;
    }
  };

  const currentEnemyList = getEnemyList();
  const selectedEnemyType = currentEnemyList[enemyIndex] || currentEnemyList[0] || NORMAL_ENEMIES[0];

  // Card Pools
  const fullCardPool = selectedJobId === 'knight' ? KNIGHT_CARDS : MAGE_CARDS;

  // Handler to add a card to the custom test deck
  const handleAddCard = (card: Card) => {
    // Generate fresh unique ID so multiple of the same cards are independently identifyable
    const uniqueCard: Card = {
      ...card,
      id: `${card.id}_sandbox_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
    setCustomDeck(prev => [...prev, uniqueCard]);
  };

  // Handler to delete card
  const handleRemoveCardIdx = (indexToRemove: number) => {
    setCustomDeck(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Preset quick templates
  const handleApplyPresetDeck = (jobId: 'knight' | 'mage') => {
    const jobPreset = JOBS.find(j => j.id === jobId);
    if (jobPreset) {
      setCustomDeck([...jobPreset.initialDeck]);
      setCustomHp(jobPreset.hp);
      setSelectedJobId(jobId);
    }
  };

  // Add all cards from active pool
  const handleAddAllFromActivePool = () => {
    const batch = fullCardPool.map(card => ({
      ...card,
      id: `${card.id}_sandbox_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    }));
    setCustomDeck(prev => [...prev, ...batch]);
  };

  // Launch Battle Action
  const handleStartSandboxBattle = () => {
    if (customDeck.length === 0) {
      alert('戦闘を開始するには、デッキに最低1枚以上のカードを追加してください。');
      return;
    }

    // Bind custom job config representatively
    const matchedJob = JOBS.find(j => j.id === selectedJobId) || JOBS[0];
    const customizedJob: Job = {
      ...matchedJob,
      hp: customHp,
      maxHp: customHp,
      initialDeck: customDeck
    };

    // Instantiate customized Enemy from template
    // We can simulate generateEnemy or map manually with absolute HP control
    const difficultyMultiplier = 1 + (combatDepth * 0.12);
    const calculatedEnemyHp = Math.floor(selectedEnemyType.maxHp * difficultyMultiplier);

    // Initial basic combat intent
    const randomEnemyInstance: Enemy = {
      id: `${selectedEnemyType.type}_sandbox_${Date.now()}`,
      name: `[テスト] ${selectedEnemyType.name}`,
      hp: calculatedEnemyHp,
      maxHp: calculatedEnemyHp,
      shield: 0,
      image: selectedEnemyType.image,
      vulnerableTurns: 0,
      strength: 0,
      intent: {
        type: 'attack',
        value: 5,
        description: '体を震わせ、体当たりを構えている！'
      }
    };

    // Fire callback back to App container
    onLaunchBattle(customDeck, customizedJob, randomEnemyInstance);
  };

  return (
    <div className="flex flex-col min-h-[85vh] bg-slate-950/85 text-slate-100 rounded-2xl border border-slate-800/80 p-4 md:p-8 relative overflow-hidden glass-panel">
      {/* Absolute top background line decorations */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-black tracking-widest">
              DEVELOPER SANDBOX
            </span>
            <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
              CUSTOM COMBAT
            </span>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-100">
            開発者モード：カスタム戦闘シミュレータ
          </h2>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 font-semibold text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-850 hover:bg-slate-850 transition flex items-center text-xs gap-1.5 cursor-pointer rounded-lg shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          タイトルへ戻る
        </button>
      </header>

      {/* THREE PANELS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* PANEL 1: SELECT CARD POOL & ADD CARDS (5/12 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 p-4 rounded-xl border border-slate-850 flex flex-col h-[58vh]">
          
          {/* Card Pool Switcher Header */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">[CARD POOL SELECTION]</span>
            <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800">
              <button
                onClick={() => {
                  setSelectedJobId('knight');
                  handleApplyPresetDeck('knight');
                }}
                className={`px-3 py-1 text-xs font-bold transition flex items-center gap-1 cursor-pointer rounded ${
                  selectedJobId === 'knight' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                戦士カード
              </button>
              <button
                onClick={() => {
                  setSelectedJobId('mage');
                  handleApplyPresetDeck('mage');
                }}
                className={`px-3 py-1 text-xs font-bold transition flex items-center gap-1 cursor-pointer rounded ${
                  selectedJobId === 'mage' ? 'bg-violet-500 text-slate-100 font-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                魔法使い
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 mb-3 leading-snug">
            クリックすると右側の実行用テストデッキにカードを追加します。
          </p>

          {/* Card List Scrollbox */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 scroll-hide">
            {fullCardPool.map((card) => {
              const strBuffIcon = card.effect.strength !== undefined && card.effect.strength > 0;
              return (
                <div 
                  key={card.id}
                  onClick={() => handleAddCard(card)}
                  className="bg-slate-950/70 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 p-2.5 rounded-lg flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-[10px] font-mono font-black text-amber-400 w-6 text-center select-none bg-slate-900 border border-slate-800 py-0.5 rounded">
                      {card.cost}コ
                    </span>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                          {card.name}
                        </span>
                        {strBuffIcon && (
                          <span className="text-[9px] bg-red-950 text-red-400 px-1 py-0.2 rounded border border-red-900 font-bold">
                            消滅
                          </span>
                        )}
                        <span className={`w-1.5 h-1.5 rounded-full ${card.type === 'attack' ? 'bg-red-500' : 'bg-cyan-500'}`} />
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[220px]">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-1 rounded bg-slate-900 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors border border-slate-800/80">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick buttons */}
          <div className="mt-3 pt-3 border-t border-slate-850 flex gap-2">
            <button
              onClick={handleAddAllFromActivePool}
              className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 border border-indigo-950/60 rounded-lg cursor-pointer transition select-none"
            >
              プール全カードを一括追加
            </button>
            <button
              onClick={() => handleApplyPresetDeck(selectedJobId)}
              className="px-3 py-2 bg-slate-950 hover:bg-slate-900 text-[11px] font-bold text-slate-400 hover:text-slate-200 border border-slate-850 rounded-lg cursor-pointer transition select-none"
            >
              初期化
            </button>
          </div>

        </div>

        {/* PANEL 2: PLAYING TEST DECK (4/12 cols) */}
        <div className="lg:col-span-4 bg-slate-900/60 p-4 rounded-xl border border-slate-850 flex flex-col h-[58vh]">
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">[MY SANDBOX DECK]</span>
            <span className="text-xs font-mono font-black text-amber-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
              合計 {customDeck.length}枚
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-2 leading-snug">
            カスタムテストデッキのカード一覧。クリックでデッキから除外します。
          </p>

          {/* Current Deck view */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 scroll-hide">
            {customDeck.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-slate-950/20 rounded border border-dashed border-slate-800">
                <AlertCircle className="w-6 h-6 text-slate-600 mb-2" />
                <span className="text-xs text-slate-500">デッキが空です。</span>
                <span className="text-[10px] text-slate-600 mt-1">左側からカードを追加してください。</span>
              </div>
            ) : (
              customDeck.map((card, index) => (
                <div 
                  key={`${card.id}-${index}`}
                  onClick={() => handleRemoveCardIdx(index)}
                  className="bg-slate-950/40 hover:bg-rose-950/20 border border-slate-850 hover:border-rose-900 p-2 rounded-lg flex items-center justify-between group cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2 overflow-hidden truncate">
                    <span className="text-[8px] font-mono px-1 rounded bg-slate-900 border border-slate-800 text-slate-500">
                      #{index + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900/80 px-1 rounded">
                      {card.cost}コ
                    </span>
                    <span className="text-xs font-bold text-slate-300 truncate group-hover:text-rose-400 transition-colors">
                      {card.name}
                    </span>
                  </div>
                  <div className="p-1.5 rounded text-slate-500 group-hover:text-rose-500 hover:bg-slate-900 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick empty button */}
          <button
            onClick={() => setCustomDeck([])}
            disabled={customDeck.length === 0}
            className="mt-3 w-full py-2 bg-slate-950 hover:bg-rose-950/10 disabled:opacity-40 disabled:hover:bg-slate-950 text-slate-400 hover:text-rose-500 text-[11px] font-bold border border-slate-850 hover:border-rose-900/20 rounded-lg cursor-pointer transition select-none flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            構築デッキを全て空にする
          </button>

        </div>

        {/* PANEL 3: COMBAT MATCH SETUP (3/12 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4 h-[58vh] justify-between">
          
          {/* PLAYER PARAMETERS BOX */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider block mb-3">
              [PLAYER HP SETUP]
            </span>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-red-500 fill-red-500/10" />
              <span className="text-xs text-slate-300 font-bold">開始HP調整</span>
            </div>
            
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-850">
              <button 
                onClick={() => setCustomHp(prev => Math.max(prev - 10, 10))}
                className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-850 cursor-pointer font-extrabold select-none"
              >
                -10
              </button>
              <span className="text-sm font-mono font-black text-slate-100">{customHp} HP</span>
              <button 
                onClick={() => setCustomHp(prev => Math.min(prev + 10, 200))}
                className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-slate-400 hover:text-slate-100 hover:bg-slate-850 cursor-pointer font-extrabold select-none"
              >
                +10
              </button>
            </div>
          </div>

          {/* ENEMY TARGET SETUP */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 font-mono tracking-wider block mb-3 uppercase">
                [TARGET OPPONENT]
              </span>

              {/* Monster Level Tab */}
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-0.5 rounded border border-slate-850 mb-3">
                <button
                  onClick={() => { setEnemyCategory('normal'); setEnemyIndex(0); }}
                  className={`py-1 text-[10px] font-bold rounded cursor-pointer transition ${
                    enemyCategory === 'normal' ? 'bg-slate-850 text-slate-200' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  一般
                </button>
                <button
                  onClick={() => { setEnemyCategory('elite'); setEnemyIndex(0); }}
                  className={`py-1 text-[10px] font-bold rounded cursor-pointer transition ${
                    enemyCategory === 'elite' ? 'bg-slate-850 text-emerald-400 font-black' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  エリート
                </button>
                <button
                  onClick={() => { setEnemyCategory('boss'); setEnemyIndex(0); }}
                  className={`py-1 text-[10px] font-bold rounded cursor-pointer transition ${
                    enemyCategory === 'boss' ? 'bg-slate-850 text-rose-400 font-black' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  ボス
                </button>
              </div>

              {/* Selected Monster Showcase Bubble */}
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl select-none" role="img">{selectedEnemyType.image}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">{selectedEnemyType.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">基本体力: {selectedEnemyType.maxHp} HP</p>
                  </div>
                </div>

                {/* Specific Select list inside active category */}
                <select
                  value={enemyIndex}
                  onChange={(e) => setEnemyIndex(Number(e.target.value))}
                  className="w-full bg-slate-950 text-xs p-2 rounded border border-slate-850 text-slate-300 focus:outline-none cursor-pointer"
                >
                  {currentEnemyList.map((enemy, idx) => (
                    <option key={idx} value={idx}>
                      {enemy.image} {enemy.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Floor / Level Difficulty Scaler */}
              <div className="mt-3 pt-3 border-t border-slate-850/60">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono font-bold uppercase mb-1">
                  <span>難易度倍率 (階層数)</span>
                  <span className="text-emerald-400">階層: {combatDepth} (計 {Math.floor(100 * (1 + combatDepth * 0.12)) / 100}倍)</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="10"
                  value={combatDepth}
                  onChange={(e) => setCombatDepth(Number(e.target.value))}
                  className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* LAUNCH TRIGGER ACTUATOR */}
            <div className="mt-4 pt-1">
              <button
                onClick={handleStartSandboxBattle}
                className="w-full py-4.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl cursor-pointer transition shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-1.5 border border-emerald-400/30"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                テストバトルを開始する
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
