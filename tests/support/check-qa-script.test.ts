import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const readJson = (filePath: string) =>
  JSON.parse(fs.readFileSync(filePath, 'utf8'));

const readText = (relativePath: string): string =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('single-device MVP QA gate contract', () => {
  test('package scripts expose deterministic and runtime QA gates', () => {
    const packageJson = readJson(path.join(root, 'package.json'));

    expect(packageJson.scripts['check:qa']).toBe('node scripts/check_qa.js');
    expect(packageJson.scripts['check:qa:runtime']).toBe('pnpm thumbs');
    expect(packageJson.scripts['check:qa:all']).toBe(
      'node scripts/check_qa.js --include-runtime'
    );
    expect(packageJson.scripts.thumbs).toBe(
      'node scripts/capture_runtime_thumbs.js'
    );
  });

  test('QA gate script covers local MVP checks without replacing focused commands', () => {
    const script = readText('scripts/check_qa.js');

    for (const expected of [
      'check:type',
      'check:local',
      'tests/store/trust',
      'tests/app',
      'tests/pages/items',
      'tests/pages/helpers',
      'tests/pages/trigger-state',
      'tests/pages/home',
      'tests/pages/my',
      'skin:qa:remote',
      'openspec',
      'validate',
      '--all',
      '--strict'
    ]) {
      expect(script).toContain(expected);
    }

    expect(script).toContain('--include-runtime');
    expect(script).toContain('check:qa:runtime');
    expect(script).toContain('process.exitCode = 1');
    expect(script).not.toContain('check:qa:remote-backend');
    expect(script).not.toContain('cloud sync');
  });

  test('project docs explain QA gate and bug report convention', () => {
    const readme = readText('README.md');
    const agents = readText('AGENTS.md');
    const bugsReadme = readText('.bugs/README.md');

    expect(readme).toContain('pnpm check:qa');
    expect(readme).toContain('pnpm check:qa:runtime');
    expect(readme).toContain('pnpm check:qa:all');
    expect(readme).toContain('single-device MVP');
    expect(readme).toContain('pnpm thumbs');
    expect(readme).not.toContain('fallback to design previews');

    expect(agents).toContain('pnpm check:qa');
    expect(agents).toContain('pnpm check:qa:runtime');
    expect(agents).toContain('pnpm check:qa:all');
    expect(agents).toContain('.bugs/');

    for (const expected of [
      '问题描述',
      '复现路径',
      '问题定位',
      '建议修复方式',
      '验证方式'
    ]) {
      expect(bugsReadme).toContain(expected);
    }
  });
});
