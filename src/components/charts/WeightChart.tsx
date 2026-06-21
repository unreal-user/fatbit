import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Line } from 'victory-native';
import { COLORS } from '../../utils/constants';

interface Props {
  data: Array<{ date: string; weight?: number; bodyFatPercentage?: number }>;
}

export function WeightChart({ data }: Props) {
  const weightData = data.filter((d) => d.weight != null);

  if (weightData.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No weight data available</Text>
      </View>
    );
  }

  const chartData = weightData.map((d, i) => ({ x: i, y: d.weight! }));

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={['y']}
          domainPadding={{ top: 10, bottom: 10 }}
          axisOptions={{
            font: null,
            tickCount: { x: 6, y: 5 },
            formatXLabel: (val) => {
              const idx = Math.round(val as number);
              if (idx >= 0 && idx < weightData.length) {
                return weightData[idx].date.slice(5);
              }
              return '';
            },
            formatYLabel: (val) => `${(val as number).toFixed(1)}`,
            labelColor: COLORS.textSecondary,
            lineColor: COLORS.surface,
          }}
        >
          {({ points }) => (
            <Line
              points={points.y}
              color={COLORS.weight}
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
  empty: { height: 200, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: COLORS.textSecondary, fontSize: 14 },
});
