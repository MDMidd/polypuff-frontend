const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const websiteRoot = 'D:\\OneDrive\\Desktop\\polypuff-website';
const websiteLanguagePath = path.join(websiteRoot, 'site-language.js');
const settingsI18nPath = path.join(websiteRoot, 'settings-i18n.js');
const classroomI18nPath = path.join(websiteRoot, 'classroom-i18n.js');
const classroomScriptPath = path.join(websiteRoot, 'classroom.js');
const mobileTranslationsPath = path.join(root, 'contexts', 'translations.ts');
const outputPath = path.join(root, 'contexts', 'websiteTranslations.ts');

const source = fs.readFileSync(websiteLanguagePath, 'utf8');
const mobileTranslations = fs.readFileSync(mobileTranslationsPath, 'utf8');

const langType = mobileTranslations.match(/export\s+type\s+LangCode\s*=([\s\S]*?);/);
if (!langType) throw new Error('Could not find LangCode union in mobile translations.ts');
const langCodes = Array.from(new Set(Array.from(langType[1].matchAll(/'([^']+)'/g)).map((m) => m[1])));

const sandbox = {
  console,
  setTimeout,
  clearTimeout,
  window: {
    POLYPUFF_API_URL: '',
    addEventListener: () => {},
    dispatchEvent: () => {},
  },
  document: {
    readyState: 'loading',
    addEventListener: () => {},
    documentElement: { setAttribute: () => {} },
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementById: () => null,
    createElement: () => ({ style: {}, appendChild: () => {}, setAttribute: () => {} }),
    head: { appendChild: () => {} },
    body: null,
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  },
  MutationObserver: function MutationObserver() {
    return { observe: () => {}, disconnect: () => {} };
  },
  CustomEvent: function CustomEvent(type, options) {
    return { type, ...options };
  },
  NodeFilter: {
    FILTER_REJECT: 2,
    FILTER_ACCEPT: 1,
  },
};
sandbox.window.window = sandbox.window;
sandbox.window.document = sandbox.document;
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.MutationObserver = sandbox.MutationObserver;
sandbox.window.CustomEvent = sandbox.CustomEvent;
sandbox.window.NodeFilter = sandbox.NodeFilter;

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: websiteLanguagePath });

const languageApi = sandbox.window.PolyPuffLanguage;
if (!languageApi?.t) throw new Error('Could not load PolyPuffLanguage.t from website source');

const translationKeys = Array.from(new Set(Array.from(source.matchAll(/'([a-z][a-z0-9-]+)'\s*:/g)).map((m) => m[1])))
  .filter((key) => languageApi.t(key, 'en') !== key)
  .sort();

const output = {};
for (const code of langCodes) {
  output[code] = {};
  for (const key of translationKeys) {
    const english = languageApi.t(key, 'en');
    const value = languageApi.t(key, code);
    output[code][key] = value && value !== key ? value : english;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Page-specific i18n sources. Each function returns:
//   { en: { key: enValue }, lang: { key: translatedValue }, ... }
// The English block is treated as the source of truth for the key set.
// Keys are merged into the same flat namespace as site-language.js. Any key
// collision logs a warning and keeps the site-language.js value.
// ──────────────────────────────────────────────────────────────────────────────

let mergeStats = { sources: 0, keysAdded: 0, collisions: 0 };

function mergeSource(label, packsByLang) {
  if (!packsByLang || typeof packsByLang !== 'object') {
    console.warn(`  ${label}: no packs returned`);
    return;
  }
  const enPack = packsByLang.en;
  if (!enPack || typeof enPack !== 'object') {
    console.warn(`  ${label}: missing en pack`);
    return;
  }
  const sourceKeys = Object.keys(enPack);
  let added = 0;
  let collisions = 0;
  for (const key of sourceKeys) {
    if (Object.prototype.hasOwnProperty.call(output.en, key)) {
      collisions += 1;
      continue;
    }
    added += 1;
    for (const code of langCodes) {
      const pack = packsByLang[code];
      const value = (pack && pack[key]) || enPack[key];
      if (!output[code]) output[code] = {};
      output[code][key] = String(value);
    }
  }
  mergeStats.sources += 1;
  mergeStats.keysAdded += added;
  mergeStats.collisions += collisions;
  console.log(`  ${label}: +${added} keys (${collisions} collisions skipped)`);
}

// settings-i18n.js — IIFE with `const packs = { en: {...}, ... }`. Inject a
// trailing global assignment so we can read packs after the IIFE runs.
function loadSettingsPacks() {
  try {
    const raw = fs.readFileSync(settingsI18nPath, 'utf8');
    // Inject `window.__PP_SETTINGS_PACKS = packs;` before the IIFE close.
    const patched = raw.replace(/\}\)\(\);\s*$/m, '; window.__PP_SETTINGS_PACKS = packs; })();');
    vm.runInContext(patched, sandbox, { filename: settingsI18nPath });
    return sandbox.window.__PP_SETTINGS_PACKS;
  } catch (e) {
    console.warn(`  settings-i18n.js: ${e.message}`);
    return null;
  }
}

