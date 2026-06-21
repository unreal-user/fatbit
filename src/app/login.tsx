import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useFitbitAuth, exchangeFitbitToken } from '../auth/fitbit-auth';
import { useGoogleAuth, exchangeGoogleToken } from '../auth/google-auth';
import { useAuthStore } from '../stores/auth-store';
import { COLORS } from '../utils/constants';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function LoginScreen() {
  const router = useRouter();
  const fitbitToken = useAuthStore((s) => s.fitbitToken);
  const googleToken = useAuthStore((s) => s.googleToken);

  const { request: fitbitRequest, response: fitbitResponse, promptAsync: fitbitPrompt } = useFitbitAuth();
  const { request: googleRequest, response: googleResponse, promptAsync: googlePrompt } = useGoogleAuth();

  useEffect(() => {
    if (fitbitResponse?.type === 'success' && fitbitRequest?.codeVerifier) {
      exchangeFitbitToken(fitbitResponse.params.code, fitbitRequest.codeVerifier);
    }
  }, [fitbitResponse]);

  useEffect(() => {
    if (googleResponse?.type === 'success' && googleRequest?.codeVerifier) {
      exchangeGoogleToken(googleResponse.params.code, googleRequest.codeVerifier);
    }
  }, [googleResponse]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Your Services</Text>
      <Text style={styles.subtitle}>
        Link your Fitbit and Google Fit accounts to sync health data.
      </Text>

      <Pressable
        style={[styles.serviceButton, fitbitToken && styles.connected]}
        onPress={() => fitbitPrompt()}
        disabled={!fitbitRequest}
      >
        <Ionicons
          name={fitbitToken ? 'checkmark-circle' : 'watch-outline'}
          size={24}
          color={fitbitToken ? COLORS.primary : COLORS.text}
        />
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>Fitbit</Text>
          <Text style={styles.serviceStatus}>
            {fitbitToken ? 'Connected' : 'Tap to connect'}
          </Text>
        </View>
      </Pressable>

      <Pressable
        style={[styles.serviceButton, googleToken && styles.connected]}
        onPress={() => googlePrompt()}
        disabled={!googleRequest}
      >
        <Ionicons
          name={googleToken ? 'checkmark-circle' : 'fitness-outline'}
          size={24}
          color={googleToken ? COLORS.primary : COLORS.text}
        />
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>Google Fit</Text>
          <Text style={styles.serviceStatus}>
            {googleToken ? 'Connected' : 'Tap to connect (Renpho data)'}
          </Text>
        </View>
      </Pressable>

      {fitbitToken && googleToken ? (
        <Pressable style={styles.doneButton} onPress={() => router.back()}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      ) : null}

      <Text style={styles.note}>
        Your credentials are stored securely on-device. No data is sent to third parties.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  serviceButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  connected: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  serviceInfo: { flex: 1 },
  serviceName: { color: COLORS.text, fontSize: 18, fontWeight: '600' },
  serviceStatus: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  doneButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  doneText: { color: COLORS.background, fontSize: 18, fontWeight: '700' },
  note: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
  },
});
