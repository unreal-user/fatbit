import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { FITBIT_AUTH_URL, FITBIT_TOKEN_URL, FITBIT_SCOPES } from '../utils/constants';
import { useAuthStore } from '../stores/auth-store';

const FITBIT_CLIENT_ID = process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID ?? '';

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'fatbit' });

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: FITBIT_AUTH_URL,
  tokenEndpoint: FITBIT_TOKEN_URL,
};

export function useFitbitAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FITBIT_CLIENT_ID,
      scopes: [...FITBIT_SCOPES],
      redirectUri,
      usePKCE: true,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery,
  );

  return { request, response, promptAsync };
}

export async function exchangeFitbitToken(code: string, codeVerifier: string): Promise<void> {
  const response = await fetch(FITBIT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: FITBIT_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }).toString(),
  });

  const data = await response.json();
  if (data.access_token) {
    await SecureStore.setItemAsync('fitbit_access_token', data.access_token);
    await SecureStore.setItemAsync('fitbit_refresh_token', data.refresh_token);
    useAuthStore.getState().setFitbitToken(data.access_token);
  }
}

export async function refreshFitbitToken(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync('fitbit_refresh_token');
  if (!refreshToken) return null;

  const response = await fetch(FITBIT_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: FITBIT_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });

  const data = await response.json();
  if (data.access_token) {
    await SecureStore.setItemAsync('fitbit_access_token', data.access_token);
    await SecureStore.setItemAsync('fitbit_refresh_token', data.refresh_token);
    useAuthStore.getState().setFitbitToken(data.access_token);
    return data.access_token;
  }
  return null;
}

export async function loadFitbitToken(): Promise<void> {
  const token = await SecureStore.getItemAsync('fitbit_access_token');
  if (token) {
    useAuthStore.getState().setFitbitToken(token);
  }
}
