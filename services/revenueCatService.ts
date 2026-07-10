/**
 * revenueCatService.ts - Google Play Billing for Pro subscriptions (Android).
 *
 * Wraps react-native-purchases (the RevenueCat SDK), which wraps Play
 * Billing. RevenueCat's dashboard is the source of truth for products/
 * offerings; this file never hard-codes prices or product IDs beyond the
 * ENTITLEMENT_ID constant, which must match an entitlement configured there.
 *
 * Identity: Purchases.logIn(email) is called right alongside
 * authSession.storeAuthSession() (same email used everywhere else - /api/me,
 * Paddle, etc.), so RevenueCat's customer record and web_users.email always
 * refer to the same account. Purchases.logOut() is called alongside
 * authSession.clearAuthSession().
 *
 * Server sync: a purchase updates entitlement status in RevenueCat
 * instantly (used here for immediate UI feedback), but the backend's
 * web_users.revenuecat_active only updates when RevenueCat's webhook lands
 * (usually within a few seconds - see POST /api/revenuecat/webhook in
 * server.js). refreshAccountAfterPurchase() gives that a moment then asks
 * the backend to refresh, so isPro-gated server behavior catches up.
 *
 * iOS is intentionally out of scope here - this only initializes on
 * Android. iOS keeps the existing external-browser Paddle checkout in
 * settings.tsx until App Store Connect products + entitlements exist.
 */

import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

export const ENTITLEMENT_ID = 'pro';

let configured = false;

function isSupported(): boolean {
  return Platform.OS === 'android';
}

/** Call once at app startup (see app/_layout.tsx). No-op on iOS/web. */
export function initRevenueCat(): void {
  if (!isSupported() || configured) return;
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  if (!apiKey) {
    console.warn('EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY is not set - Play Billing is disabled.');
    return;
  }
  try {
    Purchases.configure({ apiKey });
    configured = true;
  } catch (e) {
    // Native module not linked (e.g. a build that predates this dependency,
    // or Expo Go) - fail quietly rather than crashing app startup.
    console.warn('RevenueCat configure failed:', e);
  }
}

/** Call right after a successful sign-in (alongside storeAuthSession). */
export async function identifyUser(email: string): Promise<void> {
  if (!isSupported() || !configured || !email) return;
  try {
    await Purchases.logIn(email.toLowerCase());
  } catch (e) {
    console.warn('RevenueCat logIn failed:', e);
  }
}

/** Call on sign-out (alongside clearAuthSession). */
export async function signOutUser(): Promise<void> {
  if (!isSupported() || !configured) return;
  try {
    await Purchases.logOut();
  } catch (e) {
    console.warn('RevenueCat logOut failed:', e);
  }
}

/** Whether the current RevenueCat customer has the "pro" entitlement, right now. */
export async function hasActiveEntitlement(): Promise<boolean> {
  if (!isSupported() || !configured) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return !!info.entitlements.active[ENTITLEMENT_ID];
  } catch (e) {
    console.warn('RevenueCat getCustomerInfo failed:', e);
    return false;
  }
}

/**
 * Fetch the current offering's packages for the paywall screen.
 * Returns [] if Play Billing isn't available or nothing is configured yet
 * in the RevenueCat dashboard (e.g. no products linked to an offering).
 */
export async function getPackages(): Promise<PurchasesPackage[]> {
  if (!isSupported() || !configured) return [];
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages || [];
  } catch (e) {
    console.warn('RevenueCat getOfferings failed:', e);
    return [];
  }
}

export type PurchaseResult = { success: boolean; isPro: boolean; cancelled?: boolean; error?: string };

/** Trigger the native Play Billing purchase sheet for a package. */
export async function purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
  if (!isSupported() || !configured) {
    return { success: false, isPro: false, error: 'Play Billing is not available.' };
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: true, isPro: !!customerInfo.entitlements.active[ENTITLEMENT_ID] };
  } catch (e: any) {
    if (e?.userCancelled) return { success: false, isPro: false, cancelled: true };
    console.warn('RevenueCat purchasePackage failed:', e);
    return { success: false, isPro: false, error: e?.message || 'Purchase failed.' };
  }
}

/** "Restore Purchases" - required by Play Store review guidelines. */
export async function restorePurchases(): Promise<PurchaseResult> {
  if (!isSupported() || !configured) {
    return { success: false, isPro: false, error: 'Play Billing is not available.' };
  }
  try {
    const customerInfo: CustomerInfo = await Purchases.restorePurchases();
    return { success: true, isPro: !!customerInfo.entitlements.active[ENTITLEMENT_ID] };
  } catch (e: any) {
    console.warn('RevenueCat restorePurchases failed:', e);
    return { success: false, isPro: false, error: e?.message || 'Restore failed.' };
  }
}

/**
 * Whether Play Billing is actually ready to use right now - the platform
 * supports it AND initRevenueCat() successfully configured the SDK (API key
 * present, native module linked). Use this (not isPlayBillingSupported) to
 * gate any UI that lets the user attempt a purchase, so an unconfigured
 * build shows no upgrade path instead of one that silently fails.
 */
function isConfigured(): boolean {
  return isSupported() && configured;
}

export { isSupported as isPlayBillingSupported, isConfigured as isPlayBillingConfigured };
