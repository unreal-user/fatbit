import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CartesianChart, Bar } from 'victory-native';
import { COLORS } from '../../utils/constants';

interface Props {
  data: Array<{ dateTime: string; value: number }>;
  goal?: number;
}

export function StepsChart({ data, goal = 10000 }: Props) {
  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No steps data available</Text>
      </View>
    );
  }

  const chartData = data.map((d, i) => ({ x: i, y: d.value }));

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
                return data[idx].dateTime.slice(5); // MM-DD
              }
              return '';
            },
            labelColor: COLORS.textSecondary,
            lineColor: COLORS.surface,
          }}
        >
          {({ points, chartBounds }) => (
            <Bar
              points={points.y}
              chartBounds={chartBounds}
              color={COLORS.steps}
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
