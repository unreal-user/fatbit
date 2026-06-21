import { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useHealthStore } from '../../stores/health-store';
import { HeartRateChart } from '../../components/charts/HeartRateChart';
import { COLORS } from '../../utils/constants';

export default function HeartRateScreen() {
  const heartRate = useHealthStore((s) => s.todayHeartRate);
  const heartRateTrend = useHealthStore((s) => s.heartRateTrend);

  const zones = heartRate?.zones ?? [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Today's Heart Rate</Text>
      <HeartRateChart
        data={heartRate?.intradayData ?? []}
        restingHr={heartRate?.restingHeartRate}
      />

      <Text style={styles.sectionTitle}>Heart Rate Zones</Text>
      <View style={styles.zonesContainer}>
        {zones.length > 0 ? (
          zones.map((zone) => (
            <View key={zone.name} style={styles.zoneRow}>
              <Text style={styles.zoneName}>{zone.name}</Text>
              <Text style={styles.zoneValue}>{zone.minutes} min</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No zone data available</Text>
        )}
      </View>

      <Text style={styles.sectionTitle}>30-Day Resting HR Trend</Text>
      {heartRateTrend.length > 0 ? (
        <View style={styles.trendList}>
          {heartRateTrend.slice(-7).map((d) => (
            <View key={d.dateTime} style={styles.trendRow}>
              <Text style={styles.trendDate}>{d.dateTime.slice(5)}</Text>
              <Text style={styles.trendValue}>
                {d.restingHeartRate ?? '--'} bpm
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noData}>No trend data available. Connect Fitbit to sync.</Text>
      )}
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
  zonesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  zoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  zoneName: { color: COLORS.text, fontSize: 14 },
  zoneValue: { color: COLORS.heartRate, fontSize: 14, fontWeight: '600' },
  trendList: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  trendDate: { color: COLORS.textSecondary, fontSize: 14 },
  trendValue: { color: COLORS.heartRate, fontSize: 14, fontWeight: '600' },
  noData: { color: COLORS.textSecondary, fontSize: 14, marginTop: 8 },
});
