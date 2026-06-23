# Poly-Puff — Frontend

## Project Overview
React Native / Expo app for ESL students. AI-powered translation trainer
and language exercises. Android-first, dark mode only.

## Tech Stack
- React Native with Expo (Expo Router for navigation)
- TypeScript / JavaScript
- expo-speech (TTS), expo-haptics, AsyncStorage
- expo-notifications

## File Structure
- app/ — Expo Router screens
- components/ — Reusable UI components
- utils/ — Helpers (auth.ts, accessibility.ts)
- services/ — API calls (api.js, ruleStats.ts)

## Key Rules
- NEVER remove dark mode. Light theme was intentionally removed.
- Use useFocusEffect (not useEffect) for screen-level data reloading.
- All font sizes must use scaledFont() from utils/accessibility.ts
- WCAG 2.2 Level AA accessibility required on all screens.
- Android package name is com.polypuff.app — do not change.

## Backend
Live URL: https://polypuff-backend-production-bec9.up.railway.app
All API calls go through services/api.js

## Deployment
EAS Build for Android APK. Never run eas build without asking me first.

## Auth
- utils/auth.ts returns `Authorization: Bearer <pp_token>` — the JWT
  issued by `/api/auth/login` and stored in AsyncStorage by
  authSession.storeAuthSession.
- The legacy HMAC scheme (APP_SECRET in the APK) was removed before
  the Play Store launch. Do NOT re-introduce a client-side shared
  secret — any new auth lives server-side.

## Do Not Touch
- app.json android.package value
- LegalGateController.tsx age gate thresholds