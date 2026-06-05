const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const translationsPath = path.join(root, 'contexts', 'translations.ts');
const source = fs.readFileSync(translationsPath, 'utf8');

function unique(values) {
  return Array.from(new Set(values));
}

function matchAll(regex, text) {
  return Array.from(text.matchAll(regex));
}

function getLangCodes() {
  const typeMatch = source.match(/export\s+type\s+LangCode\s*=([\s\S]*?);/);
  if (!typeMatch) return [];
  return unique(matchAll(/'([^']+)'/g, typeMatch[1]).map((m) => m[1]));
}

function getRecordCodes() {
  return unique(matchAll(/^\s{2}([a-z]{2,3}):\s*\{/gm, source).map((m) => m[1]));
}

function getRecordBlock(code, orderedCodes) {
  const startPattern = new RegExp(`^\\s{2}${code}:\\s*\\{`, 'm');
  const startMatch = startPattern.exec(source);
  if (!startMatch) return '';

  const start = startMatch.index;
  const codeIndex = orderedCodes.indexOf(code);
  for (let i = codeIndex + 1; i < orderedCodes.length; i += 1) {
    const nextPattern = new RegExp(`^\\s{2}${orderedCodes[i]}:\\s*\\{`, 'm');
    const nextMatch = nextPattern.exec(source.slice(start + 1));
    if (nextMatch) return source.slice(start, start + 1 + nextMatch.index);
  }

  const end = source.indexOf('\n};', start);
  return end >= 0 ? source.slice(start, end) : source.slice(start);
}

function getKeysForCode(code, orderedCodes) {
  const block = getRecordBlock(code, orderedCodes);
  const body = block.replace(new RegExp(`^\\s{2}${code}:\\s*\\{`, 'm'), '');
  return unique(matchAll(/(?:^|[\s,{])([A-Za-z][A-Za-z0-9_]*):\s*/gm, body).map((m) => m[1]));
}

function walkFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', '.expo', 'node_modules', 'dist'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, files);
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && fullPath !== translationsPath) {
      files.push(fullPath);
    }
  }
  return files;
}

function findHardcodedCandidates() {
  const files = ['app', 'components', 'screens']
    .map((folder) => path.join(root, folder))
    .filter((folder) => fs.existsSync(folder))
    .flatMap((folder) => walkFiles(folder));
  const candidates = [];

  const patterns = [
    { kind: 'Text child', regex: /<Text\b[^>]*>\s*([^<>{}`]*[A-Za-z][^<>{}`]*)\s*<\/Text>/g },
    { kind: 'Alert title', regex: /Alert\.alert\(\s*['"`]([^'"`]*[A-Za-z][^'"`]*)['"`]/g },
    { kind: 'Accessibility label', regex: /accessibilityLabel=["']([^"']*[A-Za-z][^"']*)["']/g },
    { kind: 'Placeholder', regex: /placeholder=["']([^"']*[A-Za-z][^"']*)["']/g },
  ];

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    for (const { kind, regex } of patterns) {
      let match;
      while ((match = regex.exec(text)) !== null) {
        const before = text.slice(0, match.index);
        const line = before.split(/\r?\n/).length;
        const value = match[1].replace(/\s+/g, ' ').trim();
        if (!value || value.length > 120 || /^[A-Z0-9_]+$/.test(value)) continue;
        candidates.push({
          file: path.relative(root, file).replace(/\\/g, '/'),
          line,
          kind,
          value,
        });
      }
    }
  }

  return candidates;
}

const langCodes = getLangCodes();
const recordCodes = getRecordCodes();
const missingRecords = langCodes.filter((code) => !recordCodes.includes(code));
const extraRecords = recordCodes.filter((code) => !langCodes.includes(code));
const englishKeys = getKeysForCode('en', recordCodes);
const missingKeys = recordCodes
  .map((code) => ({
    code,
    missing: englishKeys.filter((key) => !getKeysForCode(code, recordCodes).includes(key)),
  }))
  .filter((entry) => entry.missing.length > 0);
const hardcodedCandidates = findHardcodedCandidates();

console.log(`LangCode entries: ${langCodes.length}`);
console.log(`Translation records: ${recordCodes.length}`);
console.log(`English translation keys: ${englishKeys.length}`);

if (missingRecords.length) console.log(`Missing records: ${missingRecords.join(', ')}`);
if (extraRecords.length) console.log(`Extra records: ${extraRecords.join(', ')}`);
if (missingKeys.length) {
  console.log('Records missing English keys:');
  for (const entry of missingKeys) {
    console.log(`  ${entry.code}: ${entry.missing.join(', ')}`);
  }
}

console.log(`Hardcoded UI string candidates: ${hardcodedCandidates.length}`);
const fileCounts = hardcodedCandidates.reduce((counts, item) => {
  counts[item.file] = (counts[item.file] || 0) + 1;
  return counts;
}, {});
const topFiles = Object.entries(fileCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);
if (topFiles.length) {
  console.log('Top files by candidate count:');
  for (const [file, count] of topFiles) {
    console.log(`  ${file}: ${count}`);
  }
}
for (const item of hardcodedCandidates.slice(0, 40)) {
  console.log(`  ${item.file}:${item.line} [${item.kind}] ${item.value}`);
}

if (hardcodedCandidates.length > 40) {
  console.log(`  ...and ${hardcodedCandidates.length - 40} more candidates`);
}

if (missingRecords.length || extraRecords.length || missingKeys.length) {
  process.exitCode = 1;
}
