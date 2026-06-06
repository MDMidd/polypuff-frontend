import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Archive, Download, Plus, Search, Trash2, Upload } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { BackHeader, ScreenBackground } from './PolyPuffUI';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { scaledFont } from '../utils/accessibility';

type VaultKind = 'wordchunks' | 'grammar';

type LearningVaultItem = {
  id?: string;
  text?: string;
  phrase?: string;
  rule?: string;
  word?: string;
  english?: string;
  native?: string;
  prompt?: string;
  correctAnswer?: string;
  studentAnswer?: string;
  category?: string;
  source?: string;
  score?: number;
  date?: string;
  addedAt?: string;
};

type Config = {
  kind: VaultKind;
  keys: string[];
  titleKey: string;
  titleFallback: string;
  descKey: string;
  descFallback: string;
  emptyFallback: string;
  addPlaceholder: string;
  itemLabel: string;
  category: string;
  accent: 'cyan' | 'emerald' | 'amber' | 'purple';
};

const CONFIG: Record<VaultKind, Config> = {
  wordchunks: {
    kind: 'wordchunks',
    keys: ['pp_word_chunks_vault', 'pp_wordchunks_vault'],
    titleKey: 'word-chunks-vault',
    titleFallback: 'Word Chunks Vault',
    descKey: 'webapp-wordchunks-vault-desc',
    descFallback: 'Review saved chunks, collocations, and phrase patterns from practice.',
    emptyFallback: 'Save English chunks from Word Chunks or add your own phrases here.',
    addPlaceholder: "Add an English chunk, e.g. 'Would you mind if...'",
    itemLabel: 'English chunk',
    category: 'Word Chunk',
    accent: 'cyan',
  },
  grammar: {
    kind: 'grammar',
    keys: ['pp_grammar_vault', 'pp_grammar_practice_vault'],
    titleKey: 'grammar-vault',
    titleFallback: 'Grammar Vault',
    descKey: 'webapp-grammar-vault-desc',
    descFallback: 'Review saved grammar rules, corrections, and mistake patterns.',
    emptyFallback: 'Save rules and mistake corrections from Grammar Practice or add your own notes here.',
    addPlaceholder: "Add a grammar rule, e.g. 'Use present perfect for life experience'",
    itemLabel: 'Grammar item',
    category: 'Grammar Rule',
    accent: 'emerald',
  },
};

function primaryText(item: LearningVaultItem) {
  return String(item.text || item.phrase || item.rule || item.word || item.english || item.correctAnswer || '').trim();
}

function normalizeItem(raw: LearningVaultItem, cfg: Config): LearningVaultItem | null {
  const text = primaryText(raw);
  if (!text) return null;
  return {
    ...raw,
    id: String(raw.id || `${text.toLowerCase()}|${raw.date || raw.addedAt || ''}`),
    text,
    date: raw.date || raw.addedAt || new Date().toISOString(),
    category: raw.category || cfg.category,
    source: raw.source || cfg.kind,
  };
}

function csvEscape(value: unknown) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function displayDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-ZA');
}

