export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  description: string;
  hp: number;
  tier: 1 | 2 | 3 | 4;
}

export const ENEMIES: Enemy[] = [
  // Tier 1 — 1-3 days
  { id: 'slime', name: 'Slime', emoji: '\u{1F7E2}', description: 'A wobbly green blob', hp: 500, tier: 1 },
  { id: 'sewer_rat', name: 'Sewer Rat', emoji: '\u{1F400}', description: 'Skitters in the dark', hp: 750, tier: 1 },
  { id: 'cave_bat', name: 'Cave Bat', emoji: '\u{1F987}', description: 'Flaps menacingly', hp: 1000, tier: 1 },

  // Tier 2 — 3-7 days
  { id: 'goblin', name: 'Goblin', emoji: '\u{1F47A}', description: 'Armed and cranky', hp: 1750, tier: 2 },
  { id: 'skeleton', name: 'Skeleton', emoji: '\u{1F480}', description: 'Rattles with rage', hp: 2500, tier: 2 },
  { id: 'dire_wolf', name: 'Dire Wolf', emoji: '\u{1F43A}', description: 'Howls at the moon', hp: 3000, tier: 2 },

  // Tier 3 — 7-14 days (~1lb+)
  { id: 'ogre', name: 'Ogre', emoji: '\u{1F479}', description: '~1 lb of fat', hp: 3500, tier: 3 },
  { id: 'minotaur', name: 'Minotaur', emoji: '\u{1F402}', description: 'Guards the labyrinth', hp: 5000, tier: 3 },
  { id: 'wyvern', name: 'Wyvern', emoji: '\u{1F985}', description: 'Breathes fire from above', hp: 7000, tier: 3 },

  // Tier 4 — 14-30 days (~3-4lb)
  { id: 'dragon', name: 'Dragon', emoji: '\u{1F409}', description: '~3 lbs of fat', hp: 10500, tier: 4 },
  { id: 'lich_king', name: 'Lich King', emoji: '\u{1F451}', description: '~4 lbs of fat', hp: 14000, tier: 4 },
];

const ENEMY_MAP = new Map(ENEMIES.map((e) => [e.id, e]));

export function getEnemyById(id: string): Enemy {
  const enemy = ENEMY_MAP.get(id);
  if (!enemy) throw new Error(`Unknown enemy: ${id}`);
  return enemy;
}

/** Maximum unlocked tier based on total enemies defeated */
function getMaxTier(totalDefeated: number): 1 | 2 | 3 | 4 {
  if (totalDefeated >= 10) return 4;
  if (totalDefeated >= 5) return 3;
  if (totalDefeated >= 2) return 2;
  return 1;
}

/** Pick a weighted-random enemy based on progression */
export function pickRandomEnemy(totalDefeated: number): Enemy {
  const maxTier = getMaxTier(totalDefeated);
  const pool = ENEMIES.filter((e) => e.tier <= maxTier);

  // Weight higher tiers more as the player progresses
  const weighted: Enemy[] = [];
  for (const enemy of pool) {
    // Higher tiers get more weight so they appear more often once unlocked
    const weight = enemy.tier === maxTier ? 3 : enemy.tier === maxTier - 1 ? 2 : 1;
    for (let i = 0; i < weight; i++) {
      weighted.push(enemy);
    }
  }

  return weighted[Math.floor(Math.random() * weighted.length)];
}

/** Fat equivalent string for display */
export function fatEquivalent(hp: number): string | null {
  const lbs = hp / 3500;
  if (lbs < 0.5) return null;
  return `~${lbs.toFixed(1)} lbs of fat`;
}
