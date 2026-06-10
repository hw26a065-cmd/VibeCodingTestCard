import { Card, Job, Enemy, RandomEvent, DungeonNode, NodeType } from '../types';

// ==========================================
// CARDS LISTS
// ==========================================

export const KNIGHT_CARDS: Card[] = [
  {
    id: 'k_strike',
    name: 'ストライク',
    type: 'attack',
    cost: 1,
    effect: { damage: 6 },
    description: '敵に 6 ダメージを与える。',
    rarity: 'common'
  },
  {
    id: 'k_defend',
    name: '防御',
    type: 'skill',
    cost: 1,
    effect: { shield: 6 },
    description: 'シールドを 6 得る。',
    rarity: 'common'
  },
  {
    id: 'k_heavy',
    name: '渾身の斬撃',
    type: 'attack',
    cost: 2,
    effect: { damage: 14 },
    description: '敵に 14 ダメージを与える。',
    rarity: 'uncommon'
  },
  {
    id: 'k_quick',
    name: 'クイックシールド',
    type: 'skill',
    cost: 0,
    effect: { shield: 3, draw: 1 },
    description: 'シールドを 3 得る。カードを 1 枚引く。',
    rarity: 'uncommon'
  },
  {
    id: 'k_bash',
    name: 'バッシュ',
    type: 'attack',
    cost: 1,
    effect: { damage: 4, vulnerable: 2 },
    description: '敵に 4 ダメージを与え、脆弱を 2 ターン付与する（受けるダメージが1.5倍に）。',
    rarity: 'uncommon'
  },
  {
    id: 'k_ironclad',
    name: 'アイアンシールド',
    type: 'skill',
    cost: 2,
    effect: { shield: 14 },
    description: 'シールドを 14 得る。',
    rarity: 'uncommon'
  },
  {
    id: 'k_rage',
    name: '怒りの一撃',
    type: 'attack',
    cost: 1,
    effect: { damage: 8, strength: 1 },
    description: '敵に 8 ダメージを与え、自身の筋力を +1 する（恒久的に与ダメージ増加）。',
    rarity: 'rare'
  },
  {
    id: 'k_inspire',
    name: '鼓舞',
    type: 'skill',
    cost: 1,
    effect: { draw: 2, shield: 4 },
    description: 'カードを 2 枚引き、シールドを 4 得る。',
    rarity: 'uncommon'
  },
  {
    id: 'k_buff',
    name: 'ウォークライ',
    type: 'power',
    cost: 1,
    effect: { strength: 2 },
    description: '自身の筋力を +2 する（この戦闘の間、すべての攻撃ダメージが +2）。',
    rarity: 'rare'
  },
  {
    id: 'k_judgment',
    name: '天罰の一撃',
    type: 'attack',
    cost: 3,
    effect: { damage: 26 },
    description: '敵に 26 の大ダメージを与える。',
    rarity: 'rare'
  },
  {
    id: 'k_opportunity',
    name: '一瞬の機会',
    type: 'attack',
    cost: 1,
    effect: { damage: 3, draw: 1 },
    description: '敵に 3 ダメージを与える。カードを 1 枚引く。引いたカードがアタックならエネルギーを 1 回復する。',
    rarity: 'uncommon'
  }
];