export default function LearningVaultScreen({ kind }: { kind: VaultKind }) {
  const cfg = CONFIG[kind];
  const { colors: C } = useTheme();
  const { wt } = useLanguage();
  const [items, setItems] = useState<LearningVaultItem[]>([]);
  const [query, setQuery] = useState('');
  const [newItem, setNewItem] = useState('');

  const accent = C[cfg.accent] || (cfg.kind === 'grammar' ? '#34D399' : '#60A5FA');
  const title = wt(cfg.titleKey) !== cfg.titleKey ? wt(cfg.titleKey) : cfg.titleFallback;
  const desc = wt(cfg.descKey) !== cfg.descKey ? wt(cfg.descKey) : cfg.descFallback;

  const loadItems = useCallback(async () => {
    const byText = new Map<string, LearningVaultItem>();
    for (const key of cfg.keys) {
      try {
        const raw = await AsyncStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) continue;
        parsed.forEach((entry: LearningVaultItem) => {
          const item = normalizeItem(entry, cfg);
          if (item?.text) byText.set(item.text.toLowerCase(), { ...(byText.get(item.text.toLowerCase()) || {}), ...item });
        });
      } catch {}
    }
    setItems([...byText.values()].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()));
  }, [cfg]);

  useFocusEffect(useCallback(() => { loadItems(); }, [loadItems]));

  const writeItems = async (next: LearningVaultItem[]) => {
    const clean = next.slice(0, 500);
    await Promise.all(cfg.keys.map(key => AsyncStorage.setItem(key, JSON.stringify(clean))));
    setItems(clean);
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(item => [
      item.text, item.category, item.native, item.english, item.studentAnswer,
      item.prompt, item.correctAnswer, item.rule,
    ].join(' ').toLowerCase().includes(needle));
  }, [items, query]);

  const addManualItem = async () => {
    const text = newItem.trim();
    if (!text) return;
    if (items.some(item => item.text?.toLowerCase() === text.toLowerCase())) {
      Alert.alert(title, `"${text}" is already in your ${title}.`);
      return;
    }
    const item = normalizeItem({ text, category: cfg.category, source: 'manual' }, cfg);
    if (!item) return;
    await writeItems([item, ...items]);
    setNewItem('');
  };

  const deleteItem = (item: LearningVaultItem) => {
    Alert.alert(title, `Remove "${item.text}" from ${title}?`, [
      { text: wt('vault-cancel'), style: 'cancel' },
      { text: wt('vault-delete'), style: 'destructive', onPress: () => writeItems(items.filter(entry => entry.text !== item.text)) },
    ]);
  };

  const exportCsv = async () => {
    if (!items.length) {
      Alert.alert(title, `Your ${title} is empty.`);
      return;
    }
    const headers = cfg.kind === 'grammar'
      ? ['Item', 'Prompt', 'Correct answer', 'Your answer', 'Rule', 'Score', 'Category', 'Date']
      : ['English chunk', 'Native prompt', 'Your answer', 'Score', 'Category', 'Date'];
    const rows = items.map(item => cfg.kind === 'grammar'
      ? [item.text, item.prompt, item.correctAnswer, item.studentAnswer, item.rule, item.score, item.category, item.date].map(csvEscape).join(',')
      : [item.text, item.native || item.prompt, item.studentAnswer, item.score, item.category, item.date].map(csvEscape).join(','));
    const csv = [headers.map(csvEscape).join(','), ...rows].join('\n');
    const path = `${FileSystem.documentDirectory}Poly-Puff ${title}.csv`;
    await FileSystem.writeAsStringAsync(path, csv, { encoding: 'utf8' });
    await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: `Poly-Puff ${title}` });
  };

  const exportWordChunksPdf = async () => {
    if (!items.length) {
      Alert.alert(title, `Your ${title} is empty.`);
      return;
    }
    const dateFull = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
    const rows = items.map(item => `
      <tr>
        <td class="chunk-cell">${escapeHtml(item.text)}</td>
        <td>${escapeHtml(item.native || item.prompt || '')}</td>
        <td>${escapeHtml(item.category || '')}</td>
        <td>${escapeHtml(displayDate(item.date))}</td>
      </tr>`).join('');
    const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;color:#111827;background:#fff;padding:40px;font-size:12px;-webkit-font-smoothing:antialiased}
body::before{content:'POLY-PUFF';position:fixed;top:45%;left:16%;font-size:72px;font-weight:900;color:#7ee8fa;opacity:.07;transform:rotate(-45deg);white-space:nowrap;z-index:0;pointer-events:none}
.header{text-align:center;border-bottom:2px solid #7ee8fa;padding-bottom:20px;margin-bottom:24px}
.stamp{display:inline-flex;align-items:center;justify-content:center;width:72px;height:72px;border:3px solid #7ee8fa;border-radius:50%;font-size:10px;font-weight:900;color:#0A0E1A;margin-bottom:10px}
.wordmark{font-size:28px;font-weight:900;letter-spacing:.04em;color:#0A0E1A;margin-bottom:10px}
.report-title{font-size:18px;font-weight:700;color:#111827;margin-bottom:8px}
.report-badge{display:inline-block;background:#e7fbff;border:1px solid #7ee8fa;color:#0A0E1A;padding:5px 18px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.05em}
.stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px}
.stat-box{background:#f0fbff;border:1px solid #b9f3ff;border-radius:10px;padding:14px;text-align:center}
.stat-value{font-size:24px;font-weight:800;color:#0A0E1A}.stat-label{font-size:9px;color:#6b7280;margin-top:4px;text-transform:uppercase;letter-spacing:.08em}
.section-title{font-size:13px;font-weight:700;color:#0A0E1A;text-transform:uppercase;letter-spacing:.08em;border-left:4px solid #7ee8fa;padding-left:10px;margin:20px 0 10px}
table{width:100%;border-collapse:collapse;margin-bottom:16px}th{background:#0A0E1A;color:#7ee8fa;padding:8px 10px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.06em}
td{padding:8px 10px;border-bottom:1px solid #e5e7eb;font-size:10px;vertical-align:top;line-height:1.45}tr:nth-child(even) td{background:#f9fafb}
.chunk-cell{font-weight:700;color:#111827}.footer{margin-top:32px;text-align:center;border-top:1px solid #e5e7eb;padding-top:14px;color:#9ca3af;font-size:10px;line-height:1.7}
</style></head><body>
<div class="header">
  <div class="stamp">CERTIFIED<br>POLY-PUFF</div>
  <div class="wordmark">POLY-PUFF</div>
  <div class="report-title">${escapeHtml(title)}</div>
  <div class="report-badge">EXPORTED · ${escapeHtml(dateFull)} · ${items.length} ITEM${items.length === 1 ? '' : 'S'}</div>
</div>
<div class="stats-grid">
  <div class="stat-box"><div class="stat-value">${items.length}</div><div class="stat-label">Saved Word Chunks</div></div>
  <div class="stat-box"><div class="stat-value">${items.filter(item => item.native || item.prompt).length}</div><div class="stat-label">With Source Prompt</div></div>
</div>
<div class="section-title">Word Chunks Collection</div>
<table><tr><th>Word Chunk</th><th>Prompt / Native</th><th>Category</th><th>Date</th></tr>${rows}</table>
<div class="footer"><p>Generated by Poly-Puff ESL Trainer · polypuff.app</p><p>Developed by Mark Middleton, Cape Town, South Africa</p></div>
</body></html>`;
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `Poly-Puff ${title}`,
      UTI: 'com.adobe.pdf',
    });
  };

  const importToVocabularyVault = async () => {
    if (cfg.kind !== 'wordchunks') return;
    if (!items.length) {
      Alert.alert(title, 'Your Word Chunks Vault is empty.');
      return;
    }
    const raw = await AsyncStorage.getItem('vocabVault');
    const vocab = raw ? JSON.parse(raw) : [];
    const byWord = new Map<string, any>();
    if (Array.isArray(vocab)) {
      vocab.forEach(entry => {
        const word = String(entry?.word || '').trim();
        if (word) byWord.set(word.toLowerCase(), entry);
      });
    }
    let added = 0;
    items.forEach(item => {
      const phrase = String(item.text || '').trim();
      if (!phrase || byWord.has(phrase.toLowerCase())) return;
      byWord.set(phrase.toLowerCase(), {
        word: phrase,
        definition: '',
        example: String(item.native || item.prompt || '').trim(),
        meanings: [],
        category: 'Word Chunk',
        source: 'word-chunks-vault',
        addedAt: new Date().toISOString(),
        practiceCount: 0,
      });
      added += 1;
    });
    const merged = [...byWord.values()].sort((a, b) => String(a.word || '').localeCompare(String(b.word || ''), undefined, { sensitivity: 'base' }));
    await AsyncStorage.setItem('vocabVault', JSON.stringify(merged));
    Alert.alert(title, added ? `Imported ${added} item${added === 1 ? '' : 's'} to Vocabulary Vault.` : 'Those word chunks are already in Vocabulary Vault.');
  };

  const renderField = (label: string, value?: string | number) => {
    if (!value) return null;
    return (
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: scaledFont(10), fontWeight: '800', letterSpacing: 0.7, color: C.textMuted }}>{label.toUpperCase()}</Text>
        <Text style={{ fontSize: scaledFont(13), color: C.text, lineHeight: 19, marginTop: 2 }}>{String(value)}</Text>
      </View>
    );
  };

  return (
    <ScreenBackground>
      <BackHeader title={title} subtitle={desc} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <View style={{ borderRadius: 14, padding: 14, backgroundColor: (C.card || '#121829') + 'CC', borderWidth: 1, borderColor: accent + '33', marginBottom: 12 }}>
          <Text style={{ fontSize: scaledFont(11), fontWeight: '900', letterSpacing: 1, color: accent }}>{title.toUpperCase()}</Text>
          <Text style={{ marginTop: 6, fontSize: scaledFont(13), color: C.textMuted, lineHeight: 19 }}>{desc}</Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          <TextInput
            value={newItem}
            onChangeText={setNewItem}
            placeholder={cfg.addPlaceholder}
            placeholderTextColor={C.textMuted}
            style={{ flex: 1, minHeight: 44, borderRadius: 10, paddingHorizontal: 12, color: C.text, backgroundColor: (C.card || '#121829') + 'CC', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', fontSize: scaledFont(13) }}
            accessibilityLabel={`Add ${cfg.itemLabel}`}
          />
          <TouchableOpacity onPress={addManualItem} style={{ width: 46, minHeight: 44, borderRadius: 10, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }} accessibilityRole="button" accessibilityLabel={`Add ${cfg.itemLabel}`}>
            <Plus size={20} color="#06111F" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, borderRadius: 10, paddingHorizontal: 12, backgroundColor: (C.card || '#121829') + 'AA', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
          <Search size={16} color={C.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your vault..."
            placeholderTextColor={C.textMuted}
            style={{ flex: 1, minHeight: 44, color: C.text, fontSize: scaledFont(13) }}
            accessibilityLabel="Search your vault"
          />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <TouchableOpacity onPress={cfg.kind === 'wordchunks' ? exportWordChunksPdf : exportCsv} style={{ flex: 1, minWidth: 120, minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: accent + '44', backgroundColor: accent + '12', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }} accessibilityRole="button" accessibilityLabel={`Export ${title}`}>
            <Download size={16} color={accent} />
            <Text style={{ color: accent, fontSize: scaledFont(13), fontWeight: '800' }}>{cfg.kind === 'wordchunks' ? wt('vault-export-pdf') : wt('vault-export')}</Text>
          </TouchableOpacity>
          {cfg.kind === 'wordchunks' && (
            <TouchableOpacity onPress={exportCsv} style={{ flex: 1, minWidth: 120, minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: accent + '30', backgroundColor: (C.card || '#121829') + '88', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }} accessibilityRole="button" accessibilityLabel={wt('vault-export-csv')}>
              <Download size={16} color={C.textMuted} />
              <Text style={{ color: C.textMuted, fontSize: scaledFont(13), fontWeight: '800' }}>{wt('vault-export-csv')}</Text>
            </TouchableOpacity>
          )}
          {cfg.kind === 'wordchunks' && (
            <TouchableOpacity onPress={importToVocabularyVault} style={{ flex: 1, minWidth: 120, minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: (C.emerald || '#00E5A0') + '44', backgroundColor: (C.emerald || '#00E5A0') + '12', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }} accessibilityRole="button" accessibilityLabel="Import to Vocabulary Vault">
              <Upload size={16} color={C.emerald || '#00E5A0'} />
              <Text style={{ color: C.emerald || '#00E5A0', fontSize: scaledFont(13), fontWeight: '800' }}>Import</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={{ fontSize: scaledFont(11), color: C.textMuted, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 }}>
          {filtered.length} saved item{filtered.length === 1 ? '' : 's'}
        </Text>

        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', padding: 24, borderRadius: 14, backgroundColor: (C.card || '#121829') + '88', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
            <Archive size={28} color={accent} />
            <Text style={{ marginTop: 10, fontSize: scaledFont(15), fontWeight: '900', color: C.text }}>Your {title} is empty</Text>
            <Text style={{ marginTop: 4, textAlign: 'center', fontSize: scaledFont(13), color: C.textMuted, lineHeight: 19 }}>{cfg.emptyFallback}</Text>
          </View>
        ) : filtered.map(item => (
          <View key={`${item.text}-${item.date}`} style={{ borderRadius: 12, padding: 14, marginBottom: 10, backgroundColor: (C.card || '#121829') + 'CC', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: scaledFont(15), fontWeight: '900', color: C.text, lineHeight: 21 }}>{item.text}</Text>
                <Text style={{ marginTop: 3, fontSize: scaledFont(11), color: accent, fontWeight: '800' }}>{item.category || cfg.category}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteItem(item)} style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }} accessibilityRole="button" accessibilityLabel={`Delete ${item.text}`}>
                <Trash2 size={17} color={C.red || '#FF4D6D'} />
              </TouchableOpacity>
            </View>
            {cfg.kind === 'grammar' ? (
              <>
                {renderField('Prompt', item.prompt)}
                {renderField('Correct answer', item.correctAnswer)}
                {renderField('Your answer', item.studentAnswer)}
                {renderField('Rule', item.rule && item.rule !== item.text ? item.rule : undefined)}
              </>
            ) : (
              <>
                {renderField('Native prompt', item.native || item.prompt)}
                {renderField('English chunk', item.english && item.english !== item.text ? item.english : undefined)}
                {renderField('Your answer', item.studentAnswer)}
              </>
            )}
            {typeof item.score === 'number' && renderField('Score', `${item.score}%`)}
          </View>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}
