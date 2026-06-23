import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface StatRowProps {
  label: string;
  value: number | null;
  color: string;
}

function StatRow({ label, value, color }: StatRowProps) {
  const displayValue = value != null ? String(value) : '??';
  const barWidth = value != null ? (value / 99) * 100 : 0;

  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarContainer}>
        <View style={[styles.statBarFill, { width: `${barWidth}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.statValue, { color }]}>{displayValue}</Text>
    </View>
  );
}

interface PlayerStatsCardProps {
  str: number | null;
  end: number | null;
  vit: number | null;
}

export default function PlayerStatsCard({ str, end, vit }: PlayerStatsCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Stats</Text>
      <StatRow label="STR" value={str} color={COLORS.secondary} />
      <StatRow label="END" value={end} color={COLORS.steps} />
      <StatRow label="VIT" value={vit} color={COLORS.sleep} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },
  statBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.background,
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },
});
