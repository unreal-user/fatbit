import { useAuthStore } from '../stores/auth-store';
import { refreshGoogleToken } from '../auth/google-auth';
import { GOOGLE_FIT_API_BASE } from '../utils/constants';
import { toNanos, fromNanos, formatDate } from '../utils/date';
import type { GoogleFitAggregateResponse, BodyCompositionData } from '../types/google-fit';

async function googleFitFetch<T>(path: string, body?: object): Promise<T> {
  let token = useAuthStore.getState().googleToken;
  if (!token) throw new Error('Not authenticated with Google');

  const options: RequestInit = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.method = 'POST';
    options.body = JSON.stringify(body);
  }

  let response = await fetch(`${GOOGLE_FIT_API_BASE}${path}`, options);

  if (response.status === 401) {
    const newToken = await refreshGoogleToken();
    if (!newToken) throw new Error('Failed to refresh Google token');
    token = newToken;
    options.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    response = await fetch(`${GOOGLE_FIT_API_BASE}${path}`, options);
  }

  if (!response.ok) {
    throw new Error(`Google Fit API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getBodyComposition(
  startDate: Date,
  endDate: Date,
): Promise<BodyCompositionData[]> {
  const data = await googleFitFetch<GoogleFitAggregateResponse>(
    '/users/me/dataset:aggregate',
    {
      aggregateBy: [
        { dataTypeName: 'com.google.weight' },
        { dataTypeName: 'com.google.body.fat.percentage' },
      ],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: startDate.getTime(),
      endTimeMillis: endDate.getTime(),
    },
  );

  return (data.bucket ?? []).map((bucket) => {
    const date = formatDate(new Date(parseInt(String(bucket.startTimeMillis), 10)));
    const result: BodyCompositionData = { date };

    for (const dataset of bucket.dataset) {
      for (const point of dataset.point) {
        if (dataset.dataSourceId.includes('weight') && point.value?.[0]?.fpVal) {
          result.weight = point.value[0].fpVal;
        }
        if (dataset.dataSourceId.includes('body.fat') && point.value?.[0]?.fpVal) {
          result.bodyFatPercentage = point.value[0].fpVal;
        }
      }
    }

    return result;
  }).filter((d) => d.weight !== undefined || d.bodyFatPercentage !== undefined);
}
