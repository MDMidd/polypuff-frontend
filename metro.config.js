const path = require('path');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);

// ── Fix 1: Three.js .cjs files ──────────────────────────────
config.resolver.sourceExts.push('cjs');

// ── Fix 2: Disable broken "exports" field handling ──────────
config.resolver.unstable_enablePackageExports = false;

// ── Fix 3: Force ONE copy of React across all packages ──────
// R3F ships its own reconciler that tries to load React internally.
// Without this, you get two Reacts fighting each other → crash.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  react: path.resolve(__dirname, 'node_modules/react'),
  'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
  'react-native': path.resolve(__dirname, 'node_modules/react-native'),
};

module.exports = config;