// classroom-i18n.js — sets window.POLYPUFF_CLASSROOM_TRANSLATIONS (no en pack).
// classroom.js — has `const CLASSROOM_TEXT = { en: {...}, ... }` then later
//   `Object.assign(CLASSROOM_TEXT.en, {...});` calls. We need both for the en
//   baseline. We inject a global assignment so we can read CLASSROOM_TEXT after.
function loadClassroomPacks() {
  let nonEnPacks = {};
  try {
    vm.runInContext(fs.readFileSync(classroomI18nPath, 'utf8'), sandbox, {
      filename: classroomI18nPath,
    });
    nonEnPacks = sandbox.window.POLYPUFF_CLASSROOM_TRANSLATIONS || {};
  } catch (e) {
    console.warn(`  classroom-i18n.js: ${e.message}`);
  }
  let allPacks = null;
  try {
    const raw = fs.readFileSync(classroomScriptPath, 'utf8');
    // Find the IIFE end and inject the global. classroom.js wraps in
    // (function(){ ... })(); we patch just before the closing })();
    const patched = raw.replace(/\}\)\(\);\s*$/m, '; window.__PP_CLASSROOM_TEXT = CLASSROOM_TEXT; })();');
    vm.runInContext(patched, sandbox, { filename: classroomScriptPath });
    allPacks = sandbox.window.__PP_CLASSROOM_TEXT;
  } catch (e) {
    console.warn(`  classroom.js: ${e.message}`);
  }
  if (!allPacks) return { en: {}, ...nonEnPacks };
  // Merge: prefer per-language CLASSROOM_TEXT entries when present, fall back
  // to POLYPUFF_CLASSROOM_TRANSLATIONS entries, fall back to en.
  const merged = {};
  const enPack = allPacks.en || {};
  for (const code of Object.keys(allPacks).concat(Object.keys(nonEnPacks))) {
    if (code === '__complete') continue;
    const fromClassroom = allPacks[code] || {};
    const fromI18n = nonEnPacks[code] || {};
    merged[code] = { ...enPack, ...fromI18n, ...fromClassroom };
  }
  merged.en = enPack;
  return merged;
}

console.log('Merging page-specific i18n sources...');
const settingsPacks = loadSettingsPacks();
if (settingsPacks) mergeSource('settings-i18n.js', settingsPacks);
const classroomPacks = loadClassroomPacks();
if (classroomPacks) mergeSource('classroom (+ classroom-i18n)', classroomPacks);
console.log(`  Total: ${mergeStats.sources} sources, +${mergeStats.keysAdded} keys, ${mergeStats.collisions} collisions`);

const totalKeys = Object.keys(output.en).length;

const file = `/**\n` +
  ` * Generated from polypuff-website i18n sources:\n` +
  ` *   - site-language.js\n` +
  ` *   - settings-i18n.js\n` +
  ` *   - classroom-i18n.js + classroom.js (CLASSROOM_TEXT)\n` +
  ` * Run: node scripts/extract-website-i18n.js\n` +
  ` */\n` +
  `import type { LangCode } from './translations';\n\n` +
  `export type WebsiteTranslationKey = keyof typeof websiteTranslations.en;\n\n` +
  `const websiteTranslations = ${JSON.stringify(output, null, 2)} as const satisfies Record<LangCode, Record<string, string>>;\n\n` +
  `export default websiteTranslations;\n`;

fs.writeFileSync(outputPath, file, 'utf8');
console.log(`Wrote ${path.relative(root, outputPath)} with ${langCodes.length} languages and ${totalKeys} total keys (${translationKeys.length} from site-language.js + ${mergeStats.keysAdded} from page-specific sources).`);