export const MAGE_CARDS: Card[] = [
  {
    id: 'm_firebolt',
    name: 'ファイアボルト',
    type: 'attack',
    cost: 1,
    effect: { damage: 8 },
    description: '敵に 8 ダメージを与える。',
    rarity: 'common'
  },
  {
    id: 'm_barrier',
    name: 'マジックバリア',
    type: 'skill',
    cost: 1,
    effect: { shield: 5 },
    description: 'シールドを 5 得る。',
    rarity: 'common'
  },
  {
    id: 'm_mana',
    name: '魔力の暴走',
    type: 'skill',
    cost: 0,
    effect: { draw: 2, heal: -2 },
    description: 'HPを 2 消費して、カードを 2 枚引く。',
    rarity: 'uncommon'
  },
  {
    id: 'm_frost',
    name: 'アイスボルト',
    type: 'attack',
    cost: 1,
    effect: { damage: 5, vulnerable: 2 },
    description: '敵に 5 ダメージを与え、脆弱を 2 ターン付与する（受けるダメージが1.5倍に）。',
    rarity: 'uncommon'
  },
  {
    id: 'm_lightning',
    name: 'ライトニングボルト',
    type: 'attack',
    cost: 2,
    effect: { damage: 17 },
    description: '敵に 17 ダメージを与える。',
    rarity: 'uncommon'
  },
  {
    id: 'm_stone',
    name: 'アースガード',
    type: 'skill',
    cost: 1,
    effect: { shield: 10 },
    description: 'シールドを 10 得る。',
    rarity: 'uncommon'
  },
  {
    id: 'm_charge',
    name: '魔力充填',
    type: 'power',
    cost: 1,
    effect: { strength: 3 },
    description: '自身の筋力を +3 する（これ以降、攻撃ダメージが +3）。',
    rarity: 'rare'
  },
  {
    id: 'm_drain',
    name: 'ライフドレイン',
    type: 'attack',
    cost: 1,
    effect: { damage: 4, heal: 3 },
    description: '敵に 4 ダメージを与え、自身のHPを 3 回復する。',
    rarity: 'rare'
  },
  {
    id: 'm_meteor',
    name: 'メテオストライク',
    type: 'attack',
    cost: 3,
    effect: { damage: 24, vulnerable: 1 },
    description: '敵に 24 ダメージを与え、脆弱を 1 ターン付与する。',
    rarity: 'rare'
  },
  {
    id: 'm_intellect',
    name: '知性の光',
    type: 'skill',
    cost: 2,
    effect: { shield: 8, draw: 2 },
    description: 'シールドを 8 得て、カードを 2 枚引く。',
    rarity: 'rare'
  }
];

// ==========================================
// JOBS
// ==========================================

export const JOBS: Job[] = [
  {
    id: 'knight',
    name: 'ナイト (戦士)',
    description: '高いシールド獲得能力と、攻防が一体となった安定感のある近接戦闘職業。',
    hp: 80,
    maxHp: 80,
    gold: 100,
    energy: 3,
    initialDeck: [
      { ...KNIGHT_CARDS[0] }, { ...KNIGHT_CARDS[0] }, { ...KNIGHT_CARDS[0] }, { ...KNIGHT_CARDS[0] }, // ストライク x 4
      { ...KNIGHT_CARDS[1] }, { ...KNIGHT_CARDS[1] }, { ...KNIGHT_CARDS[1] }, { ...KNIGHT_CARDS[1] }, // 防御 x 4
      { ...KNIGHT_CARDS[2] }, // 渾身の斬撃 x 1
      { ...KNIGHT_CARDS[4] }  // バッシュ x 1
    ],
    icon: 'Shield',
    color: 'bg-amber-700 border-amber-500'
  },
  {
    id: 'mage',
    name: 'マージ (魔法使い)',
    description: '強力な攻撃魔法と、ドローやHP吸収などのトリッキーなスキルを持つ魔導職。',
    hp: 60,
    maxHp: 60,
    gold: 100,
    energy: 3,
    initialDeck: [
      { ...MAGE_CARDS[0] }, { ...MAGE_CARDS[0] }, { ...MAGE_CARDS[0] }, { ...MAGE_CARDS[0] }, // ファイアボルト x 4
      { ...MAGE_CARDS[1] }, { ...MAGE_CARDS[1] }, { ...MAGE_CARDS[1] }, { ...MAGE_CARDS[1] }, // マジックバリア x 4
      { ...MAGE_CARDS[4] }, // ライトニング x 1
      { ...MAGE_CARDS[2] }  // 魔力の暴走 x 1
    ],
    icon: 'Wand2',
    color: 'bg-violet-700 border-violet-500'
  }
];

// ==========================================
// ENEMIES TEMPLATES
// ==========================================

export const NORMAL_ENEMIES = [
  { name: 'スライム', maxHp: 24, image: '🧪', type: 'slime' },
  { name: '野良ウルフ', maxHp: 28, image: '🐺', type: 'wolf' },
  { name: 'ゴブリン兵', maxHp: 32, image: '👺', type: 'goblin' },
  { name: '巨大コウモリ', maxHp: 22, image: '🦇', type: 'bat' }
];

export const ELITE_ENEMIES = [
  { name: '古代ゴーレム', maxHp: 55, image: '🗿', type: 'golem' },
  { name: 'ダークナイト', maxHp: 65, image: '⚔️', type: 'dark_knight' },
  { name: 'マナホロウ', maxHp: 48, image: '👿', type: 'hollow' }
];

