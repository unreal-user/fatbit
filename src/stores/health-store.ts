import { create } from 'zustand';
import type { DailyActivitySummary, HeartRateData, SleepData, SpO2Data } from '../types/fitbit';
import type { BodyCompositionData } from '../types/google-fit';

interface Meal {
  id: number;
  date: string;
  name: string;
  calories: number;
  notes: string | null;
  createdAt: string;
}

interface HealthState {
  // Today's data
  todayActivity: DailyActivitySummary | null;
  todayHeartRate: HeartRateData | null;
  todaySleep: SleepData | null;
  todaySpO2: SpO2Data | null;
  latestWeight: BodyCompositionData | null;
  todayMeals: Meal[];
  todayCalories: number;

  // Time series
  heartRateTrend: Array<{ dateTime: string; restingHeartRate?: number }>;
  stepsTrend: Array<{ dateTime: string; value: number }>;
  bodyCompTrend: BodyCompositionData[];

  // Loading states
  isSyncing: boolean;
  lastSyncTime: string | null;

  // Actions
  setTodayActivity: (data: DailyActivitySummary) => void;
  setTodayHeartRate: (data: HeartRateData) => void;
  setTodaySleep: (data: SleepData | null) => void;
  setTodaySpO2: (data: SpO2Data | null) => void;
  setLatestWeight: (data: BodyCompositionData | null) => void;
  setTodayMeals: (meals: Meal[]) => void;
  addMeal: (meal: Meal) => void;
  removeMeal: (id: number) => void;
  setHeartRateTrend: (data: Array<{ dateTime: string; restingHeartRate?: number }>) => void;
  setStepsTrend: (data: Array<{ dateTime: string; value: number }>) => void;
  setBodyCompTrend: (data: BodyCompositionData[]) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncTime: (time: string) => void;
}

export const useHealthStore = create<HealthState>((set) => ({
  todayActivity: null,
  todayHeartRate: null,
  todaySleep: null,
  todaySpO2: null,
  latestWeight: null,
  todayMeals: [],
  todayCalories: 0,
  heartRateTrend: [],
  stepsTrend: [],
  bodyCompTrend: [],
  isSyncing: false,
  lastSyncTime: null,

  setTodayActivity: (data) => set({ todayActivity: data }),
  setTodayHeartRate: (data) => set({ todayHeartRate: data }),
  setTodaySleep: (data) => set({ todaySleep: data }),
  setTodaySpO2: (data) => set({ todaySpO2: data }),
  setLatestWeight: (data) => set({ latestWeight: data }),
  setTodayMeals: (meals) =>
    set({
      todayMeals: meals,
      todayCalories: meals.reduce((sum, m) => sum + m.calories, 0),
    }),
  addMeal: (meal) =>
    set((state) => {
      const meals = [...state.todayMeals, meal];
      return { todayMeals: meals, todayCalories: meals.reduce((sum, m) => sum + m.calories, 0) };
    }),
  removeMeal: (id) =>
    set((state) => {
      const meals = state.todayMeals.filter((m) => m.id !== id);
      return { todayMeals: meals, todayCalories: meals.reduce((sum, m) => sum + m.calories, 0) };
    }),
  setHeartRateTrend: (data) => set({ heartRateTrend: data }),
  setStepsTrend: (data) => set({ stepsTrend: data }),
  setBodyCompTrend: (data) => set({ bodyCompTrend: data }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSyncTime: (time) => set({ lastSyncTime: time }),
}));
