import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useHealthStore } from '../../stores/health-store';
import { WeightChart } from '../../components/charts/WeightChart';
import { COLORS } from '../../utils/constants';

export default function BodyScreen() {
  const latest = useHealthStore((s) => s.latestWeight);
  const bodyCompTrend = useHealthStore((s) => s.bodyCompTrend);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Weight Trend</Text>
      <WeightChart data={bodyCompTrend} />

      <Text style={styles.sectionTitle}>Latest Measurements</Text>
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statValue}>
            {latest?.weight?.toFixed(1) ?? '--'} kg
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>BMI</Text>
          <Text style={styles.statValue}>
            {latest?.bmi?.toFixed(1) ?? '--'}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Body Fat</Text>
          <Text style={styles.statValue}>
            {latest?.bodyFatPercentage?.toFixed(1) ?? '--'}%
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Muscle Mass</Text>
          <Text style={styles.statValue}>
            {latest?.muscleMass?.toFixed(1) ?? '--'} kg
          </Text>
        </View>
      </View>

      <Text style={styles.source}>
        Data from Google Fit (Renpho scale)
      </Text>
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
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  statLabel: { color: COLORS.textSecondary, fontSize: 14 },
  statValue: { color: COLORS.weight, fontSize: 16, fontWeight: '600' },
  source: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
