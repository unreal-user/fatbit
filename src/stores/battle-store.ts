import { create } from 'zustand';
import { db } from '../db/client';
import { battleState, battleLog } from '../db/schema';
import { eq } from 'drizzle-orm';
import { pickRandomEnemy, getEnemyById, type Enemy } from '../game/enemies';
import { calculateCombat } from '../game/combat';

interface BattleStoreState {
  // Current enemy
  enemy: Enemy | null;
  enemyCurrentHp: number;
  enemyMaxHp: number;

  // Progression
  totalDefeated: number;
  totalDamageAllTime: number;

  // Daily trackers
  lastDamageDate: string | null;
  damageDealToday: number;
  healingReceivedToday: number;

  // Loading
  isLoaded: boolean;

  // Actions
  loadBattleState: () => Promise<void>;
  applyDamage: (caloriesBurned: number, caloriesConsumed: number) => Promise<void>;
}

function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const useBattleStore = create<BattleStoreState>((set, get) => ({
  enemy: null,
  enemyCurrentHp: 0,
  enemyMaxHp: 0,
  totalDefeated: 0,
  totalDamageAllTime: 0,
  lastDamageDate: null,
  damageDealToday: 0,
  healingReceivedToday: 0,
  isLoaded: false,

  loadBattleState: async () => {
    const rows = await db.select().from(battleState).where(eq(battleState.id, 'current'));
    const today = getTodayDate();

    if (rows.length === 0) {
      // First launch — spawn first enemy
      const enemy = pickRandomEnemy(0);
      await db.insert(battleState).values({
        id: 'current',
        enemyId: enemy.id,
        enemyCurrentHp: enemy.hp,
        enemyMaxHp: enemy.hp,
        totalDefeated: 0,
        totalDamageAllTime: 0,
        lastDamageDate: null,
        damageDealToday: 0,
        healingReceivedToday: 0,
      });
      set({
        enemy,
        enemyCurrentHp: enemy.hp,
        enemyMaxHp: enemy.hp,
        totalDefeated: 0,
        totalDamageAllTime: 0,
        lastDamageDate: null,
        damageDealToday: 0,
        healingReceivedToday: 0,
        isLoaded: true,
      });
      return;
    }

    const row = rows[0];
    const enemy = getEnemyById(row.enemyId);

    // Reset daily trackers if it's a new day
    let damageDealToday = row.damageDealToday;
    let healingReceivedToday = row.healingReceivedToday;
    let lastDamageDate = row.lastDamageDate;

    if (lastDamageDate !== today) {
      damageDealToday = 0;
      healingReceivedToday = 0;
      await db
        .update(battleState)
        .set({ damageDealToday: 0, healingReceivedToday: 0 })
        .where(eq(battleState.id, 'current'));
    }

    set({
      enemy,
      enemyCurrentHp: row.enemyCurrentHp,
      enemyMaxHp: row.enemyMaxHp,
      totalDefeated: row.totalDefeated,
      totalDamageAllTime: row.totalDamageAllTime,
      lastDamageDate,
      damageDealToday,
      healingReceivedToday,
      isLoaded: true,
    });
  },

  applyDamage: async (caloriesBurned: number, caloriesConsumed: number) => {
    const state = get();
    if (!state.enemy) return;

    const today = getTodayDate();
    const result = calculateCombat(caloriesBurned, caloriesConsumed, state.enemyMaxHp, state.enemyMaxHp);

    // Snapshot-based: damage/healing is the total for today, not incremental
    const newDamageToday = result.damage;
    const newHealingToday = result.healing;

    // Apply to current HP: start from max, apply today's net
    const newHp = Math.min(state.enemyMaxHp, Math.max(0, state.enemyMaxHp - newDamageToday + newHealingToday));
    const defeated = newHp <= 0;

    if (defeated) {
      const newTotalDefeated = state.totalDefeated + 1;
      const newTotalDamage = state.totalDamageAllTime + state.enemyMaxHp;

      // Log the defeat
      await db.insert(battleLog).values({
        enemyId: state.enemy.id,
        enemyMaxHp: state.enemyMaxHp,
        defeatedAt: new Date().toISOString(),
      });

      // Spawn next enemy
      const nextEnemy = pickRandomEnemy(newTotalDefeated);
      await db
        .update(battleState)
        .set({
          enemyId: nextEnemy.id,
          enemyCurrentHp: nextEnemy.hp,
          enemyMaxHp: nextEnemy.hp,
          totalDefeated: newTotalDefeated,
          totalDamageAllTime: newTotalDamage,
          lastDamageDate: today,
          damageDealToday: 0,
          healingReceivedToday: 0,
        })
        .where(eq(battleState.id, 'current'));

      set({
        enemy: nextEnemy,
        enemyCurrentHp: nextEnemy.hp,
        enemyMaxHp: nextEnemy.hp,
        totalDefeated: newTotalDefeated,
        totalDamageAllTime: newTotalDamage,
        lastDamageDate: today,
        damageDealToday: 0,
        healingReceivedToday: 0,
      });
    } else {
      const newTotalDamage = state.totalDamageAllTime + Math.max(0, newDamageToday - state.damageDealToday);

      await db
        .update(battleState)
        .set({
          enemyCurrentHp: newHp,
          totalDamageAllTime: newTotalDamage,
          lastDamageDate: today,
          damageDealToday: newDamageToday,
          healingReceivedToday: newHealingToday,
        })
        .where(eq(battleState.id, 'current'));

      set({
        enemyCurrentHp: newHp,
        totalDamageAllTime: newTotalDamage,
        lastDamageDate: today,
        damageDealToday: newDamageToday,
        healingReceivedToday: newHealingToday,
      });
    }
  },
}));
