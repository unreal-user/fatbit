export interface CombatResult {
  damage: number;
  healing: number;
  newHp: number;
  defeated: boolean;
}

/**
 * Calculate combat outcome from today's calories.
 * Deficit = damage to enemy, surplus = healing for enemy.
 * Snapshot-based: recalculated from current totals each time.
 */
export function calculateCombat(
  caloriesBurned: number,
  caloriesConsumed: number,
  currentHp: number,
  maxHp: number,
): CombatResult {
  const net = caloriesBurned - caloriesConsumed;

  const damage = Math.max(0, net);
  const healing = Math.max(0, -net);

  let newHp = currentHp - damage + healing;
  // Clamp between 0 and maxHp
  newHp = Math.min(maxHp, Math.max(0, newHp));

  return {
    damage,
    healing,
    newHp,
    defeated: newHp <= 0,
  };
}