export const BOSS_ENEMIES = [
  { name: 'ドラゴンスレイヤー', maxHp: 110, image: '🐉', type: 'dragon' },
  { name: 'ロード・オブ・カオス', maxHp: 125, image: '😈', type: 'chaos' }
];

// Generate an enemy instance
export function generateEnemy(nodeType: NodeType, depth: number): Enemy {
  let template;
  if (nodeType === 'boss') {
    template = BOSS_ENEMIES[Math.floor(Math.random() * BOSS_ENEMIES.length)];
  } else if (nodeType === 'elite') {
    template = ELITE_ENEMIES[Math.floor(Math.random() * ELITE_ENEMIES.length)];
  } else {
    template = NORMAL_ENEMIES[Math.floor(Math.random() * NORMAL_ENEMIES.length)];
  }

  // Multiply stats slightly with depth
  const difficultyMultiplier = 1 + (depth * 0.12);
  const hp = Math.floor(template.maxHp * difficultyMultiplier);

  // Generate a random initial intent
  const intent = generateEnemyIntent(template.type, 1, hp);

  return {
    id: `${template.type}_${Date.now()}`,
    name: template.name,
    hp: hp,
    maxHp: hp,
    shield: 0,
    intent: intent,
    image: template.image,
    vulnerableTurns: 0,
    strength: nodeType === 'elite' ? 1 : nodeType === 'boss' ? 2 : 0
  };
}

export function generateEnemyIntent(type: string, turn: number, currentHp: number): { type: any; value: number; description: string } {
  const roll = Math.random();

  switch (type) {
    case 'slime':
      if (roll < 0.45) {
        return { type: 'attack', value: 5, description: 'ねっとりタックル! 5ダメージ' };
      } else if (roll < 0.8) {
        return { type: 'defend', value: 4, description: '硬化! 防御4' };
      } else {
        return { type: 'debuff', value: 1, description: 'スライム液を浴びせる! 脆弱を1ターン付与' };
      }
    case 'wolf':
      if (roll < 0.5) {
        return { type: 'attack', value: 7, description: '噛みつき! 7ダメージ' };
      } else if (roll < 0.8) {
        return { type: 'attack', value: 4 * 2, description: '連続噛みつき! 4ダメージ x 2回' }; // we can simulate multiple, but let's treat as 8
      } else {
        return { type: 'debuff', value: 2, description: '唸り声! 脆弱を2ターン付与' };
      }
    case 'goblin':
      if (roll < 0.6) {
        return { type: 'attack', value: 8, description: 'ダガー急襲! 8ダメージ' };
      } else if (roll < 0.85) {
        return { type: 'defend', value: 5, description: '盾を構える! 防御5' };
      } else {
        return { type: 'buff', value: 2, description: '狂暴化! 筋力+2' };
      }
    case 'bat':
      if (roll < 0.5) {
        return { type: 'attack', value: 5, description: '吸血! 5ダメージ (次のターン強化される)' };
      } else if (roll < 0.8) {
        return { type: 'defend', value: 3, description: '羽ばたき回避! 防御3' };
      } else {
        return { type: 'debuff', value: 1, description: '超音波! 脆弱を1ターン付与' };
      }
    case 'golem':
      if (roll < 0.4) {
        return { type: 'attack', value: 12, description: '岩石叩き落とし! 12の大ダメージ' };
      } else if (roll < 0.8) {
        return { type: 'defend', value: 10, description: '大地の装甲! 防御10' };
      } else {
        return { type: 'buff', value: 3, description: '過充電! 筋力+3' };
      }
    case 'dark_knight':
      if (roll < 0.4) {
        return { type: 'attack', value: 10, description: '黒い斬撃! 10ダメージ' };
      } else if (roll < 0.8) {
        return { type: 'defend', value: 8, description: 'ダークシールド! 防御8' };
      } else {
        return { type: 'attack', value: 6, description: '破滅の盾撃! 6ダメージ、脆弱を1ターン付与' }; // attack + debuff
      }
    case 'hollow':
      if (roll < 0.5) {
        return { type: 'attack', value: 9, description: '魔力放出! 9ダメージ' };
      } else if (roll < 0.8) {
        return { type: 'defend', value: 6, description: '魔術障壁! 防御6' };
      } else {
        return { type: 'special', value: 4, description: 'ライフ吸収! 敵HP4回復' };
      }
    case 'dragon':
      if (turn % 3 === 0) {
        return { type: 'attack', value: 22, description: 'アルティメットブレス! 22の大破壊ダメージ' };
      } else if (roll < 0.5) {
        return { type: 'attack', value: 13, description: '巨大な爪! 13ダメージ' };
      } else if (roll < 0.8) {
        return { type: 'defend', value: 12, description: '竜鱗防御! 防御12' };
      } else {
        return { type: 'buff', value: 4, description: '咆哮! 筋力+4を得る' };
      }
    case 'chaos':
      if (turn % 3 === 0) {
        return { type: 'attack', value: 18, description: 'カオスレイ! 18ダメージ、プレイヤーに脆弱を2ターン付与' };
      } else if (roll < 0.4) {
        return { type: 'attack', value: 12, description: '時空裂断! 12ダメージ' };
      } else if (roll < 0.7) {
        return { type: 'defend', value: 11, description: '混沌の盾! 防御11' };
      } else {
        return { type: 'buff', value: 3, description: 'カオスの覚醒! 筋力+3を得る' };
      }
    default:
      return { type: 'attack', value: 6, description: '突進! 6ダメージ' };
  }
}

