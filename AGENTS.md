# Agent Guidelines

## Expo SDK 56

Expo has changed significantly. Read the exact versioned docs before writing any code:
- Expo SDK 56: https://docs.expo.dev/versions/v56.0.0/
- expo-router: https://docs.expo.dev/router/introduction/
- expo-auth-session: https://docs.expo.dev/versions/v56.0.0/sdk/auth-session/
- expo-sqlite: https://docs.expo.dev/versions/v56.0.0/sdk/sqlite/
- expo-secure-store: https://docs.expo.dev/versions/v56.0.0/sdk/securestore/

## Library Docs

- Victory Native XL (not classic Victory): https://commerce.nearform.com/open-source/victory-native/
  - Uses `CartesianChart` with `xKey`/`yKeys` props and child render functions
  - NOT the same API as `victory` or `victory-native` v36 and earlier
- Drizzle ORM (SQLite): https://orm.drizzle.team/docs/get-started/expo-new
- Zustand: https://zustand.docs.pmnd.rs/getting-started/introduction
- react-native-skia: https://shopify.github.io/react-native-skia/

## Coding Conventions

- TypeScript strict mode. No `any` types unless unavoidable.
- Functional components only. No class components.
- Zustand for all shared state. No React Context, no prop drilling stores.
- Dark theme: all colors via `COLORS` from `src/utils/constants.ts`.
- No UI libraries (no NativeBase, no React Native Paper, no Tamagui). Use `StyleSheet.create()`.
- Android-only. Do not add iOS configuration.
- Drizzle ORM for database queries. Raw SQL only in `initDatabase()`.
- expo-auth-session for all OAuth. No third-party auth libraries.
