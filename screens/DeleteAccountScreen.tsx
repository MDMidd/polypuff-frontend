/**
 * DeleteAccountScreen.tsx
 * ──────────────────────────────────────────────────────────────────
 * Poly-Puff — Account Deletion (Google Play Mandatory)
 *
 * Google Play requires:
 *   1. An in-app "Delete Account" button in Settings
 *   2. A standalone web URL for the Data Safety section
 *
 * This screen handles #1. The web template (delete-account.html)
 * handles #2 and should be hosted at https://polypuff.app/delete-account
 *
 * On deletion, this wipes:
 *   • All AsyncStorage keys (local data)
 *   • Calls backend DELETE /api/user/delete-account
 *   • Resets the app to the age gate
 *
 * WHERE TO PUT THIS FILE:
 *   translation-trainer-frontend/app/screens/DeleteAccountScreen.tsx
 * ──────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as Crypto from 'expo-crypto';

const API_BASE = 'https://polypuff-backend-production-cd6b.up.railway.app';

// IMPORTANT: This must match the APP_SECRET on your Railway backend.
// In production, fetch this from a secure config — not hardcoded.
// For now, this works for MVP. Replace when you add proper auth.
const APP_SECRET = 'REPLACE_WITH_YOUR_RAILWAY_APP_SECRET';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      Alert.alert('Confirmation Required', 'Please type "DELETE" to confirm.');
      return;
    }

    Alert.alert(
      'Delete Account Permanently?',
      'This action cannot be undone. All your progress, settings, and personal data will be permanently removed from our servers and this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              // 1. Call backend to delete server-side data
              const userId = await AsyncStorage.getItem('userId');
              if (userId) {
                // [C1 FIX] Generate HMAC auth token matching backend
                const token = await Crypto.digestStringAsync(
                  Crypto.CryptoDigestAlgorithm.SHA256,
                  userId + APP_SECRET,
                );

                const response = await fetch(`${API_BASE}/api/user/delete-account`, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({ userId }),
                });

                if (!response.ok) {
                  throw new Error(`Server returned ${response.status}`);
                }
              }

              // 2. Wipe all local data
              await AsyncStorage.clear();

              // 3. Reset to start
              Alert.alert(
                'Account Deleted',
                'All your data has been permanently removed.',
                [{
                  text: 'OK',
                  onPress: () => router.replace('/'),
                }]
              );
            } catch (error) {
              Alert.alert(
                'Deletion Failed',
                'We could not delete your account right now. Please try again or contact mark.david.middleton@gmail.com for manual deletion.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [confirmText, router]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title} accessibilityRole="header">
        Delete Your Account
      </Text>

      <View style={styles.warningCard}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningTitle}>This is permanent</Text>
        <Text style={styles.warningText}>
          Deleting your account will permanently remove:
        </Text>
        <Text style={styles.warningItem}>• All translation practice history</Text>
        <Text style={styles.warningItem}>• Grammar progress and scores</Text>
        <Text style={styles.warningItem}>• Account profile and preferences</Text>
        <Text style={styles.warningItem}>• All data stored on our servers</Text>
      </View>

      <Text style={styles.label}>Type DELETE to confirm:</Text>
      <TextInput
        style={styles.input}
        value={confirmText}
        onChangeText={setConfirmText}
        placeholder="DELETE"
        placeholderTextColor="#475569"
        autoCapitalize="characters"
        accessibilityLabel="Type DELETE to confirm account deletion"
      />

      <TouchableOpacity
        style={[
          styles.deleteButton,
          confirmText.toLowerCase() !== 'delete' && styles.disabledButton,
        ]}
        onPress={handleDelete}
        disabled={loading || confirmText.toLowerCase() !== 'delete'}
        accessibilityRole="button"
        accessibilityLabel="Permanently delete account"
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.deleteButtonText}>Delete My Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Cancel and go back"
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        You can also request deletion at:{'\n'}
        https://polypuff.app/delete-account{'\n'}
        or email: mark.david.middleton@gmail.com
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: '700', color: '#F1F5F9', marginBottom: 20 },
  warningCard: {
    backgroundColor: '#2D1B1B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#7F1D1D',
    marginBottom: 24,
  },
  warningIcon: { fontSize: 32, marginBottom: 8 },
  warningTitle: { fontSize: 18, fontWeight: '700', color: '#FCA5A5', marginBottom: 8 },
  warningText: { fontSize: 14, color: '#FDA4AF', marginBottom: 8 },
  warningItem: { fontSize: 13, color: '#FCA5A5', marginBottom: 4, paddingLeft: 4 },
  label: { fontSize: 14, color: '#94A3B8', marginBottom: 8 },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F1F5F9',
    fontSize: 18,
    padding: 14,
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: { opacity: 0.4 },
  deleteButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  cancelButton: { padding: 14, alignItems: 'center' },
  cancelText: { color: '#7DD3FC', fontSize: 15, fontWeight: '600' },
  footerNote: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});
