export interface FitbitProfile {
  encodedId: string;
  fullName: string;
  displayName: string;
  avatar: string;
  avatar150: string;
  avatar640: string;
  memberSince: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  strideLengthRunning: number;
  strideLengthWalking: number;
  timezone: string;
  offsetFromUTCMillis: number;
  country: string;
}

export interface FitbitDevice {
  id: string;
  deviceVersion: string;
  batteryLevel: string;
  lastSyncTime: string;
  type: 'TRACKER' | 'SCALE' | 'WATCH';
  mac: string;
}

export interface HeartRateZone {
  name: string;
  min: number;
  max: number;
  minutes: number;
  caloriesOut: number;
}

export interface IntradayHeartRate {
  time: string;
  value: number;
}

export interface HeartRateData {
  restingHeartRate: number;
  zones: HeartRateZone[];
  intradayData: IntradayHeartRate[];
}

export interface ActiveMinutes {
  cardio: number;
  fatBurn: number;
  peak: number;
  outOfRange: number;
}

export interface DailyActivitySummary {
  steps: number;
  distance: number;
  floors: number;
  caloriesOut: number;
  activeMinutes: ActiveMinutes;
  sedentaryMinutes: number;
  lightlyActiveMinutes: number;
  fairlyActiveMinutes: number;
  veryActiveMinutes: number;
  activityCalories: number;
  marginalCalories: number;
}

export interface SleepStage {
  dateTime: string;
  level: 'deep' | 'light' | 'rem' | 'wake';
  seconds: number;
}

export interface SleepData {
  dateOfSleep: string;
  duration: number;
  efficiency: number;
  minutesAsleep: number;
  minutesAwake: number;
  startTime: string;
  endTime: string;
  timeInBed: number;
  stages: {
    deep: number;
    light: number;
    rem: number;
    wake: number;
  };
  levels: {
    data: SleepStage[];
  };
}

export interface SpO2Data {
  dateTime: string;
  avg: number;
  min: number;
  max: number;
}

export interface FitbitApiResponse<T> {
  data: T;
  errors?: {
    errorType: string;
    fieldName?: string;
    message: string;
  }[];
  success: boolean;
}
