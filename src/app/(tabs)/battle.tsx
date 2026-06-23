import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';
import { useBattleStore } from '../../stores/battle-store';
import { useHealthStore } from '../../stores/health-store';
import { calculateSTR, calculateEND, calculateVIT, calculateLevel, getTitle } from '../../game/stats';
import { fatEquivalent } from '../../game/enemies';
import HpBar from '../../components/HpBar';
import PlayerStatsCard from '../../components/PlayerStatsCard';

export default function BattleScreen() {
  const enemy = useBattleStore((s) => s.enemy);
  const enemyCurrentHp = useBattleStore((s) => s.enemyCurrentHp);
  const enemyMaxHp = useBattleStore((s) => s.enemyMaxHp);
  const totalDefeated = useBattleStore((s) => s.totalDefeated);
  const damageDealToday = useBattleStore((s) => s.damageDealToday);
  const healingReceivedToday = useBattleStore((s) => s.healingReceivedToday);
  const isLoaded = useBattleStore((s) => s.isLoaded);
  const loadBattleState = useBattleStore((s) => s.loadBattleState);
  const applyDamage = useBattleStore((s) => s.applyDamage);

  const todayActivity = useHealthStore((s) => s.todayActivity);
  const todayCalories = useHealthStore((s) => s.todayCalories);
  const latestWeight = useHealthStore((s) => s.latestWeight);
  const todayHeartRate = useHealthStore((s) => s.todayHeartRate);
  const todaySleep = useHealthStore((s) => s.todaySleep);

  // Load battle state on mount
  useEffect(() => {
    loadBattleState();
  }, [loadBattleState]);

  // Apply damage whenever calorie data changes
  useEffect(() => {
    if (!isLoaded || !enemy) return;
    const caloriesBurned = todayActivity?.caloriesOut ?? 0;
    const caloriesConsumed = todayCalories;
    if (caloriesBurned === 0 && caloriesConsumed === 0) return;
    applyDamage(caloriesBurned, caloriesConsumed);
  }, [isLoaded, enemy, todayActivity?.caloriesOut, todayCalories, applyDamage]);

  // Derive player stats
  const str = calculateSTR(latestWeight?.weight, latestWeight?.bodyFatPercentage);
  const end = calculateEND(
    todayActivity?.steps,
    todayActivity != null
      ? todayActivity.fairlyActiveMinutes + todayActivity.veryActiveMinutes
      : undefined,
  );
  const vit = calculateVIT(todayHeartRate?.restingHeartRate, todaySleep?.efficiency);

  const level = calculateLevel(totalDefeated);
  const title = getTitle(level);

  const caloriesBurned = todayActivity?.caloriesOut ?? 0;
  const caloriesConsumed = todayCalories;
  const net = caloriesBurned - caloriesConsumed;

  if (!isLoaded || !enemy) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading battle...</Text>
      </View>
    );
  }

  const fatLabel = fatEquivalent(enemyMaxHp);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.levelText}>
          Level {level}{' '}
          <Text style={styles.titleText}>{title}</Text>
        </Text>
        <Text style={styles.defeatedText}>{totalDefeated} Defeated</Text>
      </View>

      {/* Enemy Section */}
      <View style={styles.enemySection}>
        <Text style={styles.enemyEmoji}>{enemy.emoji}</Text>
        <Text style={styles.enemyName}>{enemy.name}</Text>
        <Text style={styles.enemyDescription}>{enemy.description}</Text>
        {fatLabel && <Text style={styles.fatLabel}>{fatLabel}</Text>}
      </View>

      {/* HP Bar */}
      <View style={styles.hpSection}>
        <HpBar currentHp={enemyCurrentHp} maxHp={enemyMaxHp} />
      </View>

      {/* Today's Combat */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Combat</Text>
        <View style={styles.combatRow}>
          <Text style={styles.combatLabel}>Burned</Text>
          <Text style={styles.combatValue}>{caloriesBurned.toLocaleString()} cal</Text>
        </View>
        <View style={styles.combatRow}>
          <Text style={styles.combatLabel}>Consumed</Text>
          <Text style={styles.combatValue}>{caloriesConsumed.toLocaleString()} cal</Text>
        </View>
        <View style={[styles.combatRow, styles.combatNetRow]}>
          <Text style={styles.combatLabel}>Net</Text>
          <Text style={[styles.combatValue, { color: net >= 0 ? COLORS.steps : COLORS.secondary }]}>
            {net >= 0 ? '-' : '+'}{Math.abs(net).toLocaleString()} cal
          </Text>
        </View>
        <View style={styles.combatRow}>
          <Text style={styles.combatLabel}>
            {damageDealToday > 0 ? 'Damage Dealt' : healingReceivedToday > 0 ? 'Enemy Healed' : 'Damage'}
          </Text>
          <Text
            style={[
              styles.combatValue,
              { color: damageDealToday > 0 ? COLORS.steps : healingReceivedToday > 0 ? COLORS.secondary : COLORS.textSecondary },
            ]}
          >
            {damageDealToday > 0
              ? `-${damageDealToday.toLocaleString()} HP`
              : healingReceivedToday > 0
                ? `+${healingReceivedToday.toLocaleString()} HP`
                : '0 HP'}
          </Text>
        </View>
      </View>

      {/* Player Stats */}
      <PlayerStatsCard str={str} end={end} vit={vit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelText: {
    color: COLORS.xp,
    fontSize: 18,
    fontWeight: '700',
  },
  titleText: {
    color: COLORS.text,
    fontWeight: '400',
  },
  defeatedText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  enemySection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  enemyEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  enemyName: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
  },
  enemyDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  fatLabel: {
    color: COLORS.calories,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  hpSection: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  combatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  combatNetRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
    paddingTop: 6,
    marginTop: 2,
  },
  combatLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  combatValue: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
