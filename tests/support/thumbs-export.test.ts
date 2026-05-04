import fs from 'node:fs';
import path from 'node:path';

const scriptPath = path.join(
  process.cwd(),
  'scripts/capture_runtime_thumbs.js'
);

function readScriptSource() {
  return fs.readFileSync(scriptPath, 'utf8');
}

test('runtime thumbs capture the real report page without exporting a separate home-unreported file', () => {
  const source = readScriptSource();

  expect(source).toContain("slug: 'welcome'");
  expect(source).toContain("slug: 'report'");
  expect(source).not.toContain("slug: 'home-unreported'");
  expect(source).not.toContain('/(tabs)');
  expect(source).toContain("route: '/welcome'");
  expect(source).toContain("route: '/home'");
  expect(source).toContain("route: '/items'");
  expect(source).toContain("route: '/my'");
});

test('runtime thumbs script exports the real web bundle and opens the exported entry file', () => {
  const source = readScriptSource();

  expect(source).toContain(
    "['expo', 'export', '--platform', 'web', '--output-dir', WEB_EXPORT_DIR]"
  );
  expect(source).toContain('WEB_EXPORT_DIR');
  expect(source).toContain('EXPORT_ENTRY_PATH');
  expect(source).toContain("require('@playwright/test')");
  expect(source).toContain('chromium.launch');
  expect(source).toContain('page.screenshot');
  expect(source).toContain('page.route');
  expect(source).not.toContain('createServer');
});

test('runtime thumbs render at phone css size and export high-density pngs', () => {
  const source = readScriptSource();

  expect(source).toContain('const PHONE_WIDTH = 390;');
  expect(source).toContain('const PHONE_HEIGHT = 844;');
  expect(source).toContain('const SCALE = 2;');
  expect(source).toContain('width: PHONE_WIDTH');
  expect(source).toContain('height: PHONE_HEIGHT');
  expect(source).toContain('deviceScaleFactor: SCALE');
  expect(source).not.toContain('PREVIEW_WIDTH');
  expect(source).not.toContain('PREVIEW_HEIGHT');
  expect(source).not.toContain('deviceScaleFactor: 1');
});

test('runtime thumbs use installed web and browser dependencies instead of local shims', () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );
  const source = readScriptSource();

  expect(packageJson.dependencies['react-dom']).toBeDefined();
  expect(packageJson.dependencies['react-native-web']).toBeDefined();
  expect(packageJson.dependencies['@expo/metro-runtime']).toBeDefined();
  expect(packageJson.devDependencies['@playwright/test']).toBeDefined();
  expect(source).not.toContain('capture_runtime_thumb.swift');
  expect(source).not.toContain('captureWithSwiftWebView');
});
