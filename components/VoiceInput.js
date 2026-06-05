/**
 * VoiceInput Component (Accessibility Update)
 *
 * CHANGES:
 *   - accessibilityRole="button" + dynamic label based on recording state
 *   - accessibilityState for disabled + busy
 *   - Minimum 46×46 touch target (already OK)
 *   - opacity 0.6 when disabled (was 0.4)
 *
 * FILE: components/VoiceInput.js
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { hapticMedium } from '../services/sounds';

let SpeechModule = null;
let useSpeechEvent = null;
try {
  const mod = require('expo-speech-recognition');
  SpeechModule = mod.ExpoSpeechRecognitionModule || mod;
  useSpeechEvent = mod.useSpeechRecognitionEvent;
} catch (e) {}

export default function VoiceInput({ onTranscript, disabled = false }) {
  const { colors: C } = useTheme();
  const [isListening, setIsListening] = useState(false);

  if (useSpeechEvent && SpeechModule) {
    try {
      useSpeechEvent('result', (event) => {
        const text = event.results?.[0]?.transcript;
        if (text && onTranscript) onTranscript(text);
      });
      useSpeechEvent('end', () => setIsListening(false));
      useSpeechEvent('error', () => setIsListening(false));
    } catch (e) {}
  }

  const handlePress = async () => {
    if (!SpeechModule) {
      Alert.alert(
        '🎤 Voice Input',
        'Voice input is not available in Expo Go.\n\n' +
        'To enable it, create a development build:\n\n' +
        '1. npx expo install expo-speech-recognition\n' +
        '2. eas build --profile development\n' +
        '3. Install the built app on your phone\n\n' +
        'For now, please type your translation.',
        [{ text: 'OK' }]
      );
      return;
    }

    hapticMedium();

    if (isListening) {
      try { await SpeechModule.stop?.(); } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      const perms = await SpeechModule.requestPermissionsAsync?.();
      if (perms && !perms.granted) {
        Alert.alert('Permission Needed', 'Please allow microphone access for voice input.');
        return;
      }
      setIsListening(true);
      await SpeechModule.start?.({ lang: 'en-US', interimResults: false, maxAlternatives: 1 });
    } catch (error) {
      setIsListening(false);
      Alert.alert('Error', 'Could not start voice input.');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      style={{
        width: 46, height: 46, borderRadius: 23,
        backgroundColor: isListening ? C.red + '20' : C.blue + '15',
        borderWidth: 2,
        borderColor: isListening ? C.red : C.blue + '40',
        alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.6 : 1, // ✅ was 0.4 → 0.6
      }}
      // ✅ ACCESSIBILITY
      accessibilityRole="button"
      accessibilityLabel={
        isListening ? 'Stop voice recording' :
        disabled ? 'Voice input unavailable' :
        'Start voice input'
      }
      accessibilityHint={
        isListening ? 'Double tap to stop recording' :
        'Double tap to speak your translation instead of typing'
      }
      accessibilityState={{ disabled, busy: isListening }}
    >
      {isListening ? (
        <MicOff size={20} color={C.red} />
      ) : (
        <Mic size={20} color={C.blue} />
      )}
    </TouchableOpacity>
  );
}
