// API base URLs
export const FITBIT_API_BASE = 'https://api.fitbit.com';
export const GOOGLE_FIT_API_BASE = 'https://www.googleapis.com/fitness/v1';

// OAuth URLs
export const FITBIT_AUTH_URL = 'https://www.fitbit.com/oauth2/authorize';
export const FITBIT_TOKEN_URL = 'https://api.fitbit.com/oauth2/token';
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
export const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// OAuth scopes
export const FITBIT_SCOPES = [
  'activity',
  'heartrate',
  'sleep',
  'weight',
  'profile',
  'oxygen_saturation',
  'electrocardiogram',
  'respiratory_rate',
  'cardio_fitness',
] as const;

export const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.body.read',
] as const;

// Dark theme color palette
export const COLORS = {
  background: '#1a1a2e',
  surface: '#16213e',
  surfaceLight: '#0f3460',
  primary: '#00d4aa',
  secondary: '#e94560',
  text: '#ffffff',
  textSecondary: '#a0a0b0',
  heartRate: '#e94560',
  steps: '#00d4aa',
  sleep: '#7b68ee',
  calories: '#ff8c00',
  weight: '#4fc3f7',
  spo2: '#ba68c8',
} as const;

// Default goals
export const CALORIE_GOAL = 2000;
export const STEPS_GOAL = 10000;
