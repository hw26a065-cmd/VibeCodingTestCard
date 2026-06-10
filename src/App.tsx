/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Card, Job, DungeonNode, Enemy, RandomEvent } from './types';
import { generateDungeonMap, generateEnemy, EVENTS } from './utils/gameData';
import TitleScreen from './components/TitleScreen';
import JobSelection from './components/JobSelection';
import DungeonMap from './components/DungeonMap';
import BattleScreen from './components/BattleScreen';
import EventScreen from './components/EventScreen';
import ClearScreen from './components/ClearScreen';
import DevSandbox from './components/DevSandbox';

import { Sparkles, Home, Flame, Info, Heart } from 'lucide-react';

export default function App() {
  // 1: title, 2: job_select, 3: dungeon_map, 4: battle, 5: event, 6: rest_camp, 7: score, 8: dev_sandbox
  const [phase, setPhase] = useState<
    'title' | 'job_select' | 'dungeon_map' | 'battle' | 'event' | 'rest_camp' | 'score' | 'dev_sandbox'
  >('title');

  // Player configurations
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [playerHp, setPlayerHp] = useState<number>(0);
  const [playerMaxHp, setPlayerMaxHp] = useState<number>(0);
  const [playerGold, setPlayerGold] = useState<number>(0);
  const [playerDeck, setPlayerDeck] = useState<Card[]>([]);
  const [playerPermanentStrength, setPlayerPermanentStrength] = useState<number>(0);
  const [isDevBattle, setIsDevBattle] = useState<boolean>(false);

  // Dungeon Map Tracker
  const [dungeonNodes, setDungeonNodes] = useState<DungeonNode[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<number>(0);
  const [pendingNode, setPendingNode] = useState<DungeonNode | null>(null);

  // Active Phase temporary variables
  const [activeEnemy, setActiveEnemy] = useState<Enemy | null>(null);
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [restLog, setRestLog] = useState<string>('');

  // Combat Stats (For score calculations)
  const [combatStats, setCombatStats] = useState({
    normalWins: 0,
    eliteWins: 0,
    bossWins: 0,
    eventsTriggered: 0,
    highestDepth: 0
  });

  const [isVictoryRun, setIsVictoryRun] = useState<boolean>(false);

  // Restart trigger
  const handleResetGame = () => {
    setSelectedJob(null);
    setPlayerHp(0);
    setPlayerMaxHp(0);
    setPlayerGold(0);
    setPlayerDeck([]);
    setPlayerPermanentStrength(0);
    setDungeonNodes([]);
    setCurrentNodeId(0);
    setPendingNode(null);
    setActiveEnemy(null);
    setActiveEvent(null);
    setIsVictoryRun(false);
    setIsDevBattle(false);
    setCombatStats({
      normalWins: 0,
      eliteWins: 0,
      bossWins: 0,
      eventsTriggered: 0,
      highestDepth: 0
    });
    setPhase('title');
  };

  // Phase Transitions
  const handleStartTitle = () => {
    setPhase('job_select');
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
    setPlayerHp(job.hp);
    setPlayerMaxHp(job.maxHp);
    setPlayerGold(job.gold);
    setPlayerDeck([...job.initialDeck]);
    setPlayerPermanentStrength(0);
    setIsDevBattle(false);

    // Initial Dungeon setup
    const newMap = generateDungeonMap(8); // 8 is maxDepth
    setDungeonNodes(newMap);
    setCurrentNodeId(newMap[0].id); // Id 0 is starting camp node
    
    setPhase('dungeon_map');
  };

  const handleLaunchDevBattle = (customDeck: Card[], customJob: Job, customEnemy: Enemy) => {
    setPlayerDeck(customDeck);
    setSelectedJob(customJob);
    setPlayerHp(customJob.hp);
    setPlayerMaxHp(customJob.maxHp);
    setPlayerGold(customJob.gold);
    setPlayerPermanentStrength(0);
    setActiveEnemy(customEnemy);
    setIsDevBattle(true);
    setPhase('battle');
  };

  // Dungeon Map Action Router
  const handleNavigateToNode = (node: DungeonNode) => {
    setPendingNode(node);
    
    // Increment depth stats
    setCombatStats(prev => ({
      ...prev,
      highestDepth: Math.max(prev.highestDepth, node.depth)
    }));

    if (node.type === 'battle' || node.type === 'elite' || node.type === 'boss') {
      // Setup Enemy
      const newEnemy = generateEnemy(node.type, node.depth);
      setActiveEnemy(newEnemy);
      setPhase('battle');
    } else if (node.type === 'event') {
      // Roll random event from pool
      const index = Math.floor(Math.random() * EVENTS.length);
      setActiveEvent(EVENTS[index]);
      setPhase('event');
    } else if (node.type === 'rest') {
      // Go to Campground Rest screen
      setRestLog('');
      setPhase('rest_camp');
    }
  };

  // 1. COMBAT LEVEL COMPLETE HANDLER
  const handleBattleVictory = (goldReward: number, hpRemaining: number, chosenCard: Card | null) => {
    if (isDevBattle) {
      if (chosenCard) {
        setPlayerDeck(prev => [...prev, chosenCard]);
      }
      setPlayerHp(hpRemaining);
      setPhase('dev_sandbox');
      setActiveEnemy(null);
      return;
    }

    if (!pendingNode || !selectedJob) return;

    setPlayerHp(hpRemaining);
    setPlayerGold(prev => prev + goldReward);
    
    if (chosenCard) {
      setPlayerDeck(prev => [...prev, chosenCard]);
    }
    
    // Flag this node as cleared representatively
    const updatedMap = dungeonNodes.map(n => {
      if (n.id === pendingNode.id) {
        return { ...n, cleared: true };
      }
      return n;
    });

    setDungeonNodes(updatedMap);
    setCurrentNodeId(pendingNode.id);

    // Track statistics
    const isNormal = pendingNode.type === 'battle';
    const isElite = pendingNode.type === 'elite';
    const isBoss = pendingNode.type === 'boss';

    setCombatStats(prev => ({
      ...prev,
      normalWins: isNormal ? prev.normalWins + 1 : prev.normalWins,
      eliteWins: isElite ? prev.eliteWins + 1 : prev.eliteWins,
      bossWins: isBoss ? prev.bossWins + 1 : prev.bossWins
    }));

    if (isBoss) {
      // Completed last boss, proceed to victory screen
      setIsVictoryRun(true);
      setPhase('score');
    } else {
      setPhase('dungeon_map');
    }
    
    setPendingNode(null);
    setActiveEnemy(null);
  };

  // 2. COMBAT DEFEAT HANDLER
  const handleBattleDefeat = () => {
    if (isDevBattle) {
      setPhase('dev_sandbox');
      setActiveEnemy(null);
      return;
    }
    setIsVictoryRun(false);
    setPhase('score');
  };

  // 3. EVENT LEVEL COMPLETE HANDLER
  const handleEventFinished = (updatedPlayerState: any, logText: string) => {
    if (!pendingNode) return;

    setPlayerHp(updatedPlayerState.hp);
    setPlayerMaxHp(updatedPlayerState.maxHp);
    setPlayerGold(updatedPlayerState.gold);
    setPlayerDeck(updatedPlayerState.deck);
    if (updatedPlayerState.permanentStrength) {
      setPlayerPermanentStrength(updatedPlayerState.permanentStrength);
    }

    const updatedMap = dungeonNodes.map(n => {
      if (n.id === pendingNode.id) {
        return { ...n, cleared: true };
      }
      return n;
    });

    setDungeonNodes(updatedMap);
    setCurrentNodeId(pendingNode.id);
    
    setCombatStats(prev => ({
      ...prev,
      eventsTriggered: prev.eventsTriggered + 1
    }));

    setPhase('dungeon_map');
    setPendingNode(null);
    setActiveEvent(null);
  };

  // 4. REST CAMPRECOVERY SCREEN HANDLERS
  const handleHealAtCamp = () => {
    if (!selectedJob) return;
    const healVal = Math.floor(playerMaxHp * 0.35);
    const nextHp = Math.min(playerHp + healVal, playerMaxHp);
    setPlayerHp(nextHp);
    setRestLog(`焚き火の温かい火の光でお肉を焼き、体力を回復しました。(+${nextHp - playerHp} HP 回復)`);
  };

  const handleTrainAtCamp = () => {
    setPlayerPermanentStrength(prev => prev + 1);
    setRestLog('キャンプで武器を丁寧に研ぎ澄まし、攻撃ダメージが恒久的に +1 強化されました！');
  };

  const handleFinishCamp = () => {
    if (!pendingNode) return;

    // Set cleared
    const updatedMap = dungeonNodes.map(n => {
      if (n.id === pendingNode.id) {
        return { ...n, cleared: true };
      }
      return n;
    });

    setDungeonNodes(updatedMap);
    setCurrentNodeId(pendingNode.id);

    setPhase('dungeon_map');
    setPendingNode(null);
    setRestLog('');
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-2 sm:p-4 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 🔮 Outer Game Workspace Container 🔮 */}
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900/40 border border-slate-900 shadow-3xl p-3 md:p-6 my-auto">
        
        {phase === 'title' && (
          <TitleScreen 
            onStart={handleStartTitle} 
            onStartDevMode={() => setPhase('dev_sandbox')}
          />
        )}

        {phase === 'dev_sandbox' && (
          <DevSandbox
            onBack={() => {
              handleResetGame();
              setPhase('title');
            }}
            onLaunchBattle={handleLaunchDevBattle}
          />
        )}

        {phase === 'job_select' && (
          <JobSelection 
            onSelect={handleSelectJob} 
            onBack={handleResetGame} 
          />
        )}

        {phase === 'dungeon_map' && selectedJob && (
          <DungeonMap
            map={dungeonNodes}
            currentNodeId={currentNodeId}
            playerState={{
              hp: playerHp,
              maxHp: playerMaxHp,
              gold: playerGold,
              jobName: selectedJob.name,
              permanentStrength: playerPermanentStrength,
              deck: playerDeck
            }}
            onSelectNode={handleNavigateToNode}
            onAbortGame={handleResetGame}
          />
        )}

        {phase === 'battle' && activeEnemy && selectedJob && (
          <BattleScreen
            enemy={activeEnemy}
            playerDeck={playerDeck}
            playerHp={playerHp}
            playerMaxHp={playerMaxHp}
            playerPermanentStrength={playerPermanentStrength}
            onWin={handleBattleVictory}
            onLose={handleBattleDefeat}
          />
        )}

        {phase === 'event' && activeEvent && selectedJob && (
          <EventScreen
            event={activeEvent}
            playerState={{
              hp: playerHp,
              maxHp: playerMaxHp,
              gold: playerGold,
              deck: playerDeck,
              jobId: selectedJob.id,
              permanentStrength: playerPermanentStrength
            }}
            onComplete={handleEventFinished}
          />
        )}

        {phase === 'rest_camp' && selectedJob && (
          <div className="flex flex-col min-h-[75vh] items-center justify-center p-6 bg-slate-950/80 border border-slate-855 rounded-2xl relative overflow-hidden text-center max-w-2xl mx-auto w-full glass-panel">
            <div className="absolute top-0 inset-x-0 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/5">
              <Flame className="w-7 h-7 text-emerald-400 animate-pulse" />
            </div>

            <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase mb-1 block">CAMPSITE BONFIRE</span>
            <h2 className="text-2xl font-black text-slate-100 mb-2">旅人の安息地 (キャンプ)</h2>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-md">
              パチパチと薪が燃える暖かい焚き火のそばで、次の危険な探索へ向けて英気を養うか、武器を整備することができます。
            </p>

            {restLog === '' ? (
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-4 justify-center">
                
                {/* Option 1: Regenerate */}
                <button
                  onClick={handleHealAtCamp}
                  className="flex-1 p-5 rounded-xl border-2 border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900/80 cursor-pointer text-center flex flex-col items-center justify-center transition active:translate-y-0.5"
                >
                  <Heart className="w-6 h-6 text-red-500 fill-red-500/10 mb-2" />
                  <span className="text-sm font-bold text-slate-200">ゆっくり休む</span>
                  <span className="text-[11px] text-slate-400 mt-1">最大HPの 35% ({Math.floor(playerMaxHp * 0.35)} HP) 回復する</span>
                </button>

                {/* Option 2: Train */}
                <button
                  onClick={handleTrainAtCamp}
                  className="flex-1 p-5 rounded-xl border-2 border-slate-800 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900/80 cursor-pointer text-center flex flex-col items-center justify-center transition active:translate-y-0.5"
                >
                  <Sparkles className="w-6 h-6 text-amber-400 mb-2 animate-bounce" />
                  <span className="text-sm font-bold text-slate-200">武器を研ぐ</span>
                  <span className="text-[11px] text-slate-400 mt-1">与えるすべての戦闘ダメージを 永続的に +1 強化</span>
                </button>

              </div>
            ) : (
              <div className="w-full max-w-md">
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl text-sm font-bold text-emerald-400 mb-8 mx-auto leading-relaxed">
                  ” {restLog} ”
                </div>
                
                <button
                  onClick={handleFinishCamp}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-50 font-extrabold text-xs uppercase tracking-widest rounded-lg cursor-pointer shadow-lg shadow-emerald-500/10"
                >
                  体勢を整えて、出発する
                </button>
              </div>
            )}

            {restLog === '' && (
              <div className="mt-4 flex items-center justify-center gap-1 text-[11px] font-mono text-slate-500 bg-slate-900/40 border border-slate-850 px-3 py-1 rounded">
                <Info className="w-3.5 h-3.5" />
                <span>現在のステータス: {playerHp}/{playerMaxHp} HP | 筋力強化: +{playerPermanentStrength}</span>
              </div>
            )}

          </div>
        )}

        {phase === 'score' && selectedJob && (
          <ClearScreen
            isVictory={isVictoryRun}
            playerState={{
              hp: playerHp,
              maxHp: playerMaxHp,
              gold: playerGold,
              jobName: selectedJob.name,
              deck: playerDeck
            }}
            combatStats={combatStats}
            onRestart={handleResetGame}
          />
        )}

      </div>
    </main>
  );
}