// ==========================================
// RANDOM EVENT POOL
// ==========================================

export const EVENTS: RandomEvent[] = [
  {
    id: 'spring_fairy',
    title: '妖精の泉',
    description: '薄暗い洞窟の奥に、美しく輝く清らかな泉があります。傍らでおっとりとした妖精があなたを眺めています。',
    choices: [
      {
        text: '神聖な泉の水を飲む (HPを40%回復する)',
        effectText: 'プレイヤーのHPが大きく回復します。',
        action: (playerState) => {
          const healAmount = Math.floor(playerState.maxHp * 0.4);
          const newHp = Math.min(playerState.hp + healAmount, playerState.maxHp);
          return {
            updatedPlayer: { ...playerState, hp: newHp },
            logText: `泉の美味しい水を飲み、生命力が宿りました。 (HP +${newHp - playerState.hp} 回復)`
          };
        }
      },
      {
        text: '妖精に祈りを捧げる (デッキから1枚選んで削除 - デッキ整理)',
        effectText: 'デッキから、不要なカード（「ストライク」や「防御」など）を1枚完全に削除して、デッキのドロー回転を高めます。',
        action: (playerState) => {
          // Setting a special flag or handled by the parent component
          return {
            updatedPlayer: { ...playerState, _pendingRemoveCard: true },
            logText: '妖精はあなたの願いを聞き届け、古い記憶のカードを消し炭に変えてくれました。'
          };
        }
      }
    ]
  },
  {
    id: 'mysterious_peddler',
    title: '謎の闇商人',
    description: 'マントを深く被った行商人が、ぼんやりと怪しげな薬を並べて手招きしています。',
    choices: [
      {
        text: '裏メニューの秘伝薬品を購入する (-50ゴールド, 最大HP+10 & HP全回復)',
        effectText: 'ゴールドを消費して、頑強な肉体を手に入れます。',
        requirement: (player) => player.gold >= 50,
        action: (playerState) => {
          const newMax = playerState.maxHp + 10;
          return {
            updatedPlayer: { ...playerState, gold: playerState.gold - 50, maxHp: newMax, hp: newMax },
            logText: `怪しげな紫色の液体を飲み干しました！心臓が激しく脈打ち、生命限界が高まりました！ (最大HP +10, HP全快)`
          };
        }
      },
      {
        text: '手持ちの無駄なカードを引き取ってもらう (+30ゴールド獲得, デッキから1枚削除)',
        effectText: '不要なカードを1枚失い、代わりにゴールドを獲得します。',
        action: (playerState) => {
          return {
            updatedPlayer: { ...playerState, gold: playerState.gold + 30, _pendingRemoveCardGold: true },
            logText: '商人は楽しげにあなたの提示した古いカードを懐へしまい、硬貨を差し出しました。 (ゴールド +30)'
          };
        }
      },
      {
        text: '目を合わせずに素通りする',
        effectText: '何もせず次に進みます。',
        action: (playerState) => {
          return {
            updatedPlayer: playerState,
            logText: '取引の不穏な空気を警戒し、あなたは速歩きでその場を去りました。'
          };
        }
      }
    ]
  },
  {
    id: 'ancient_chest',
    title: '古びた宝箱',
    description: 'ツタの絡まった、埃をかぶった立派な長箱が道の真ん中に佇んでいます。わずかに罠の気配を感じます。',
    choices: [
      {
        text: '宝箱を強引にこじ開ける！ (50%で70G獲得、50%で12ダメージの罠)',
        effectText: '一攫千金をかけてリスクを取ります。',
        action: (playerState) => {
          if (Math.random() < 0.5) {
            return {
              updatedPlayer: { ...playerState, gold: playerState.gold + 70 },
              logText: '見事に罠を回避し、中にぎっしり詰まった古い金貨を回収しました！ (ゴールド +70)'
            };
          } else {
            const damage = 12;
            const newHp = Math.max(playerState.hp - damage, 1);
            return {
              updatedPlayer: { ...playerState, hp: newHp },
              logText: `カチリ！トゲの罠が飛び出しました！鋭い痛みが走ります。 (HP -${damage})`
            };
          }
        }
      },
      {
        text: '慎重に罠を解除しながら開ける (20G確実に獲得)',
        effectText: '安全に金貨の一部だけを回収します。',
        action: (playerState) => {
          return {
            updatedPlayer: { ...playerState, gold: playerState.gold + 20 },
            logText: '時間をかけて安全機構を処理し、底板に挟まれた財布を拾い上げました。 (ゴールド +20)'
          };
        }
      }
    ]
  },
  {
    id: 'dark_altar',
    title: '生け贄の闇祭壇',
    description: '血のような紅い鉱石で作られた祭壇が闇の中に浮かんでいます。強烈な魔力がプレイヤーに囁きかけています。',
    choices: [
      {
        text: '肉体の健康を捧げ、力を得る (-15 HP, 筋力 +2 を恒常獲得)',
        effectText: '現HPを15捧げ、今後のバトルで与えるすべての攻撃ダメージを永続的に +2 します。',
        requirement: (player) => player.hp > 15,
        action: (playerState) => {
          return {
            updatedPlayer: { ...playerState, hp: playerState.hp - 15, permanentStrength: (playerState.permanentStrength || 0) + 2 },
            logText: '肌を切り裂き、祭壇に鮮血を染み込ませました。腕に血の呪印が刻まれ、凄まじい力がみなぎります。 (HP -15, 永続筋力 +2)'
          };
        }
      },
      {
        text: '祈祷して強大なカードを望む (-10 HP, ランダムな職業レアカードを獲得)',
        effectText: 'HPを10消費して、デッキに圧倒的なエースカードを1枚追加します。',
        requirement: (player) => player.hp > 10,
        action: (playerState) => {
          return {
            updatedPlayer: { ...playerState, hp: playerState.hp - 10, _pendingRareCard: true },
            logText: '生命エネルギーの一部を代償、祭壇は混沌の炎の中から神秘の閃きに満ちたカードを生成しました。 (HP -10)'
          };
        }
      },
      {
        text: '祭壇を無視し、浄化の聖句を唱えて通り過ぎる (+15 HP 回復)',
        effectText: '邪悪な魔力を払うことで心が静まり、HPが15回復します。',
        action: (playerState) => {
          const newHp = Math.min(playerState.hp + 15, playerState.maxHp);
          return {
            updatedPlayer: { ...playerState, hp: newHp },
            logText: '静かに目を閉じ平和の祈りを呟くと、闇の揺らぎが和らぎ、心身が癒やされました。 (HP +15 回復)'
          };
        }
      }
    ]
  }
];

