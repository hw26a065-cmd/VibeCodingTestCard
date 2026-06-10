export interface Card {
  id: string;
  name: string;
  type: 'attack' | 'skill' | 'power';
  cost: number;
  effect: {
    damage?: number;
    shield?: number;
    draw?: number;
    heal?: number;
    vulnerable?: number; // Receive more damage
    strength?: number;   // Increase deal damage
  };
  description: string;
  rarity: 'common' | 'uncommon' | 'rare';
}

export interface Job {
  id: string;
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  gold: number;
  energy: number;
  initialDeck: Card[];
  icon: string; // Lucide icon name
  color: string; // Tailwind bg color class
}

export type NodeType = 'battle' | 'elite' | 'event' | 'rest' | 'boss';

export interface DungeonNode {
  id: number;
  depth: number; // 0 to maxDepth
  position: number; // 0, 1, 2 (for branched choices)
  type: NodeType;
  name: string;
  connectedTo: number[]; // Next node IDs
  cleared: boolean;
}

export interface EnemyIntent {
  type: 'attack' | 'defend' | 'buff' | 'debuff' | 'special';
  value: number;
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  shield: number;
  intent: EnemyIntent;
  image: string; // Enemy icon / name of emoji
  vulnerableTurns: number; // debuff state
  strength: number;      // buff state
}

export interface EventDecision {
  text: string;
  effectText: string;
  requirement?: (player: any) => boolean;
  action: (playerState: any) => {
    updatedPlayer: any;
    logText: string;
  };
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  choices: EventDecision[];
}
