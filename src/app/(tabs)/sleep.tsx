import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useHealthStore } from '../../stores/health-store';
import { SleepChart } from '../../components/charts/SleepChart';
import { COLORS } from '../../utils/constants';
import { formatDuration } from '../../utils/date';

export default function SleepScreen() {
  const sleep = useHealthStore((s) => s.todaySleep);

  const duration = sleep?.duration ? Math.round(sleep.duration / 60000) : 0;
  const stages = sleep?.stages;

  // Placeholder: will be replaced with actual weekly data from DB
  const weeklyData: Array<{ date: string; duration: number; stages?: any }> = [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Last Night</Text>

      {sleep ? (
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{formatDuration(duration)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Efficiency</Text>
            <Text style={styles.summaryValue}>{sleep.efficiency}%</Text>
          </View>
          {stages ? (
            <>
              <View style={styles.stageRow}>
                <View style={[styles.stageDot, { backgroundColor: '#1a237e' }]} />
                <Text style={styles.stageLabel}>Deep</Text>
                <Text style={styles.stageValue}>{stages.deep} min</Text>
              </View>
              <View style={styles.stageRow}>
                <View style={[styles.stageDot, { backgroundColor: '#5c6bc0' }]} />
                <Text style={styles.stageLabel}>Light</Text>
                <Text style={styles.stageValue}>{stages.light} min</Text>
              </View>
              <View style={styles.stageRow}>
                <View style={[styles.stageDot, { backgroundColor: '#7b68ee' }]} />
                <Text style={styles.stageLabel}>REM</Text>
                <Text style={styles.stageValue}>{stages.rem} min</Text>
              </View>
              <View style={styles.stageRow}>
                <View style={[styles.stageDot, { backgroundColor: '#9fa8da' }]} />
                <Text style={styles.stageLabel}>Awake</Text>
                <Text style={styles.stageValue}>{stages.wake} min</Text>
              </View>
            </>
          ) : null}
        </View>
      ) : (
        <Text style={styles.noData}>No sleep data available. Connect Fitbit to sync.</Text>
      )}

      <Text style={styles.sectionTitle}>7-Day Trend</Text>
      <SleepChart data={weeklyData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 14 },
  summaryValue: { color: COLORS.sleep, fontSize: 16, fontWeight: '600' },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  stageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  stageLabel: { color: COLORS.text, fontSize: 14, flex: 1 },
  stageValue: { color: COLORS.textSecondary, fontSize: 14 },
  noData: { color: COLORS.textSecondary, fontSize: 14, marginTop: 8 },
});
