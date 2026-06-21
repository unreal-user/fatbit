@AGENTS.md

# Fatbit — Project Guide

Single-user Android Fitbit replacement dashboard. Expo SDK 56, managed workflow, TypeScript strict.

## Quick Commands

- `npx expo start` — start dev server
- `npx expo export --platform android` — production bundle
- `npx tsc --noEmit` — type check

## Architecture

- **Routing**: expo-router with file-based routes in `src/app/`. Tab navigator at `src/app/(tabs)/`.
- **State**: Zustand stores in `src/stores/`. `auth-store` for tokens, `health-store` for all health data + meals.
- **Database**: expo-sqlite with Drizzle ORM. Schema in `src/db/schema.ts`, connection in `src/db/client.ts`. Tables created via `initDatabase()` on app launch.
- **Auth**: OAuth2 + PKCE via expo-auth-session. Tokens stored in expo-secure-store. Auto-refresh on 401 in API clients.
- **API clients**: `src/api/fitbit.ts` and `src/api/google-fit.ts`. Both use typed fetch wrappers with automatic token refresh.
- **Charts**: Victory Native XL with `CartesianChart`, `Line`, `Bar` components. Rendered via react-native-skia.
- **Styling**: Dark theme. All colors defined in `src/utils/constants.ts` as `COLORS`. No UI library — plain `StyleSheet.create()`.

## File Layout

| Directory | Contains |
|-----------|----------|
| `src/app/` | expo-router screens and layouts |
| `src/api/` | Fitbit + Google Fit API clients |
| `src/auth/` | OAuth2 config and token exchange |
| `src/db/` | Drizzle schema + SQLite client |
| `src/stores/` | Zustand state stores |
| `src/components/` | Shared UI components |
| `src/components/charts/` | Victory Native XL chart wrappers |
| `src/types/` | API response TypeScript types |
| `src/utils/` | Constants and date helpers |

## Conventions

- Functional components only. No class components.
- All API response shapes typed in `src/types/`.
- Colors: always use `COLORS.xxx` from constants, never hardcode hex values in components.
- DB operations: use Drizzle ORM query builder, not raw SQL (except `initDatabase`).
- State: read from Zustand stores with selector hooks (`useHealthStore((s) => s.field)`), never pass stores as props.
- No iOS code. Android-only target. Don't add `ios` config to `app.json`.

## Common Tasks

### Add a new screen tab
1. Create `src/app/(tabs)/my-screen.tsx` with a default export component
2. Add a `<Tabs.Screen>` entry in `src/app/(tabs)/_layout.tsx`

### Add a new Fitbit API endpoint
1. Add response types to `src/types/fitbit.ts`
2. Add a function in `src/api/fitbit.ts` using `fitbitFetch<T>()`

### Add a new DB table
1. Define the table in `src/db/schema.ts` using `sqliteTable()`
2. Add the `CREATE TABLE IF NOT EXISTS` SQL to `initDatabase()` in `src/db/client.ts`

### Add a new chart
1. Create a component in `src/components/charts/` using `CartesianChart` from `victory-native`
2. Use `Line` for time series, `Bar` for daily aggregates
3. Use the appropriate color from `COLORS`
