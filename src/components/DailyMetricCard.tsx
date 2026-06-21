import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface Props {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  color?: string;
  progress?: number; // 0-1 for progress ring
}

export function DailyMetricCard({ title, value, unit, subtitle, color = COLORS.primary, progress }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.title, { color: COLORS.textSecondary }]}>{title}</Text>
      <View style={styles.valueRow}>
        {progress != null ? (
          <View style={styles.progressRing}>
            <View
              style={[
                styles.progressFill,
                {
                  borderColor: color,
                  transform: [{ rotate: `${Math.min(progress, 1) * 360}deg` }],
                },
              ]}
            />
            <Text style={[styles.progressText, { color }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        ) : null}
        <View>
          <Text style={[styles.value, { color }]}>
            {value}
            {unit ? <Text style={styles.unit}> {unit}</Text> : null}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    margin: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
