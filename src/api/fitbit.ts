import { useAuthStore } from '../stores/auth-store';
import { refreshFitbitToken } from '../auth/fitbit-auth';
import { FITBIT_API_BASE } from '../utils/constants';
import type {
  FitbitProfile,
  FitbitDevice,
  DailyActivitySummary,
  HeartRateData,
  SleepData,
  SpO2Data,
} from '../types/fitbit';

async function fitbitFetch<T>(path: string): Promise<T> {
  let token = useAuthStore.getState().fitbitToken;
  if (!token) throw new Error('Not authenticated with Fitbit');

  let response = await fetch(`${FITBIT_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 401) {
    const newToken = await refreshFitbitToken();
    if (!newToken) throw new Error('Failed to refresh Fitbit token');
    token = newToken;
    response = await fetch(`${FITBIT_API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  if (!response.ok) {
    throw new Error(`Fitbit API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getProfile(): Promise<FitbitProfile> {
  const data = await fitbitFetch<{ user: FitbitProfile }>('/1/user/-/profile.json');
  return data.user;
}

export async function getDevices(): Promise<FitbitDevice[]> {
  return fitbitFetch<FitbitDevice[]>('/1/user/-/devices.json');
}

export async function getDailyActivity(date: string): Promise<DailyActivitySummary> {
  const data = await fitbitFetch<{ summary: DailyActivitySummary }>(
    `/1/user/-/activities/date/${date}.json`,
  );
  return data.summary;
}

export async function getIntradayHeartRate(date: string): Promise<HeartRateData> {
  const data = await fitbitFetch<{
    'activities-heart': Array<{ value: { restingHeartRate?: number; heartRateZones: any[] } }>;
    'activities-heart-intraday': { dataset: Array<{ time: string; value: number }> };
  }>(`/1/user/-/activities/heart/date/${date}/1d/1min.json`);

  const summary = data['activities-heart']?.[0]?.value;
  const intraday = data['activities-heart-intraday']?.dataset ?? [];

  return {
    restingHeartRate: summary?.restingHeartRate ?? 0,
    zones: summary?.heartRateZones ?? [],
    intradayData: intraday.map((d) => ({ time: d.time, value: d.value })),
  };
}

export async function getSleep(date: string): Promise<SleepData | null> {
  const data = await fitbitFetch<{ sleep: SleepData[] }>(
    `/1.2/user/-/sleep/date/${date}.json`,
  );
  return data.sleep?.[0] ?? null;
}

export async function getSpO2(date: string): Promise<SpO2Data | null> {
  try {
    return await fitbitFetch<SpO2Data>(`/1/user/-/spo2/date/${date}.json`);
  } catch {
    return null;
  }
}

export async function getHeartRateTimeSeries(
  date: string,
  period: string = '1m',
): Promise<Array<{ dateTime: string; restingHeartRate?: number }>> {
  const data = await fitbitFetch<{
    'activities-heart': Array<{ dateTime: string; value: { restingHeartRate?: number } }>;
  }>(`/1/user/-/activities/heart/date/${date}/${period}.json`);

  return (data['activities-heart'] ?? []).map((d) => ({
    dateTime: d.dateTime,
    restingHeartRate: d.value?.restingHeartRate,
  }));
}

export async function getStepsTimeSeries(
  date: string,
  period: string = '1m',
): Promise<Array<{ dateTime: string; value: number }>> {
  const data = await fitbitFetch<{
    'activities-steps': Array<{ dateTime: string; value: string }>;
  }>(`/1/user/-/activities/steps/date/${date}/${period}.json`);

  return (data['activities-steps'] ?? []).map((d) => ({
    dateTime: d.dateTime,
    value: parseInt(d.value, 10),
  }));
}
