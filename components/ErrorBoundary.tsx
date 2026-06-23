import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

const C = {
  bg: '#0A0E1A',
  card: '#121829',
  text: '#E5E7EB',
  textMuted: '#8B95B0',
  cyan: '#00E5FF',
  red: '#FF4D6A',
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info?.componentStack);
    Sentry.captureException(error, {
      contexts: { react: { componentStack: info?.componentStack } },
    });
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  handleClearAndReset = async () => {
    try { await AsyncStorage.clear(); } catch {}
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={s.container}>
        <ScrollView contentContainerStyle={s.content}>
          <Text style={s.title} accessibilityRole="header">Something went wrong</Text>
          <Text style={s.body}>
            Poly-Puff hit an unexpected error. Your saved progress is still safe on this device.
          </Text>

          <TouchableOpacity style={s.primaryBtn} onPress={this.handleReset} accessibilityRole="button">
            <Text style={s.primaryBtnText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.secondaryBtn} onPress={this.handleClearAndReset} accessibilityRole="button">
            <Text style={s.secondaryBtnText}>Reset App Data</Text>
          </TouchableOpacity>

          <Text style={s.detailsTitle}>Details</Text>
          <Text style={s.details}>{this.state.error?.message ?? 'Unknown error'}</Text>
        </ScrollView>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 24, paddingTop: 80 },
  title: { fontSize: 22, fontWeight: '700', color: C.text, marginBottom: 12 },
  body: { fontSize: 15, color: C.textMuted, lineHeight: 22, marginBottom: 24 },
  primaryBtn: {
    backgroundColor: C.cyan, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', marginBottom: 12,
  },
  primaryBtnText: { color: '#0A0E1A', fontWeight: '700', fontSize: 16 },
  secondaryBtn: {
    backgroundColor: C.card, paddingVertical: 14, borderRadius: 12,
    alignItems: 'center', borderWidth: 1, borderColor: C.red + '40',
  },
  secondaryBtnText: { color: C.red, fontWeight: '600', fontSize: 15 },
  detailsTitle: { color: C.textMuted, fontSize: 12, marginTop: 32, marginBottom: 6, textTransform: 'uppercase' },
  details: { color: C.textMuted, fontSize: 12, fontFamily: 'monospace' },
});
