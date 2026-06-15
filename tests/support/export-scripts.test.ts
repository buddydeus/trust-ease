import fs from 'node:fs';
import path from 'node:path';

const packageJsonPath = path.join(process.cwd(), 'package.json');
const designScriptPath = path.join(
  process.cwd(),
  'scripts/render_current_app_screens.py'
);

function readJson(filePath: string) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

test('package scripts split design previews from runtime thumbs screenshots', () => {
  const packageJson = readJson(packageJsonPath);

  expect(packageJson.scripts.design).toBe(
    'python3 scripts/render_current_app_screens.py'
  );
  expect(packageJson.scripts.thumbs).toBe(
    'node scripts/capture_runtime_thumbs.js'
  );
});

test('design preview script writes into designs instead of thumbs', () => {
  const script = fs.readFileSync(designScriptPath, 'utf8');

  expect(script).toContain('OUT_DIR = ROOT / "designs"');
  expect(script).not.toContain('OUT_DIR = ROOT / "thumbs"');
});

test('design preview script preserves design specs and preview artifacts', () => {
  const script = fs.readFileSync(designScriptPath, 'utf8');

  expect(script).toContain('locale_dir = OUT_DIR / locale');
  expect(script).toContain('shutil.rmtree(locale_dir)');
  expect(script).not.toContain('shutil.rmtree(OUT_DIR)');
});
