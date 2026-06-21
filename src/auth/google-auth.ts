import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { GOOGLE_AUTH_URL, GOOGLE_TOKEN_URL, GOOGLE_FIT_SCOPES } from '../utils/constants';
import { useAuthStore } from '../stores/auth-store';

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

const redirectUri = AuthSession.makeRedirectUri({ scheme: 'fatbit' });

const discovery: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: GOOGLE_AUTH_URL,
  tokenEndpoint: GOOGLE_TOKEN_URL,
};

export function useGoogleAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: [...GOOGLE_FIT_SCOPES],
      redirectUri,
      usePKCE: true,
      responseType: AuthSession.ResponseType.Code,
    },
    discovery,
  );

  return { request, response, promptAsync };
}

export async function exchangeGoogleToken(code: string, codeVerifier: string): Promise<void> {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }).toString(),
  });

  const data = await response.json();
  if (data.access_token) {
    await SecureStore.setItemAsync('google_access_token', data.access_token);
    if (data.refresh_token) {
      await SecureStore.setItemAsync('google_refresh_token', data.refresh_token);
    }
    useAuthStore.getState().setGoogleToken(data.access_token);
  }
}

export async function refreshGoogleToken(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync('google_refresh_token');
  if (!refreshToken) return null;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });

  const data = await response.json();
  if (data.access_token) {
    await SecureStore.setItemAsync('google_access_token', data.access_token);
    useAuthStore.getState().setGoogleToken(data.access_token);
    return data.access_token;
  }
  return null;
}

export async function loadGoogleToken(): Promise<void> {
  const token = await SecureStore.getItemAsync('google_access_token');
  if (token) {
    useAuthStore.getState().setGoogleToken(token);
  }
}