// ==========================================
// MAP GENERATOR
// ==========================================

export function generateDungeonMap(maxDepth: number = 8): DungeonNode[] {
  const map: DungeonNode[] = [];
  let idCounter = 0;

  // Depth 0: Start Node (Rest/Event or Job start layout, let's make it a free entry rest)
  map.push({
    id: idCounter++,
    depth: 0,
    position: 1,
    type: 'rest',
    name: 'キャンプ (安全地帯)',
    connectedTo: [],
    cleared: true
  });

  // Intermediate depths: 1 to maxDepth - 2
  // Create branches
  for (let d = 1; d <= maxDepth - 2; d++) {
    // Determine node types for this row
    // Pattern:
    // depth 1: Slime/Normal enemies (all Battle or Event)
    // depth 2: Battle, Event
    // depth 3: Elite battle, Rest, Event
    // depth 4: Battle, Event
    // depth 5: Elite battle, Rest, Event
    // depth 6: Rest (Preparing for boss)
    
    let types: NodeType[] = [];
    if (d === 1) {
      types = ['battle', 'event', 'battle'];
    } else if (d === 2) {
      types = ['event', 'battle', 'event'];
    } else if (d === 3) {
      types = ['elite', 'rest', 'event'];
    } else if (d === 4) {
      types = ['battle', 'event', 'battle'];
    } else if (d === 5) {
      types = ['elite', 'rest', 'event'];
    } else if (d === 6) {
      types = ['rest', 'rest', 'event'];
    } else {
      types = ['battle', 'event', 'battle'];
    }

    // Number of branches
    const count = types.length; 
    for (let p = 0; p < count; p++) {
      let nodeName = '';
      switch (types[p]) {
        case 'battle': nodeName = '魔物の生息地'; break;
        case 'elite': nodeName = '危険な強敵マス'; break;
        case 'event': nodeName = '怪しい未踏地'; break;
        case 'rest': nodeName = '旅人の休息所'; break;
        default: nodeName = '未踏マス';
      }

      map.push({
        id: idCounter++,
        depth: d,
        position: p,
        type: types[p],
        name: nodeName,
        connectedTo: [],
        cleared: false
      });
    }
  }

  // Pre-Boss Rest Area (Depth maxDepth - 1)
  const preBossId = idCounter++;
  map.push({
    id: preBossId,
    depth: maxDepth - 1,
    position: 1,
    type: 'rest',
    name: 'ボス直前の安息日',
    connectedTo: [],
    cleared: false
  });

  // Boss Node (Depth maxDepth)
  const bossId = idCounter++;
  map.push({
    id: bossId,
    depth: maxDepth,
    position: 1,
    type: 'boss',
    name: '深淵の魔王の間 (LASTボス)',
    connectedTo: [],
    cleared: false
  });

  // CONNECT NODES
  // Depth 0 connects to all nodes of Depth 1
  const d1Nodes = map.filter(n => n.depth === 1);
  map[0].connectedTo = d1Nodes.map(n => n.id);

  // Connect other layers
  for (let d = 1; d <= maxDepth - 2; d++) {
    const currentLayer = map.filter(n => n.depth === d);
    const nextLayer = map.filter(n => n.depth === d + 1);

    currentLayer.forEach(curr => {
      if (d === maxDepth - 2) {
        // Last branching layer connects to the pre-boss rest area
        curr.connectedTo = [preBossId];
      } else {
        // Standard connectivity:
        // position 0 connects to next layer pos 0 and 1
        // position 1 connects to next layer pos 0, 1, 2
        // position 2 connects to next layer pos 1 and 2
        if (curr.position === 0) {
          curr.connectedTo = nextLayer.filter(n => n.position === 0 || n.position === 1).map(n => n.id);
        } else if (curr.position === 1) {
          curr.connectedTo = nextLayer.map(n => n.id);
        } else if (curr.position === 2) {
          curr.connectedTo = nextLayer.filter(n => n.position === 1 || n.position === 2).map(n => n.id);
        }
      }
    });
  }

  // Pre-boss connects to Boss
  const preBossNode = map.find(n => n.id === preBossId);
  if (preBossNode) {
    preBossNode.connectedTo = [bossId];
  }

  return map;
}

// Draw premium design rewards
export function getRandomRewards(jobId: string, count: number = 3): Card[] {
  const cardsPool = jobId === 'knight' ? KNIGHT_CARDS : MAGE_CARDS;
  const shuffled = [...cardsPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(c => ({ ...c, id: `${c.id}_reward_${Date.now()}_${Math.floor(Math.random() * 1000)}` }));
}

export function getRandomRareCard(jobId: string): Card {
  const cardsPool = jobId === 'knight' ? KNIGHT_CARDS : MAGE_CARDS;
  const rares = cardsPool.filter(c => c.rarity === 'rare');
  const target = rares[Math.floor(Math.random() * rares.length)];
  return { ...target, id: `${target.id}_rare_${Date.now()}` };
}
