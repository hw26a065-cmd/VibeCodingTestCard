import { Shield, Heart, Zap, Sparkles, AlertCircle, RefreshCw, Layers, Trophy, ArrowRight, Flame, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Enemy, EnemyIntent } from '../types';
import { generateEnemyIntent, getRandomRewards } from '../utils/gameData';
import { useState, useEffect } from 'react';

interface BattleScreenProps {
  enemy: Enemy;
  playerDeck: Card[];
  playerHp: number;
  playerMaxHp: number;
  playerPermanentStrength: number;
  onWin: (goldReward: number, hpRemaining: number, chosenCard: Card | null) => void;
  onLose: () => void;
}

export default function BattleScreen({
  enemy,
  playerDeck,
  playerHp,
  playerMaxHp,
  playerPermanentStrength,
  onWin,
  onLose
}: BattleScreenProps) {
  // Battle states
  const [currentEnemy, setCurrentEnemy] = useState<Enemy>(enemy);
  const [currentPlayerHp, setCurrentPlayerHp] = useState<number>(playerHp);
  const [playerShield, setPlayerShield] = useState<number>(0);
  const [playerStrength, setPlayerStrength] = useState<number>(playerPermanentStrength);
  const [playerVulnerableTurns, setPlayerVulnerableTurns] = useState<number>(0);

  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [exhaustPile, setExhaustPile] = useState<Card[]>([]);
  
  const [energy, setEnergy] = useState<number>(3);
  const [maxEnergy] = useState<number>(3);
  const [turn, setTurn] = useState<number>(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  
  const [logs, setLogs] = useState<string[]>(['戦闘が開始された！']);
  const [damageIndicators, setDamageIndicators] = useState<{ id: number; text: string; isEnemy: boolean }[]>([]);
  
  // Rewards selection states (At fight end)
  const [isWon, setIsWon] = useState<boolean>(false);
  const [rewardsPool, setRewardsPool] = useState<Card[]>([]);
  const [selectedRewardIdx, setSelectedRewardIdx] = useState<number | null>(null);
  const [earnedGold] = useState<number>(Math.floor(Math.random() * 20) + 18);

  // Initialize deck & hand
  useEffect(() => {
    // Shuffle logic
    const baseDeck = [...playerDeck].map(c => ({ ...c, runtimeId: `${c.id}_rt_${Math.random()}` }));
    const shuffled = baseDeck.sort(() => 0.5 - Math.random());
    
    // Initial draw: 5 cards
    const initialHand = shuffled.slice(0, 5);
    const initialDraw = shuffled.slice(5);

    setHand(initialHand);
    setDrawPile(initialDraw);
    setDiscardPile([]);
    addLog(`あなたのターン (ターン ${1})。魔物「${enemy.name}」が現れた！`);
  }, [playerDeck, enemy]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 15));
  };

  const showDamageIndicator = (text: string, isEnemy: boolean) => {
    const id = Date.now() + Math.random();
    setDamageIndicators(prev => [...prev, { id, text, isEnemy }]);
    setTimeout(() => {
      setDamageIndicators(prev => prev.filter(ind => ind.id !== id));
    }, 1200);
  };

  // Check if player has any playable cards
  // Useful to alert the player they run out of energy / playable cards
  const hasPlayableCard = hand.some(card => card.cost <= energy);

  // Automatic Enemy Turn Transition helper when energy is 0 and no 0-cost cards exist
  useEffect(() => {
    if (isPlayerTurn && !isWon && energy === 0 && !hasPlayableCard) {
      // Small delayed notification that turn will end
      const timer = setTimeout(() => {
        if (energy === 0 && !hasPlayableCard && isPlayerTurn) {
          addLog('使えるコストが無くなりました！自動でターンを終了します...');
          handleEndTurn();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [energy, hand, isPlayerTurn, isWon]);

  // Player Plays a Card
  const handlePlayCard = (card: Card, index: number) => {
    if (!isPlayerTurn || isWon) return;
    if (card.cost > energy) {
      addLog('コスト（エネルギー）が足りません！');
      return;
    }

    // Spend energy
    setEnergy(prev => prev - card.cost);

    const isStrengthBuff = card.effect.strength !== undefined && card.effect.strength > 0;

    // Use local mutable copies of the piles to prevent stale asynchronous state closures
    let currentHand = [...hand];
    let currentDrawPile = [...drawPile];
    let currentDiscardPile = [...discardPile];
    let currentExhaustPile = [...exhaustPile];

    // Remove from hand
    currentHand.splice(index, 1);

    if (isStrengthBuff) {
      currentExhaustPile.push(card);
    } else {
      currentDiscardPile.push(card);
    }

    // Apply Card Effects
    let logDetail = `${card.name} をプレイ。${isStrengthBuff ? '【消滅】' : ''}`;

    // 1. DAMAGE EFFECT
    if (card.effect.damage !== undefined) {
      // Calculate overall damage with strength
      let damageValue = card.effect.damage + playerStrength;
      
      // Check vulnerability debuff of enemy
      if (currentEnemy.vulnerableTurns > 0) {
        damageValue = Math.floor(damageValue * 1.5);
      }

      // Deal with enemy shield
      let finalDmg = damageValue;
      let newEnemyShield = currentEnemy.shield;
      if (newEnemyShield > 0) {
        if (newEnemyShield >= finalDmg) {
          newEnemyShield -= finalDmg;
          finalDmg = 0;
        } else {
          finalDmg -= newEnemyShield;
          newEnemyShield = 0;
        }
      }

      const newEnemyHp = Math.max(currentEnemy.hp - finalDmg, 0);
      setCurrentEnemy(prev => ({
        ...prev,
        hp: newEnemyHp,
        shield: newEnemyShield
      }));

      logDetail += `敵に ${damageValue}（盾吸収後 ${finalDmg}）ダメージを与えた。`;
      showDamageIndicator(`-${damageValue} dmg`, true);

      // Check win condition
      if (newEnemyHp <= 0) {
        setHand(currentHand);
        setDrawPile(currentDrawPile);
        setDiscardPile(currentDiscardPile);
        setExhaustPile(currentExhaustPile);
        handleBattleWin();
        return;
      }
    }

    // 2. SHIELD EFFECT
    if (card.effect.shield !== undefined) {
      setPlayerShield(prev => prev + card.effect.shield!);
      logDetail += `シールド +${card.effect.shield} を獲得。`;
      showDamageIndicator(`+${card.effect.shield} shield`, false);
    }

    // 3. DRAW EFFECT
    if (card.effect.draw !== undefined) {
      const count = card.effect.draw;
      for (let i = 0; i < count; i++) {
        if (currentDrawPile.length === 0) {
          if (currentDiscardPile.length === 0) break; // no cards to draw
          // Recycle discard into draw
          currentDrawPile = [...currentDiscardPile].sort(() => 0.5 - Math.random());
          currentDiscardPile = [];
        }
        const nextCard = currentDrawPile.pop();
        if (nextCard) {
          currentHand.push(nextCard);
        }
      }
      logDetail += `カードを ${card.effect.draw} 枚引いた。`;
    }

    // 4. HEAL EFFECT (For life drain or mana self damage)
    if (card.effect.heal !== undefined) {
      if (card.effect.heal > 0) {
        setCurrentPlayerHp(prev => Math.min(prev + card.effect.heal!, playerMaxHp));
        logDetail += `自身の体力を ${card.effect.heal} 回復した。`;
      } else {
        // Self damage / cost
        const selfSelfDmg = Math.abs(card.effect.heal);
        const nextHp = Math.max(currentPlayerHp - selfSelfDmg, 1);
        setCurrentPlayerHp(nextHp);
        logDetail += `反動で体力を ${selfSelfDmg} 消費。`;
        showDamageIndicator(`-${selfSelfDmg} HP`, false);
      }
    }

    // 5. DEBUFF VULNERABLE ON ENEMY
    if (card.effect.vulnerable !== undefined) {
      setCurrentEnemy(prev => ({
        ...prev,
        vulnerableTurns: prev.vulnerableTurns + card.effect.vulnerable!
      }));
      logDetail += `敵に 脆弱(${card.effect.vulnerable}ターン) を付与。`;
    }

    // 6. BUFF STRENGTH ON PLAYER
    if (card.effect.strength !== undefined) {
      setPlayerStrength(prev => prev + card.effect.strength!);
      logDetail += `自身の筋力を +${card.effect.strength} した。`;
    }

    // Save actual updated state of piles
    setHand(currentHand);
    setDrawPile(currentDrawPile);
    setDiscardPile(currentDiscardPile);
    setExhaustPile(currentExhaustPile);

    addLog(logDetail);
  };

  // Draw count cards helper list
  const drawCards = (count: number) => {
    let currentDrawPile = [...drawPile];
    let currentDiscardPile = [...discardPile];
    let currentHand = [...hand];

    for (let i = 0; i < count; i++) {
      if (currentDrawPile.length === 0) {
        if (currentDiscardPile.length === 0) break; // no cards to draw
        // Recycle discard into draw
        currentDrawPile = [...currentDiscardPile].sort(() => 0.5 - Math.random());
        currentDiscardPile = [];
      }
      const nextCard = currentDrawPile.pop();
      if (nextCard) {
        currentHand.push(nextCard);
      }
    }

    setHand(currentHand);
    setDrawPile(currentDrawPile);
    setDiscardPile(currentDiscardPile);
  };

  // Manual or Auto End Turn
  const handleEndTurn = () => {
    if (!isPlayerTurn || isWon) return;

    setIsPlayerTurn(false);
    addLog('あなたのターン終了。魔物の攻撃ターンです...');

    // Small timeout for dramatic opponent response back
    setTimeout(() => {
      executeEnemyTurn();
    }, 1200);
  };

  // Perform Enemy Turn Actions
  const executeEnemyTurn = () => {
    if (isWon) return;

    // 💡 相手のターン開始時にシールドを初期化する
    let nextShield = 0;
    let nextStrength = currentEnemy.strength;
    let nextHp = currentEnemy.hp;

    const intent = currentEnemy.intent;
    let logDetail = `魔物「${currentEnemy.name}」の行動：${intent.description}。`;

    // 1. ATTACK INTENT
    if (intent.type === 'attack') {
      // Calculate scaled enemy attack
      let atkDmg = intent.value + nextStrength;
      
      // Apply player vulnerable debuff
      if (playerVulnerableTurns > 0) {
        atkDmg = Math.floor(atkDmg * 1.5);
      }

      // Block defense calculation
      let finalPlayerDmg = atkDmg;
      let newPlayerShield = playerShield;

      if (newPlayerShield > 0) {
        if (newPlayerShield >= finalPlayerDmg) {
          newPlayerShield -= finalPlayerDmg;
          finalPlayerDmg = 0;
        } else {
          finalPlayerDmg -= newPlayerShield;
          newPlayerShield = 0;
        }
      }

      const nextPlayerHp = Math.max(currentPlayerHp - finalPlayerDmg, 0);
      setCurrentPlayerHp(nextPlayerHp);
      setPlayerShield(newPlayerShield);

      logDetail += ` プレイヤーに ${atkDmg}（シールド貫通 ${finalPlayerDmg}）ダメージ！`;
      showDamageIndicator(`-${atkDmg} dmg`, false);

      if (nextPlayerHp <= 0) {
        addLog(logDetail);
        addLog('あなたのHPが 0 になりました。力尽きてしまった！');
        setTimeout(() => {
          onLose();
        }, 1500);
        return;
      }
    }

    // 2. DEFEND INTENT
    if (intent.type === 'defend') {
      nextShield = intent.value; // 初期化した 0 から増やす
      logDetail += ` 鉄壁のシールドを ${intent.value} 得た。`;
      showDamageIndicator(`+${intent.value} shield`, true);
    }

    // 3. BUFF INTENT
    if (intent.type === 'buff') {
      nextStrength += intent.value;
      logDetail += ` 筋力(攻撃力)が永続で +${intent.value} 増加した。`;
    }

    // 4. DEBUFF INTENT
    if (intent.type === 'debuff') {
      setPlayerVulnerableTurns(prev => prev + intent.value);
      logDetail += ` あなたを牙気で威嚇！脆弱を ${intent.value} ターン付与された！`;
    }

    // 5. SPECIAL RECOVERY INTENT
    if (intent.type === 'special') {
      nextHp = Math.min(nextHp + intent.value, currentEnemy.maxHp);
      logDetail += ` 自身の深淵の傷を瞑想して ${intent.value} 回復した。`;
    }

    addLog(logDetail);

    // Turn Cleanup
    // Clear player vulnerable tracker
    if (playerVulnerableTurns > 0) {
      setPlayerVulnerableTurns(prev => prev - 1);
    }
    // Clear enemy vulnerable tracker
    let nextVulnerableTurns = currentEnemy.vulnerableTurns;
    if (nextVulnerableTurns > 0) {
      nextVulnerableTurns -= 1;
    }

    // Setup Enemy Intent for next round
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    
    // Choose next intent based on enemy pattern (using the updated enemy HP)
    const nextIntent = generateEnemyIntent(currentEnemy.id.split('_')[0], nextTurn, nextHp);
    
    setCurrentEnemy(prev => ({
      ...prev,
      hp: nextHp,
      strength: nextStrength,
      shield: nextShield, // 今ターン得たシールドを格納（他の行動なら 0）
      vulnerableTurns: nextVulnerableTurns,
      intent: nextIntent
    }));

    // Start player turn
    // Move unplayed hand to discard
    const newDiscard = [...discardPile, ...hand];
    setDiscardPile(newDiscard);
    
    // Reset player defense shield (standard roguelike)
    setPlayerShield(0);
    setEnergy(maxEnergy);
    setIsPlayerTurn(true);

    // Draw 5 new cards
    // Shuffle logic embedded inside drawCards
    setHand([]);
    setTimeout(() => {
      let freshDraw = [...drawPile];
      let freshDiscard = [...newDiscard];
      let freshHand: Card[] = [];

      for (let i = 0; i < 5; i++) {
        if (freshDraw.length === 0) {
          if (freshDiscard.length === 0) break;
          freshDraw = [...freshDiscard].sort(() => 0.5 - Math.random());
          freshDiscard = [];
        }
        const drawn = freshDraw.pop();
        if (drawn) freshHand.push(drawn);
      }

      setHand(freshHand);
      setDrawPile(freshDraw);
      setDiscardPile(freshDiscard);

      addLog(`あなたのターン (ターン ${nextTurn})。魂のエネルギーが充填された！`);
    }, 100);
  };

  // Fight Victory Logic
  const handleBattleWin = () => {
    setIsWon(true);
    addLog(`見事に勝利した！魔物「${currentEnemy.name}」を討伐した。`);
    
    // Generate 3 random cards for card reward
    // This is phase 5 implementation (Deck management) right inside post-battle
    const jobId = playerDeck[0]?.id?.startsWith('k_') ? 'knight' : 'mage';
    const rewardCards = getRandomRewards(jobId, 3);
    setRewardsPool(rewardCards);
  };

  const handleSelectReward = (idx: number) => {
    setSelectedRewardIdx(idx);
  };

  const handleClaimVictoryAndReward = () => {
    const chosenCard = selectedRewardIdx !== null ? rewardsPool[selectedRewardIdx] : null;
    
    // Final callback to parent with reward items including the chosen card
    onWin(earnedGold, currentPlayerHp, chosenCard);
  };

  return (
    <div className="flex flex-col min-h-[90vh] bg-slate-950/80 rounded-2xl border border-slate-850 p-4 md:p-6 overflow-hidden relative glass-panel">
      
      {/* ⚠️ Damage feedback popup indicators */}
      {damageIndicators.map(ind => (
        <motion.div
          key={ind.id}
          initial={{ opacity: 1, y: ind.isEnemy ? 100 : 300, scale: 0.8 }}
          animate={{ opacity: 0, y: ind.isEnemy ? 20 : 180, scale: 1.4 }}
          transition={{ duration: 1 }}
          className={`absolute font-black text-2xl tracking-wider select-none pointer-events-none z-50 ${
            ind.isEnemy ? 'text-rose-500 left-3/4' : 'text-amber-400 left-1/4'
          }`}
        >
          {ind.text}
        </motion.div>
      ))}

      {/* Rarity helper labels */}
      <div className="flex justify-between items-center mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-850">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] text-slate-400 font-mono">BATTLE TRACK • TURN {turn}</span>
        </div>
        <div className="flex gap-1.5 items-center">
          <span className={`h-2 w-2 rounded-full ${isPlayerTurn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
          <span className="text-xs font-bold font-mono text-slate-300">
            {isPlayerTurn ? 'YOUR TURN' : 'OPPONENT TURN'}
          </span>
        </div>
      </div>

      {/* 🛡️ CENTRAL BATTLEGROUND (Enemy vs Player Avatar Status) 🛡️ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/30 p-4 rounded-xl border border-slate-900 mb-6">
        
        {/* PLAYER AVATAR STATUS BOX */}
        <div className="flex flex-col justify-between p-4 bg-slate-950/80 rounded-lg border border-slate-850 relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">HERO STATUS</span>
              <h3 className="text-base font-extrabold text-slate-200">あなた</h3>
              
              {/* Buff statuses */}
              <div className="flex gap-2 mt-1.5">
                {playerStrength > 0 && (
                  <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20">
                    <Flame className="w-3 h-3" />
                    筋力 +{playerStrength}
                  </span>
                )}
                {playerVulnerableTurns > 0 && (
                  <span className="flex items-center gap-1 bg-rose-500/10 text-rose-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-rose-500/20">
                    脆弱 {playerVulnerableTurns}
                  </span>
                )}
              </div>
            </div>

            {/* Shield Stat block */}
            <div className="flex items-center gap-1.5 p-1.5 bg-blue-950/20 rounded-lg border border-blue-900/40 text-blue-400">
              <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/10" />
              <span className="text-sm font-black font-mono">{playerShield} SHIELD</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
              <span className="text-slate-400">PLAYER LIFE FORCE</span>
              <span className="text-rose-400 font-bold">{currentPlayerHp}/{playerMaxHp} HP</span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300" 
                style={{ width: `${(currentPlayerHp / playerMaxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* ENEMY MONSTER AVATAR BOX & INTENT PREVIEW */}
        <div className="flex flex-col justify-between p-4 bg-slate-950/80 rounded-lg border border-slate-850 text-right relative">
          
          <div className="flex justify-between items-start mb-4">
            {/* Shield Stat block */}
            <div className="flex items-center gap-1.5 p-1.5 bg-blue-950/20 rounded-lg border border-blue-900/40 text-blue-400">
              <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/10" />
              <span className="text-sm font-black font-mono">{currentEnemy.shield} SHIELD</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">OPPONENT ENEMY</span>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-xl">{currentEnemy.image}</span>
                <h3 className="text-base font-extrabold text-slate-200">{currentEnemy.name}</h3>
              </div>
              
              {/* Buff/Debuff statuses */}
              <div className="flex gap-2 mt-1.5 justify-end">
                {currentEnemy.strength > 0 && (
                  <span className="flex items-center gap-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/20">
                    <Flame className="w-3 h-3" />
                    筋力 +{currentEnemy.strength}
                  </span>
                )}
                {currentEnemy.vulnerableTurns > 0 && (
                  <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/20">
                    脆弱 {currentEnemy.vulnerableTurns}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Intent Preview box (Crucial standard for roguelike) */}
          <div className="my-2 p-2 rounded bg-slate-900/80 border border-slate-850 flex items-center justify-between text-left gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black">
                {currentEnemy.intent.type === 'attack' ? '⚔️' : currentEnemy.intent.type === 'defend' ? '🛡️' : '✨'}
              </span>
              <div>
                <span className="text-[8px] font-mono text-amber-500 tracking-wider block leading-none uppercase">NEXT ACTION INTENT</span>
                <span className="text-xs font-bold text-slate-100">{currentEnemy.intent.description}</span>
              </div>
            </div>
            {currentEnemy.intent.type === 'attack' && (
              <span className="bg-rose-950/40 text-rose-400 px-2 py-1 text-xs font-extrabold font-mono rounded border border-rose-900/50">
                傷害 {currentEnemy.intent.value + currentEnemy.strength}
              </span>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
              <span className="text-slate-400">ENEMY LIFE FORCE</span>
              <span className="text-rose-400 font-bold">{currentEnemy.hp}/{currentEnemy.maxHp} HP</span>
            </div>
            <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-red-600 to-rose-500 h-full transition-all duration-300" 
                style={{ width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 📃 REALTIME BATTLE EVENT LOGS 📃 */}
      <div className="bg-slate-950 border border-slate-900 rounded-lg p-3 h-24 overflow-y-auto mb-6 flex flex-col-reverse text-[11px] font-mono leading-relaxed text-slate-400 select-text">
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`py-0.5 border-b border-slate-900/40 ${
              log.includes('ダメージを与えた') ? 'text-cyan-300' :
              log.includes('ダメージ！') ? 'text-rose-400 font-extrabold' : 
              log.includes('ターン終了') ? 'text-slate-500' :
              log.includes('あなたのターン') ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            {log}
          </div>
        ))}
      </div>

      {/* 🪐 HAND CARDS, MANA ENERGY ORB, END-TURN ACTUATOR 🪐 */}
      <div className="mt-auto relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
          
          {/* ENERGY ORB */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 flex flex-col items-center justify-center border-2 border-indigo-400 shadow-xl shadow-indigo-600/20 select-none">
              <Zap className="w-5.5 h-5.5 text-cyan-300 fill-cyan-300/10 animate-pulse absolute -top-1" />
              <span className="text-lg font-black font-mono text-slate-100 z-10 mt-1">{energy}/{maxEnergy}</span>
              <span className="text-[7px] text-cyan-200 font-mono tracking-wide leading-none uppercase font-black">COST</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-slate-300">手札保有数 ({hand.length}枚)</span>
              <span className="text-[10px] text-slate-500 font-mono">
                山札({drawPile.length}) • 捨て札({discardPile.length})
                {exhaustPile.length > 0 && (
                  <span className="text-rose-400"> • 消滅({exhaustPile.length})</span>
                )}
              </span>
            </div>
          </div>

          {/* TURN END BUTTON */}
          <button
            onClick={handleEndTurn}
            disabled={!isPlayerTurn || isWon}
            className={`px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition select-none ${
              isPlayerTurn 
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/15' 
                : 'bg-slate-850 text-slate-600 cursor-not-allowed border border-slate-800'
            }`}
          >
            手札を棄て、ターン終了
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* CARDS DISPLAY CONTAINER */}
        <div className="bg-slate-950/60 p-4 border border-indigo-950/20 rounded-xl flex items-center justify-center min-h-[160px] relative">
          
          {hand.length === 0 ? (
            <div className="text-xs text-slate-600 font-mono italic">
              手札にカードがありません
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3.5 w-full">
              {hand.map((card, i) => {
                const canAfford = card.cost <= energy && isPlayerTurn;
                return (
                  <motion.div
                    key={`${card.id}-${i}`}
                    whileHover={canAfford ? { y: -18, scale: 1.05 } : {}}
                    whileTap={canAfford ? { scale: 0.95 } : {}}
                    onClick={() => canAfford && handlePlayCard(card, i)}
                    className={`relative w-[130px] h-[170px] rounded-xl border p-3 flex flex-col justify-between select-none shadow-md transition-all ${
                      canAfford 
                        ? 'bg-slate-900 border-indigo-500 hover:border-indigo-400 hover:shadow-indigo-500/10 cursor-pointer text-slate-100' 
                        : 'bg-slate-900/40 border-slate-900/60 text-slate-600 opacity-55 cursor-not-allowed'
                    }`}
                  >
                    {/* Card Cost Pill */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black font-mono border rounded px-1.5 py-0.5 ${
                        canAfford ? 'bg-indigo-950 border-indigo-700 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}>
                        {card.cost}コ
                      </span>
                      
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        card.type === 'attack' ? 'bg-rose-500 shadow-md shadow-rose-500/20' : 
                        card.type === 'power' ? 'bg-amber-500' : 'bg-cyan-500'
                      }`} />
                    </div>

                    <div className="flex-1 flex flex-col justify-center text-center my-1.5">
                      <h4 className="text-xs font-black truncate">{card.name}</h4>
                      <span className="text-[8px] uppercase tracking-widest text-slate-500 mt-0.5 font-bold font-mono">
                        {card.type}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <p className="text-[9px] text-slate-400 text-center leading-normal mb-1 line-clamp-3">
                        {card.description}
                      </p>
                      
                      {/* Rarity text tag */}
                      <span className={`block text-[7px] text-center font-bold tracking-widest font-mono p-0.5 uppercase rounded-sm ${
                        card.rarity === 'rare' ? 'text-amber-400 bg-amber-950/20' : 
                        card.rarity === 'uncommon' ? 'text-cyan-400 bg-cyan-950/20' : 'text-slate-500'
                      }`}>
                        {card.rarity}
                      </span>
                    </div>

                    {/* Quick indicator when play cannot be afforded */}
                    {!canAfford && isPlayerTurn && (
                      <div className="absolute inset-0 bg-slate-950/50 rounded-xl flex items-center justify-center">
                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest border border-rose-500 bg-slate-950/80 px-2 py-0.5 rounded">コスト不足</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Player status feedback block during enemy Turn */}
          {!isPlayerTurn && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-15">
              <div className="text-center flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-xs font-bold text-slate-300 tracking-wider">魔物のターンをシミュレート中...</span>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 🏆 FIGHT VICTORY OVERLAY AND DECK MANAGEMENT EVENT PANEL 🏆 */}
      <AnimatePresence>
        {isWon && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-xl w-full"
            >
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl w-16 h-16 flex items-center justify-center text-amber-500 mx-auto mb-4 shadow-lg shadow-amber-500/5">
                <Trophy className="w-8 h-8 animate-bounce" />
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-amber-400 mb-2">
                魔物の討伐に成功！
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                激闘を制し、戦利品と強力なカードを獲得しました。
              </p>

              {/* Gold reward row */}
              <div className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-850 py-3.5 px-6 rounded-xl w-fit mx-auto mb-6">
                <span className="text-sm font-bold text-slate-400">獲得金貨:</span>
                <span className="text-lg font-black font-mono text-amber-400 flex items-center gap-1">
                  +{earnedGold} G
                </span>
              </div>

              {/* CARD REWARDS CHOICE SECTOR */}
              <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-5 mb-6 text-left">
                <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-3 block text-center">
                  ―― 補強カードを1枚選んで習得 ――
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  {rewardsPool.map((card, i) => {
                    const isSelected = selectedRewardIdx === i;
                    return (
                      <div
                        key={`${card.id}-reward-${i}`}
                        onClick={() => handleSelectReward(i)}
                        className={`cursor-pointer rounded-xl p-3 border h-44 flex flex-col justify-between transition-all select-none ${
                          isSelected 
                            ? 'bg-indigo-950 border-indigo-400 shadow-lg shadow-indigo-500/10' 
                            : 'bg-slate-950 border-slate-850 hover:border-slate-850'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-black font-mono px-1 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {card.cost}コ
                          </span>
                          <span className={`w-2 h-2 rounded-full ${card.type === 'attack' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        </div>

                        <div className="text-center my-1 flex-1 flex flex-col justify-center">
                          <h5 className="text-xs font-extrabold text-slate-200 truncate">{card.name}</h5>
                          <span className="text-[7px] text-slate-500 uppercase mt-0.5 font-bold font-mono tracking-widest">
                            {card.type}
                          </span>
                        </div>

                        <div className="mt-auto">
                          <p className="text-[8px] text-slate-400 text-center leading-normal line-clamp-3 mb-1 font-medium">
                            {card.description}
                          </p>
                          <span className={`block text-[7px] text-center font-bold tracking-widest font-mono p-0.5 uppercase rounded-sm ${
                            card.rarity === 'rare' ? 'text-amber-400 bg-amber-950/20' : 
                            card.rarity === 'uncommon' ? 'text-cyan-400 bg-cyan-950/20' : 'text-slate-500'
                          }`}>
                            {card.rarity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedRewardIdx === null && (
                  <p className="text-[10px] text-slate-500 text-center mt-3 font-semibold">
                    ※ 習得せずにスキップすることも可能です。
                  </p>
                )}
              </div>

              <div className="flex gap-4 items-center justify-center">
                <button
                  onClick={handleClaimVictoryAndReward}
                  className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-xl cursor-pointer"
                >
                  {selectedRewardIdx !== null ? '選択したカードを獲得して進む' : 'カードをスキップして進む'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
