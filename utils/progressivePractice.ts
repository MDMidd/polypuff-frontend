const CEFR_LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export type MasteredPracticeItem = {
  native: string;
  english?: string;
  level?: string;
  category?: string;
  topic?: string;
  date: string;
  score: number;
};

export const normalizePracticeText = (text = '') =>
  String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,!?;:"'()[\]{}¿¡،।]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const nextCefrLevel = (level = '') => {
  const idx = CEFR_LEVELS.indexOf(String(level).toUpperCase());
  return idx >= 0 && idx < CEFR_LEVELS.length - 1 ? CEFR_LEVELS[idx + 1] : null;
};

export const uniqueRecentTexts = (items: string[] = [], limit = 80) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items.filter(Boolean).reverse()) {
    const key = normalizePracticeText(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.unshift(item);
    if (out.length >= limit) break;
  }
  return out;
};

export const masteredTexts = (items: MasteredPracticeItem[] = []) =>
  items.map(item => item.native).filter(Boolean);

export const isDuplicatePracticeItem = (
  text = '',
  recent: string[] = [],
  mastered: MasteredPracticeItem[] = []
) => {
  const key = normalizePracticeText(text);
  if (!key) return false;
  return [...recent, ...masteredTexts(mastered)].some(item => normalizePracticeText(item) === key);
};

export const shouldSuggestNextLevel = (scores: number[] = [], level = '') => {
  if (!nextCefrLevel(level) || scores.length < 8) return false;
  const recent = scores.slice(0, 10);
  const avg = recent.reduce((sum, score) => sum + Number(score || 0), 0) / recent.length;
  const strong = recent.filter(score => Number(score || 0) >= 85).length;
  const weak = recent.filter(score => Number(score || 0) < 70).length;
  return avg >= 86 && strong >= 6 && weak === 0;
};

export const masteryScopeKey = (module: 'translation' | 'wordchunks', nativeLanguage: string, level: string) =>
  `mastered_${module}_${normalizePracticeText(nativeLanguage).replace(/\s+/g, '_')}_${String(level).toUpperCase()}`;

export const progressionScopeKey = (module: 'translation' | 'wordchunks', nativeLanguage: string, level: string) =>
  `progression_${module}_${normalizePracticeText(nativeLanguage).replace(/\s+/g, '_')}_${String(level).toUpperCase()}`;

export const levelPromptScopeKey = (module: 'translation' | 'wordchunks', nativeLanguage: string, level: string) =>
  `level_prompted_${module}_${normalizePracticeText(nativeLanguage).replace(/\s+/g, '_')}_${String(level).toUpperCase()}`;
