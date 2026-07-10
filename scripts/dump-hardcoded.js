/* One-off dump of hardcoded UI strings in app/ - for translation migration */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

function findHardcoded() {
  const candidates = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'dist', '.expo', 'scripts'].includes(entry.name)) continue;
        walk(full);
      } else if (entry.name.match(/\.(tsx|ts|jsx|js)$/) && !entry.name.endsWith('.d.ts')) {
        scanFile(full);
      }
    }
  }
  function scanFile(file) {
    const rel = path.relative(root, file).split(path.sep).join('/');
    if (!rel.startsWith('app/')) return;
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      // <Text>...child...</Text> - capture text between > and < that has letters
      const textMatch = line.match(/>([A-Za-z][^<>{]{2,})</);
      if (textMatch) {
        const val = textMatch[1].trim();
        if (val.length >= 3 && /[A-Za-z]{3}/.test(val) && !val.includes('${') && !val.match(/^\s*$/)) {
          candidates.push({ file: rel, line: i + 1, kind: 'Text', value: val });
        }
      }
      // placeholder="..."
      const placeholderMatch = line.match(/placeholder\s*=\s*["']([^"']{3,})["']/);
      if (placeholderMatch) {
        candidates.push({ file: rel, line: i + 1, kind: 'Placeholder', value: placeholderMatch[1] });
      }
      // accessibilityLabel="..."
      const a11yMatch = line.match(/accessibilityLabel\s*=\s*["']([^"']{3,})["']/);
      if (a11yMatch) {
        candidates.push({ file: rel, line: i + 1, kind: 'A11y', value: a11yMatch[1] });
      }
    });
  }
  walk(root);
  return candidates;
}

const all = findHardcoded();
const byFile = {};
for (const c of all) {
  byFile[c.file] = byFile[c.file] || [];
  byFile[c.file].push(c);
}
fs.writeFileSync(path.join(__dirname, '../tmp-hardcoded.json'), JSON.stringify(byFile, null, 2));
console.log('Total candidates:', all.length);
console.log('Files:', Object.keys(byFile).length);
console.log('');
console.log('Top files:');
Object.entries(byFile)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 10)
  .forEach(([f, v]) => console.log(`  ${f}: ${v.length}`));
