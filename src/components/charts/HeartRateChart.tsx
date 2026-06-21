import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { COLORS } from '../../utils/constants';

interface Props {
  data: Array<{ time: string; value: number }>;
  restingHr?: number;
}

export function HeartRateChart({ data, restingHr }: Props) {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No heart rate data available</Text>
      </View>
    );
  }

  // Sample data to reduce points for performance (every 5 min)
  const sampled = data.filter((_, i) => i % 5 === 0).map((d, i) => ({
    x: i,
    y: d.value,
  }));

  return (
    <View style={styles.container}>
      {restingHr ? (
        <Text style={styles.resting}>Resting: {restingHr} bpm</Text>
      ) : null}
      <View style={styles.chart}>
        <CartesianChart
          data={sampled}
          xKey="x"
          yKeys={['y']}
          domainPadding={{ top: 10, bottom: 10 }}
          axisOptions={{
            font: null,
            tickCount: { x: 6, y: 5 },
            formatXLabel: (val) => {
              const idx = Math.round(val as number) * 5;
              const hours = Math.floor(idx / 60);
              return `${hours}:00`;
            },
            labelColor: COLORS.textSecondary,
            lineColor: COLORS.surface,
          }}
        >
          {({ points }) => (
            <Line
              points={points.y}
              color={COLORS.heartRate}
              strokeWidth={2}
              curveType="natural"
            />
          )}
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  chart: { height: 200 },
  resting: { color: COLORS.textSecondary, fontSize: 14, marginBottom: 4 },
  empty: { height: 200, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
});
