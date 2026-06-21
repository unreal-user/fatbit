import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/auth-store';
import { useHealthStore } from '../../stores/health-store';
import { DailyMetricCard } from '../../components/DailyMetricCard';
import { COLORS, STEPS_GOAL, CALORIE_GOAL } from '../../utils/constants';
import { formatDate, formatDuration } from '../../utils/date';

export default function DashboardScreen() {
  const router = useRouter();
  const fitbitToken = useAuthStore((s) => s.fitbitToken);
  const activity = useHealthStore((s) => s.todayActivity);
  const heartRate = useHealthStore((s) => s.todayHeartRate);
  const sleep = useHealthStore((s) => s.todaySleep);
  const weight = useHealthStore((s) => s.latestWeight);
  const todayCalories = useHealthStore((s) => s.todayCalories);
  const isSyncing = useHealthStore((s) => s.isSyncing);

  const steps = activity?.steps ?? 0;
  const restingHr = heartRate?.restingHeartRate ?? 0;
  const sleepMinutes = sleep?.duration ? Math.round(sleep.duration / 60000) : 0;
  const activeZoneMinutes =
    (activity?.activeMinutes?.cardio ?? 0) +
    (activity?.activeMinutes?.peak ?? 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDate(new Date())}</Text>
        {!fitbitToken ? (
          <Pressable onPress={() => router.push('/login')} style={styles.connectButton}>
            <Text style={styles.connectText}>Connect Fitbit</Text>
          </Pressable>
        ) : null}
      </View>

      {isSyncing ? (
        <Text style={styles.syncText}>Syncing...</Text>
      ) : null}

      <View style={styles.grid}>
        <DailyMetricCard
          title="Steps"
          value={steps.toLocaleString()}
          subtitle={`Goal: ${STEPS_GOAL.toLocaleString()}`}
          color={COLORS.steps}
          progress={steps / STEPS_GOAL}
        />
        <DailyMetricCard
          title="Resting HR"
          value={restingHr || '--'}
          unit="bpm"
          color={COLORS.heartRate}
        />
        <DailyMetricCard
          title="Sleep"
          value={sleepMinutes > 0 ? formatDuration(sleepMinutes) : '--'}
          color={COLORS.sleep}
        />
        <DailyMetricCard
          title="Active Zone Min"
          value={activeZoneMinutes}
          unit="min"
          color={COLORS.primary}
        />
        <DailyMetricCard
          title="Weight"
          value={weight?.weight?.toFixed(1) ?? '--'}
          unit="kg"
          color={COLORS.weight}
        />
        <DailyMetricCard
          title="Calories"
          value={todayCalories}
          unit="kcal"
          subtitle={`Goal: ${CALORIE_GOAL}`}
          color={COLORS.calories}
          progress={todayCalories / CALORIE_GOAL}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: { color: COLORS.text, fontSize: 18, fontWeight: '600' },
  connectButton: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  connectText: { color: COLORS.primary, fontWeight: '600' },
  syncText: { color: COLORS.textSecondary, textAlign: 'center', marginBottom: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
});
