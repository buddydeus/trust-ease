import fs from 'node:fs';
import path from 'node:path';

interface ITrackedSource {
  filePath: string;
  source: string;
}

const TRACKED_EXTENSIONS = new Set(['.ts', '.tsx', '.md']);

function collectTrackedFiles(root: string): string[] {
  const results: string[] = [];

  const walk = (dir: string): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of entries) {
      if (ent.name === 'node_modules' || ent.name === '.git') {
        continue;
      }
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (TRACKED_EXTENSIONS.has(path.extname(ent.name))) {
        results.push(full);
      }
    }
  };

  for (const sub of ['src', 'tests']) {
    const dir = path.join(root, sub);
    if (fs.existsSync(dir)) {
      walk(dir);
    }
  }

  const readme = path.join(root, 'README.md');
  if (fs.existsSync(readme)) {
    results.push(readme);
  }

  return results;
}

function readTrackedSources(): ITrackedSource[] {
  const root = process.cwd();
  const files = collectTrackedFiles(root).filter(filePath => {
    const rel = path.relative(root, filePath).replace(/\\/g, '/');
    return rel !== 'tests/support/source-structure.test.ts';
  });

  return files.map((filePath: string) => ({
    filePath,
    source: fs.readFileSync(filePath, 'utf8')
  }));
}

function isUnderSrc(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, '/');
  return normalized.includes('/src/');
}

test('活跃源码使用 pages 与 components 等目录，而非旧命名', () => {
  const files = readTrackedSources();

  for (const { filePath, source } of files) {
    expect(source).not.toContain('src/features');
    expect(source).not.toContain('src/ui');
    expect(source).not.toContain('tests/features');
    expect(source).not.toContain('/features/');
    expect(source).not.toContain('/ui/');
    expect(source).not.toContain('src/reporting');
    expect(source).not.toContain('src/onboarding');
    expect(source).not.toContain('src/preview');
    expect(source).not.toContain('src/design');
    expect(source).not.toContain('src/domain');
    expect(source).not.toMatch(/from ['"](?:\.\.\/)+reporting\//);
    expect(source).not.toMatch(/from ['"](?:\.\.\/)+onboarding\//);
    expect(source).not.toMatch(/from ['"](?:\.\.\/)+preview\//);
    expect(source).not.toMatch(/from ['"](?:\.\.\/)+design\//);
    expect(source).not.toMatch(/from ['"](?:\.\.\/)+domain\//);
    expect(source).not.toMatch(/require\(['"](?:\.\.\/)+reporting\//);
    expect(source).not.toMatch(/require\(['"](?:\.\.\/)+onboarding\//);
    expect(source).not.toMatch(/require\(['"](?:\.\.\/)+preview\//);
    expect(source).not.toMatch(/require\(['"](?:\.\.\/)+design\//);
    expect(source).not.toMatch(/require\(['"](?:\.\.\/)+domain\//);

    if (filePath.endsWith('README.md')) {
      expect(source).toContain('src/pages/');
      expect(source).toContain('src/components/');
      expect(source).toContain('src/store/');
      expect(source).toContain('src/constants/');
    }
  }
});

test('源码模块优先使用 interface 对象形态与 const 导出', () => {
  const files = readTrackedSources().filter(({ filePath }: ITrackedSource) =>
    isUnderSrc(filePath)
  );

  for (const { source } of files) {
    expect(source).not.toMatch(/^export function /m);
    expect(source).not.toMatch(/^export async function /m);
    expect(source).not.toMatch(/^export type [A-Za-z0-9_]+ = \{/m);
    expect(source).not.toMatch(/^type [A-Za-z0-9_]+ = \{/m);
  }
});

test('React 组件使用显式 IXXProps 的 memo 签名', () => {
  const files = readTrackedSources().filter(
    ({ filePath }: ITrackedSource) =>
      filePath.endsWith('.tsx') && isUnderSrc(filePath)
  );

  for (const { source } of files) {
    expect(source).not.toMatch(/^export type I[A-Za-z0-9_]*Props = /m);
    expect(source).not.toMatch(
      /export const [A-Z][A-Za-z0-9_]* = React\.memo\(\(\{/
    );
  }
});
