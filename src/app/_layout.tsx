import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initDatabase } from '../db/client';
import { loadFitbitToken } from '../auth/fitbit-auth';
import { loadGoogleToken } from '../auth/google-auth';
import { useAuthStore } from '../stores/auth-store';
import { COLORS } from '../utils/constants';

export default function RootLayout() {
  useEffect(() => {
    async function init() {
      await initDatabase();
      await loadFitbitToken();
      await loadGoogleToken();
      useAuthStore.getState().setLoading(false);
    }
    init();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Connect Services', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
