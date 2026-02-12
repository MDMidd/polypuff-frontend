/**
 * Root Layout - Poly-Puff v2.0
 * ==============================
 * 
 * Navigation: Welcome → (tabs) with drawer overlay
 * Bottom Tabs: Profile, Practice, Progress (3 primary)
 * Hidden tabs for sub-screens: listening, writing, quiz, vocab, challenges, classroom, lessons, settings, placement
 * Drawer: Help, Login/Logout, Settings (accessible via hamburger)
 * 
 * FILE: app/_layout.tsx
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, TouchableOpacity, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User, BookOpen, BarChart3, Settings, HelpCircle, LogOut,
  Menu, X, PenTool, Headphones, Brain, Layers, Zap,
  Users, GraduationCap, ClipboardCheck,
} from 'lucide-react-native';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import Onboarding from '../components/Onboarding';

// ═══ CONTEXTS ═══
export const ExerciseContext = createContext({ inExercise: false, setInExercise: () => {} });
export const useExercise = () => useContext(ExerciseContext);

export const MascotContext = createContext({ mascotEnabled: true, setMascotEnabled: () => {} });
export const useMascot = () => useContext(MascotContext);

// ═══ DRAWER MENU ═══
function DrawerMenu({ visible, onClose }) {
  const { colors: C } = useTheme();
  if (!visible) return null;

  const items = [
    { icon: HelpCircle, label: 'Help & Tutorial', action: () => { onClose(); Alert.alert('Help', 'Visit our FAQ at polypuff.app/help or tap the mascot on any screen for guidance!'); } },
    { icon: Settings, label: 'Settings', action: () => { onClose(); /* Will navigate via router */ } },
    { icon: LogOut, label: 'Log Out', action: () => { onClose(); Alert.alert('Log Out', 'Login system coming soon!'); } },
  ];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} activeOpacity={1} onPress={onClose}>
        <View style={{ width: 280, flex: 1, backgroundColor: C.card, paddingTop: 60, paddingHorizontal: 20,
          borderTopRightRadius: 24, borderBottomRightRadius: 24,
          shadowColor: C.cyan || '#00E5FF', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: C.cyan || '#00E5FF' }}>POLY-PUFF</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={C.textMuted} /></TouchableOpacity>
          </View>
          {items.map((item, i) => (
            <TouchableOpacity key={i} onPress={item.action}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border + '20' }}>
              <item.icon size={22} color={C.textSec} />
              <Text style={{ fontSize: 16, fontWeight: '500', color: C.text }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ═══ TAB LAYOUT ═══
function TabsLayout() {
  const { colors: C } = useTheme();
  const { inExercise } = useExercise();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Hamburger button — top left overlay */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 14, left: 16, zIndex: 100, width: 36, height: 36, borderRadius: 10,
          backgroundColor: (C.card || '#121829') + 'CC', alignItems: 'center', justifyContent: 'center',
          borderWidth: 1, borderColor: (C.cyan || '#00E5FF') + '20' }}
        onPress={() => setDrawerOpen(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Menu size={18} color={C.textMuted} />
      </TouchableOpacity>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: C.tabBar, borderTopColor: C.tabBorder, borderTopWidth: 1,
            height: 82, paddingBottom: 22, paddingTop: 6,
          },
          tabBarActiveTintColor: C.cyan || '#00E5FF',
          tabBarInactiveTintColor: C.textMuted,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        }}
        screenListeners={{
          tabPress: (e) => {
            if (inExercise) {
              e.preventDefault();
              Alert.alert('⏸️ Exercise in Progress', 'You have an exercise in progress. Leave?',
                [{ text: 'Stay', style: 'cancel' }, { text: 'Leave', style: 'destructive' }]);
            }
          },
        }}
      >
        {/* 3 PRIMARY TABS */}
        <Tabs.Screen name="index" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <User size={size - 4} color={color} /> }} />
        <Tabs.Screen name="practice" options={{ title: 'Practice', tabBarIcon: ({ color, size }) => <BookOpen size={size - 4} color={color} /> }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ color, size }) => <BarChart3 size={size - 4} color={color} /> }} />

        {/* HIDDEN — accessible via navigation */}
        <Tabs.Screen name="listening" options={{ href: null }} />
        <Tabs.Screen name="writing" options={{ href: null }} />
        <Tabs.Screen name="quiz" options={{ href: null }} />
        <Tabs.Screen name="vocab" options={{ href: null }} />
        <Tabs.Screen name="challenges" options={{ href: null }} />
        <Tabs.Screen name="classroom" options={{ href: null }} />
        <Tabs.Screen name="lessons" options={{ href: null }} />
        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="placement" options={{ href: null }} />
        <Tabs.Screen name="translation" options={{ href: null }} />
        <Tabs.Screen name="welcome" options={{ href: null }} />
      </Tabs>
    </>
  );
}

// ═══ MAIN APP ═══
function AppWithOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(null);
  const [inExercise, setInExercise] = useState(false);
  const [mascotEnabled, setMascotEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('onboardingComplete').then(val => {
      setShowOnboarding(val !== 'true');
    }).catch(() => setShowOnboarding(true));

    AsyncStorage.getItem('mascotEnabled').then(val => {
      if (val === 'false') setMascotEnabled(false);
    }).catch(() => {});
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    setShowOnboarding(false);
  };

  const handleSetMascot = async (val) => {
    setMascotEnabled(val);
    await AsyncStorage.setItem('mascotEnabled', String(val));
  };

  if (showOnboarding === null) return null;
  if (showOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <ExerciseContext.Provider value={{ inExercise, setInExercise }}>
      <MascotContext.Provider value={{ mascotEnabled, setMascotEnabled: handleSetMascot }}>
        <TabsLayout />
      </MascotContext.Provider>
    </ExerciseContext.Provider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppWithOnboarding />
    </ThemeProvider>
  );
}
