# Fatbit

Personal Fitbit replacement dashboard for Android. Built because Google is shutting down the Fitbit app and Web API in September 2026.

Pulls health data from the Fitbit Web API, body composition from a Renpho scale (via Google Fit), and provides local calorie/meal tracking. Designed for a single user on a Pixel 10 Pro.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Expo SDK 56 (managed workflow) with expo-router |
| Language | TypeScript (strict) |
| Auth | expo-auth-session (Fitbit OAuth2 + Google OAuth2, both PKCE) |
| Charts | Victory Native XL + @shopify/react-native-skia |
| Local DB | expo-sqlite + Drizzle ORM |
| State | Zustand |
| UI | React Native core components, dark theme, no UI library |

## Screens

- **Dashboard** — Grid of metric cards: steps, resting HR, sleep, active zone minutes, weight, calories
- **Heart Rate** — Intraday line chart, HR zones breakdown, 30-day resting HR trend
- **Sleep** — Last night's stages (deep/light/REM/awake), duration, efficiency, 7-day trend
- **Body** — Weight and body fat % trends from Renpho via Google Fit, BMI, muscle mass
- **Calories** — Meal log with add/delete, daily total vs goal, weekly bar chart
- **Login** — Connect Fitbit and Google Fit accounts via OAuth

## Project Structure

```
src/
  app/                        # expo-router file-based routes
    (tabs)/
      _layout.tsx              # Tab navigator (5 tabs)
      index.tsx                # Dashboard
      heart-rate.tsx           # Heart rate detail
      sleep.tsx                # Sleep detail
      body.tsx                 # Body composition
      calories.tsx             # Meal/calorie tracker
    _layout.tsx                # Root stack layout
    login.tsx                  # OAuth connect screen
  api/
    fitbit.ts                  # Fitbit API client (typed, auto-refresh on 401)
    google-fit.ts              # Google Fit API client (body composition)
  auth/
    fitbit-auth.ts             # Fitbit OAuth2 + PKCE flow
    google-auth.ts             # Google OAuth2 + PKCE flow
  db/
    schema.ts                  # Drizzle ORM table definitions (8 tables)
    client.ts                  # SQLite connection + table init
  stores/
    auth-store.ts              # Auth token state (Zustand)
    health-store.ts            # Health data state (Zustand)
  components/
    charts/                    # Victory Native XL chart components
      HeartRateChart.tsx
      StepsChart.tsx
      SleepChart.tsx
      WeightChart.tsx
      CalorieChart.tsx
    DailyMetricCard.tsx        # Reusable metric card for dashboard
    MealEntry.tsx              # Meal input form
  types/
    fitbit.ts                  # Fitbit API response types
    google-fit.ts              # Google Fit response types
  utils/
    constants.ts               # API URLs, OAuth scopes, colors, goals
    date.ts                    # Date formatting helpers
```

## Database Schema

| Table | Purpose |
|-------|---------|
| `heart_rate_daily` | Daily resting HR + zone summaries |
| `heart_rate_intraday` | Per-minute HR readings |
| `steps_daily` | Daily steps, distance, floors |
| `sleep_daily` | Nightly duration, efficiency, stage breakdown |
| `spo2_daily` | Blood oxygen (avg/min/max) |
| `body_composition` | Weight, BMI, body fat %, muscle mass |
| `meals` | Manual meal log (name, calories, notes) |
| `sync_log` | Last sync timestamp per data type |

## Prerequisites

- Node.js 22.13+
- Expo CLI (`npx expo`)
- Android device or emulator (API 24+)
- [Fitbit developer account](https://dev.fitbit.com/) — register an app to get a client ID
- [Google Cloud project](https://console.cloud.google.com/) — enable Fitness API, create OAuth client ID

## Setup

```bash
git clone git@github.com:unreal-user/fatbit.git
cd fatbit
npm install
```

### Configure OAuth Client IDs

Set your client IDs in the auth files:

- **Fitbit**: `src/auth/fitbit-auth.ts` — replace `YOUR_FITBIT_CLIENT_ID`
- **Google**: `src/auth/google-auth.ts` — replace `YOUR_GOOGLE_CLIENT_ID`

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go on your Android device or press `a` to open in an emulator.

### Build for Production

```bash
npx expo export --platform android
```

## Fitbit API Endpoints Used

| Endpoint | Data |
|----------|------|
| `/1/user/-/activities/date/{date}.json` | Daily activity summary |
| `/1/user/-/activities/heart/date/{date}/1d/1min.json` | Intraday heart rate |
| `/1.2/user/-/sleep/date/{date}.json` | Sleep with stages |
| `/1/user/-/spo2/date/{date}.json` | SpO2 |
| `/1/user/-/profile.json` | User profile |
| `/1/user/-/devices.json` | Device info + last sync |
| `/1/user/-/activities/heart/date/{date}/1m.json` | HR time series |
| `/1/user/-/activities/steps/date/{date}/1m.json` | Steps time series |

## Status

This is an initial scaffold. The app structure, auth flows, database schema, API clients, and all screens are in place. Charts render with placeholder/empty states until connected to real data via OAuth.
