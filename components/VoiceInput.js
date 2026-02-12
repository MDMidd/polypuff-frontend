/**
 * VoiceInput Component - Poly-Puff v6.2
 * =================================================
 * 
 * Microphone button for speech-to-text.
 * 
 * IMPORTANT: Voice input requires a DEVELOPMENT BUILD.
 * It does NOT work in Expo Go because expo-speech-recognition
 * needs native code that isn't included in Expo Go.
 * 
 * To enable voice input:
 *   npx expo install expo-speech-recognition
 *   eas build --profile development --platform android
 *   (then install the .apk on your phone)
 * 
 * In Expo Go, tapping the mic will show a helpful message.
 * 
 * FILE: components/VoiceInput.js
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Mic, MicOff } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { hapticMedium } from '../services/sounds';

// Try to load speech recognition — will be null in Expo Go
let SpeechModule = null;
let useSpeechEvent = null;
try {
  const mod = require('expo-speech-recognition');
  SpeechModule = mod.ExpoSpeechRecognitionModule || mod;
  useSpeechEvent = mod.useSpeechRecognitionEvent;
} catch (e) {
  // Not available — expected in Expo Go
}

export default function VoiceInput({ onTranscript, disabled = false }) {
  const { colors: C } = useTheme();
  const [isListening, setIsListening] = useState(false);

  // Register events if available
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
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {isListening ? (
        <MicOff size={20} color={C.red} />
      ) : (
        <Mic size={20} color={C.blue} />
      )}
    </TouchableOpacity>
  );
}
