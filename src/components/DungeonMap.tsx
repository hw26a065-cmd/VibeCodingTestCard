import { Heart, Coins, Backpack, Skull, Flame, HelpCircle, ShieldAlert, Tent, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DungeonNode, Job, Card } from '../types';
import { useState } from 'react';

interface DungeonMapProps {
  map: DungeonNode[];
  currentNodeId: number;
  playerState: {
    hp: number;
    maxHp: number;
    gold: number;
    jobName: string;
    permanentStrength: number;
    deck: Card[];
  };
  onSelectNode: (node: DungeonNode) => void;
  onAbortGame: () => void;
}

export default function DungeonMap({
  map,
  currentNodeId,
  playerState,
  onSelectNode,
  onAbortGame
}: DungeonMapProps) {
  const [isDeckOpen, setIsDeckOpen] = useState(false);

  // Group nodes by depth for layered visual mapping
  const maxDepth = Math.max(...map.map(n => n.depth));
  
  // Arrange levels dynamically from top to bottom (Boss on top, Camp on bottom)
  const depthLevels = Array.from({ length: maxDepth + 1 }, (_, i) => maxDepth - i);

  const currentNode = map.find(n => n.id === currentNodeId);
  const possibleNextIds = currentNode ? currentNode.connectedTo : [];

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'boss':
        return <Skull className="w-7 h-7 text-red-500 animate-pulse" />;
      case 'elite':
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'battle':
        return <Skull className="w-5 h-5 text-rose-400" />;
      case 'event':
        return <HelpCircle className="w-5 h-5 text-indigo-400" />;
      case 'rest':
        return <Tent className="w-5 h-5 text-emerald-400" />;
      default:
        return <HelpCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getNodeBgColor = (node: DungeonNode, isActive: boolean, isSelectable: boolean) => {
    if (node.id === currentNodeId) {
      return 'bg-gradient-to-br from-amber-400 to-amber-550 text-slate-950 border-amber-350 shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/25 scale-110 node-active';
    }
    if (node.cleared) {
      return 'bg-slate-900/60 text-slate-500 border-slate-800/65 cursor-not-allowed opacity-50';
    }
    if (isSelectable) {
      return 'bg-slate-900/95 hover:bg-slate-850 text-emerald-400 border-emerald-500 hover:border-emerald-400 border-2 cursor-pointer shadow-lg shadow-emerald-500/20 animate-pulse';
    }
    return 'bg-slate-950/20 text-slate-705 border-slate-900/40 opacity-30 cursor-not-allowed';
  };

  return (
    <div className="flex flex-col min-h-[85vh] bg-slate-950/80 font-sans rounded-2xl border border-slate-850 relative select-none overflow-hidden glass-panel">
      
      {/* 💰 TOP STATUS HEADER 💰 */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:px-6 bg-slate-900/60 border-b border-slate-850/80 relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">PLAYER CLASS</span>
            <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-100">{playerState.jobName}</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Health Bar */}
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500/10" />
            <div className="flex flex-col">
              <span className="text-[8px] text-slate-500 font-mono leading-none mb-1 tracking-wider uppercase">HP MODULE</span>
              <div className="flex items-center gap-2">
                <div className="w-24 md:w-32 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-pink-505 h-full transition-all duration-300" 
                    style={{ width: `${(playerState.hp / playerState.maxHp) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-bold font-mono text-rose-300">{playerState.hp}/{playerState.maxHp}</span>
              </div>
            </div>
          </div>

          {/* Gold Status */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-850">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold font-mono text-amber-300">{playerState.gold}G</span>
          </div>

          {/* Permanent Buff tracker */}
          {playerState.permanentStrength > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-900/30 text-rose-400 animate-pulse">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-550/10" />
              <span className="text-xs font-bold font-mono">筋力 +{playerState.permanentStrength}</span>
            </div>
          )}
        </div>

        {/* Deck Drawer Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDeckOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-650 rounded-lg text-xs font-bold cursor-pointer transition active:scale-95"
          >
            <Backpack className="w-4 h-4 text-slate-400" />
            <span>デッキ確認 ({playerState.deck.length})</span>
          </button>
          
          <button
            onClick={onAbortGame}
            className="p-1.5 bg-slate-950 hover:bg-red-950/40 text-slate-500 hover:text-red-400 border border-slate-850 hover:border-red-900/30 rounded-lg cursor-pointer transition"
            title="タイトルに戻る"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🗺️ CENTRAL GRAPHICAL MAP LAYOUT 🗺️ */}
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 overflow-y-auto max-h-[70vh] relative">
        <div className="absolute top-4 text-slate-500 text-[10px] font-mono tracking-wider uppercase bg-slate-900/50 border border-slate-850 px-2 py-0.5 rounded">
          ↑ 最上層のボスを目指して進路を選択 ↑
        </div>

        <div className="w-full max-w-md flex flex-col gap-8 relative my-6">
          
          {/* Connector lines behind nodes if possible (SVG) */}
          <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              {/* Draw lines from current depth to next connected depths */}
              {map.map((node) => {
                const nodeElement = document.getElementById(`node-btn-${node.id}`);
                if (!nodeElement) return null;
                return node.connectedTo.map((nextId) => {
                  const targetElement = document.getElementById(`node-btn-${nextId}`);
                  if (!targetElement) return null;

                  // Simplified alignment representation fallback handled by nodes grid positioning
                  return null;
                });
              })}
            </svg>
          </div>

          <AnimatePresence>
            {depthLevels.map((depth) => {
              const nodesInDepth = map.filter((n) => n.depth === depth);
              // Format layer title
              let layerLabel = `第 ${depth} 階層`;
              if (depth === maxDepth) layerLabel = '最終決戦';
              if (depth === 0) layerLabel = '開始地域';

              return (
                <div key={depth} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">{layerLabel}</span>
                  
                  <div className="flex items-center justify-center gap-8 w-full">
                    {nodesInDepth.map((node) => {
                      const isActive = node.id === currentNodeId;
                      // Safe move check: node depth must be currentNode depth + 1, OR if node has depth 1 and camp cleared
                      const isSelectable = possibleNextIds.includes(node.id) && !node.cleared;

                      return (
                        <div key={node.id} className="relative group">
                          
                          {/* Selector Helper Tooltip */}
                          <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition duration-150 z-20">
                            {node.name} ({node.type.toUpperCase()})
                          </div>

                          <motion.button
                            id={`node-btn-${node.id}`}
                            whileHover={isSelectable || isActive ? { scale: 1.1 } : {}}
                            whileTap={isSelectable ? { scale: 0.95 } : {}}
                            disabled={!isSelectable}
                            onClick={() => onSelectNode(node)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all relative ${getNodeBgColor(
                              node,
                              isActive,
                              isSelectable
                            )}`}
                          >
                            {getNodeIcon(node.type)}

                            {/* Active marker pin */}
                            {isActive && (
                              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black font-mono w-5 h-5 flex items-center justify-center rounded-full border border-slate-950 animate-[bounce_1s_infinite]">
                                YOU
                              </span>
                            )}
                          </motion.button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* 🎒 COLLAPSIBLE DECK PREVIEW DRAWER 🎒 */}
      <AnimatePresence>
        {isDeckOpen && (
          <div className="absolute inset-0 bg-slate-950/90 z-45 backdrop-blur-md p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <header className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <Backpack className="w-5 h-5 text-amber-500" />
                  <h3 className="text-lg font-bold text-slate-100">所持デッキカード一覧 ({playerState.deck.length} 枚)</h3>
                </div>
                <button
                  onClick={() => setIsDeckOpen(false)}
                  className="px-3 py-1 text-xs bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer transition"
                >
                  閉じる
                </button>
              </header>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
                {playerState.deck.map((card, idx) => (
                  <div 
                    key={`${card.id}-deckpreview-${idx}`}
                    className="bg-slate-900 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-32 hover:border-slate-700 transition"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-mono px-1.5 py-0.5 rounded font-bold">
                          {card.cost}コ
                        </span>
                        <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold ${
                          card.rarity === 'rare' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                          card.rarity === 'uncommon' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 
                          'bg-slate-950 text-slate-400 border border-slate-850'
                        }`}>
                          {card.rarity}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-200 truncate">{card.name}</h4>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-2">
                        {card.description}
                      </p>
                      <span className={`inline-block mt-1 text-[8px] uppercase font-mono tracking-wider font-extrabold px-1.5 rounded-sm ${
                        card.type === 'attack' ? 'text-rose-400 bg-rose-950/30' : 
                        card.type === 'power' ? 'text-amber-400 bg-amber-950/30' :
                        'text-cyan-400 bg-cyan-950/30'
                      }`}>
                        {card.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsDeckOpen(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-lg border border-slate-700 cursor-pointer"
              >
                探索に戻る
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
