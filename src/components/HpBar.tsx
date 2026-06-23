import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface HpBarProps {
  currentHp: number;
  maxHp: number;
}

function getBarColor(ratio: number): string {
  if (ratio > 0.5) return '#4caf50';   // green
  if (ratio > 0.25) return '#ff9800';  // orange
  return '#f44336';                     // red
}

export default function HpBar({ currentHp, maxHp }: HpBarProps) {
  const ratio = maxHp > 0 ? currentHp / maxHp : 0;
  const percentage = Math.max(0, Math.min(100, ratio * 100));
  const barColor = getBarColor(ratio);

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={styles.label}>
        {currentHp.toLocaleString()} / {maxHp.toLocaleString()} HP
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barBackground: {
    height: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});
