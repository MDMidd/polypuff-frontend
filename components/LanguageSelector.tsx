import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Check, ChevronDown, Globe2, X } from 'lucide-react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import type { LangCode } from '../contexts/translations';
import { scaledFont } from '../utils/accessibility';
import { LANGUAGE_OPTIONS, formatLanguageName, isRtlLanguage } from '../utils/languages';

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function LanguageSelector({ style }: Props) {
  const { colors: C } = useTheme();
  const { lang, setLang, wt } = useLanguage();
  const [open, setOpen] = useState(false);
  const isRTL = isRtlLanguage(lang);

  const currentLanguage = useMemo(
    () => LANGUAGE_OPTIONS.find(option => option.code === lang) ?? LANGUAGE_OPTIONS[0],
    [lang],
  );

  const chooseLanguage = async (code: LangCode) => {
    await setLang(code);
    setOpen(false);
  };

  const panelBackground = C.card || '#101827';
  const borderColor = C.border || '#26324A';
  const activeColor = C.cyan || '#00E5FF';
  const title = wt('website-language');
  const titleText = title && title !== 'website-language' ? title : 'Language';
  const currentName = formatLanguageName(currentLanguage);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          isRTL && styles.rowReverse,
          { borderColor: activeColor + '55', backgroundColor: panelBackground + 'E6' },
          style,
        ]}
        activeOpacity={0.78}
        accessibilityRole="button"
        accessibilityLabel={`${titleText}: ${currentName}`}
        onPress={() => setOpen(true)}
      >
        <Globe2 size={14} color={activeColor} />
        <Text style={styles.triggerFlag}>{currentLanguage.flag}</Text>
        <Text style={[styles.triggerText, { color: C.text || '#F8FAFC' }]} numberOfLines={1}>
          {currentLanguage.code.toUpperCase()}
        </Text>
        <ChevronDown size={12} color={C.textMuted || '#9CA3AF'} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.panel, { backgroundColor: panelBackground, borderColor }]}
            onPress={() => {}}
          >
            <View style={[styles.panelHeader, isRTL && styles.rowReverse]}>
              <View style={styles.panelTitleWrap}>
                <Text style={[styles.panelTitle, isRTL && styles.textRight, { color: C.text || '#F8FAFC' }]}>
                  {titleText}
                </Text>
                <Text style={[styles.panelSubtitle, isRTL && styles.textRight, { color: C.textMuted || '#9CA3AF' }]}>
                  {currentName}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.closeButton, { borderColor }]}
                activeOpacity={0.74}
                accessibilityRole="button"
                accessibilityLabel={wt('close') === 'close' ? 'Close' : wt('close')}
                onPress={() => setOpen(false)}
              >
                <X size={18} color={C.text || '#F8FAFC'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
              {LANGUAGE_OPTIONS.map(option => {
                const selected = option.code === lang;

                return (
                  <TouchableOpacity
                    key={option.code}
                    style={[
                      styles.option,
                      {
                        borderColor: selected ? activeColor + '88' : borderColor + '88',
                        backgroundColor: selected ? activeColor + '18' : 'transparent',
                      },
                    ]}
                    activeOpacity={0.72}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={formatLanguageName(option)}
                    onPress={() => chooseLanguage(option.code)}
                  >
                    <View style={[styles.optionInner, isRTL && styles.rowReverse]}>
                      <Text style={styles.optionFlag}>{option.flag}</Text>
                      <View style={styles.optionTextWrap}>
                        <Text style={[styles.optionLabel, isRTL && styles.textRight, { color: C.text || '#F8FAFC' }]} numberOfLines={1}>
                          {formatLanguageName(option)}
                        </Text>
                        <Text style={[styles.optionCode, isRTL && styles.textRight, { color: C.textMuted || '#9CA3AF' }]}>
                          {option.code.toUpperCase()}
                        </Text>
                      </View>
                      {selected && <Check size={18} color={activeColor} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
  trigger: {
    minWidth: 64,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  triggerText: {
    fontSize: scaledFont(12),
    fontWeight: '900',
  },
  triggerFlag: {
    fontSize: scaledFont(15),
    lineHeight: scaledFont(18),
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',
  },
  panel: {
    width: '100%',
    maxHeight: '78%',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  panelHeader: {
    minHeight: 68,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  panelTitleWrap: {
    flex: 1,
    minWidth: 0,
  },
  panelTitle: {
    fontSize: scaledFont(18),
    fontWeight: '900',
  },
  panelSubtitle: {
    marginTop: 2,
    fontSize: scaledFont(12),
    fontWeight: '700',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 14,
    gap: 6,
  },
  option: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  optionInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  optionFlag: {
    width: 28,
    fontSize: scaledFont(22),
    textAlign: 'center',
  },
  optionLabel: {
    fontSize: scaledFont(14),
    fontWeight: '800',
  },
  optionCode: {
    marginTop: 1,
    fontSize: scaledFont(10),
    fontWeight: '900',
  },
});
