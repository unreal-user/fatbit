import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { COLORS } from '../../utils/constants';

interface SleepEntry {
  date: string;
  duration: number; // minutes
  stages?: { deep: number; light: number; rem: number; wake: number };
}

interface Props {
  data: SleepEntry[];
}

export function SleepChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No sleep data available</Text>
      </View>
    );
  }

  const chartData = data.map((d, i) => ({ x: i, y: d.duration / 60 })); // hours

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['y']}
          domainPadding={{ left: 10, right: 10 }}
          axisOptions={{
            font: null,
            tickCount: { x: 7, y: 5 },
            formatXLabel: (val) => {
              const idx = Math.round(val as number);
              if (idx >= 0 && idx < data.length) {
                return data[idx].date.slice(5);
              }
              return '';
            },
            formatYLabel: (val) => `${(val as number).toFixed(0)}h`,
            labelColor: COLORS.textSecondary,
            lineColor: COLORS.surface,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.y}
              chartBounds={chartBounds}
              color={COLORS.sleep}
              roundedCorners={{ topLeft: 4, topRight: 4 }}
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
  empty: { height: 200, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
});
