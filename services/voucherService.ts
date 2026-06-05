/**
 * voucherService.ts
 * =================
 * Handles voucher redemption and premium status via AsyncStorage.
 *
 * FILE LOCATION: services/voucherService.ts
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { getServerUrl } from './api';
const STORAGE_KEY_VOUCHER  = 'voucherCode';
const STORAGE_KEY_PREMIUM  = 'premiumUnlocked';
const STORAGE_KEY_DEVICE   = 'deviceId';

// ── Get or create a stable device ID ─────────────────────────────────────────
// We use expo-application's androidId / iOS identifierForVendor if available,
// falling back to a randomly generated UUID stored in AsyncStorage.
export async function getDeviceId(): Promise<string> {
  try {
    // Try native device ID first (most stable)
    const nativeId = Application.androidId || Application.getIosIdForVendorAsync?.();
    if (nativeId && typeof nativeId === 'string' && nativeId.length > 4) {
      return nativeId;
    }
  } catch (_) {}

  // Fall back to stored UUID
  let stored = await AsyncStorage.getItem(STORAGE_KEY_DEVICE);
  if (!stored) {
    // Simple UUID-ish generator (no dependency on uuid package)
    stored = 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
    await AsyncStorage.setItem(STORAGE_KEY_DEVICE, stored);
  }
  return stored;
}

// ── Redeem a voucher code ─────────────────────────────────────────────────────
export async function redeemVoucher(
  code: string
): Promise<{ success: boolean; message: string }> {
  try {
    const deviceId = await getDeviceId();
    const BASE = await getServerUrl();
    const response = await fetch(`${BASE}/api/vouchers/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.trim().toUpperCase(), deviceId }),
    });
    const data = await response.json();

    if (data.success) {
      // Persist locally so the app knows premium is unlocked
      await AsyncStorage.setItem(STORAGE_KEY_PREMIUM, 'true');
      await AsyncStorage.setItem(STORAGE_KEY_VOUCHER, code.trim().toUpperCase());
    }

    return { success: data.success, message: data.message };
  } catch (err) {
    return { success: false, message: 'Could not connect to the server. Please check your internet connection.' };
  }
}

// ── Check if this device has premium unlocked ─────────────────────────────────
export async function isPremiumUnlocked(): Promise<boolean> {
  const val = await AsyncStorage.getItem(STORAGE_KEY_PREMIUM);
  return val === 'true';
}

// ── Get the redeemed voucher code (for display) ───────────────────────────────
export async function getRedeemedCode(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY_VOUCHER);
}

// ── Clear premium (for testing) ───────────────────────────────────────────────
export async function clearPremium(): Promise<void> {
  await AsyncStorage.multiRemove([STORAGE_KEY_PREMIUM, STORAGE_KEY_VOUCHER]);
}
