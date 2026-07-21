import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { NATIVE_LANGUAGE_OPTIONS } from '../utils/nativeLanguages';
import { scaledFont } from '../utils/accessibility';

type Props = {
  visible: boolean;
  selectedLanguage: string;
  onSelect: (language: string) => void;
  onClose: () => void;
  title?: string;
};

export default function NativeLanguagePicker({
  visible,
  selectedLanguage,
  onSelect,
  onClose,
  title,
}: Props) {
  const { colors: C } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t.cancel}
        />
        <View
          style={[
            styles.card,
            {
              backgroundColor: C.card || '#111827',
              borderColor: (C.cyan || '#00E5FF') + '24',
              paddingBottom: 20 + insets.bottom,
            },
          ]}
          accessibilityViewIsModal
        >
          <Text style={[styles.title, { color: C.text || '#F8FAFC' }]} accessibilityRole="header">
            {title || t.settings}
          </Text>
          <Text style={[styles.label, { color: C.textSec || '#A8B3CF' }]} accessibilityRole="header">
            {t.nativeLanguage}
          </Text>
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
            accessibilityRole="tablist"
            accessibilityLabel={t.nativeLanguage}
          >
            {NATIVE_LANGUAGE_OPTIONS.map(option => {
              const selected = selectedLanguage === option.value;
              return (
                <TouchableOpacity
                  key={option.code}
                  style={[
                    styles.option,
                    {
                      backgroundColor: selected ? (C.cyan || '#00E5FF') + '18' : 'rgba(255,255,255,0.055)',
                      borderColor: selected ? (C.cyan || '#00E5FF') + '66' : 'rgba(255,255,255,0.08)',
                    },
                  ]}
                  onPress={() => onSelect(option.value)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${option.englishName}, ${option.nativeName}`}
                >
                  <Text style={styles.flag}>{option.flag}</Text>
                  <View style={styles.nameBlock}>
                    <Text style={[styles.nativeName, { color: C.text || '#F8FAFC' }]} numberOfLines={1}>
                      {option.nativeName}
                    </Text>
                    <Text style={[styles.englishName, { color: C.textMuted || '#94A3B8' }]} numberOfLines={1}>
                      {option.englishName}
                    </Text>
                  </View>
                  {selected ? <Check size={18} color={C.cyan || '#00E5FF'} /> : null}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: C.emerald || '#00E5A0' }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t.save}
          >
            <Text style={styles.doneText}>{t.save}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.58)',
  },
  card: {
    maxHeight: '82%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },
  title: {
    fontSize: scaledFont(25),
    fontWeight: '900',
    marginBottom: 18,
  },
  label: {
    fontSize: scaledFont(15),
    fontWeight: '800',
    marginBottom: 12,
  },
  list: {
    maxHeight: 440,
  },
  listContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 16,
  },
  option: {
    width: '48%',
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  flag: {
    fontSize: scaledFont(20),
    width: 28,
    textAlign: 'center',
  },
  nameBlock: {
    flex: 1,
    minWidth: 0,
  },
  nativeName: {
    fontSize: scaledFont(13),
    fontWeight: '800',
  },
  englishName: {
    fontSize: scaledFont(11),
    fontWeight: '600',
    marginTop: 2,
  },
  doneButton: {
    minHeight: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  doneText: {
    color: '#00130D',
    fontSize: scaledFont(17),
    fontWeight: '900',
  },
});
