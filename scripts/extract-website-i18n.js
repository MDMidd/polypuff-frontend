const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const websiteLanguagePath = 'D:\\OneDrive\\Desktop\\polypuff-website\\site-language.js';
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

const file = `/**\n` +
  ` * Generated from D:\\\\OneDrive\\\\Desktop\\\\polypuff-website\\\\site-language.js.\n` +
  ` * Run: node scripts/extract-website-i18n.js\n` +
  ` */\n` +
  `import type { LangCode } from './translations';\n\n` +
  `export type WebsiteTranslationKey = keyof typeof websiteTranslations.en;\n\n` +
  `const websiteTranslations = ${JSON.stringify(output, null, 2)} as const satisfies Record<LangCode, Record<string, string>>;\n\n` +
  `export default websiteTranslations;\n`;

fs.writeFileSync(outputPath, file, 'utf8');
console.log(`Wrote ${path.relative(root, outputPath)} with ${langCodes.length} languages and ${translationKeys.length} website keys.`);
