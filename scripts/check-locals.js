const fs = require('node:fs');
const path = require('node:path');

const BASELINE_LOCALE = 'zh-CN';
const LOCALES_DIR = path.join('src', 'locals');
const SCAN_DIRS = ['src', 'tests'];
const IGNORE_SCAN_DIRS = new Set(['src/locals']);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function flattenKeys(value, prefix = '') {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.values(value).every(
      nested => nested === null || typeof nested !== 'object'
    )
  ) {
    return Object.keys(value).sort();
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value).flatMap(([key, nested]) => {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    return flattenKeys(nested, nextPrefix);
  });
}

function walkFiles(rootDir, currentDir, results) {
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path
      .relative(rootDir, fullPath)
      .replaceAll(path.sep, '/');

    if (entry.isDirectory()) {
      if (IGNORE_SCAN_DIRS.has(relativePath)) {
        continue;
      }
      walkFiles(rootDir, fullPath, results);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      continue;
    }

    results.push(fullPath);
  }
}

function collectCodeFiles(rootDir) {
  const files = [];

  for (const relativeDir of SCAN_DIRS) {
    const fullDir = path.join(rootDir, relativeDir);
    if (!fs.existsSync(fullDir)) {
      continue;
    }
    walkFiles(rootDir, fullDir, files);
  }

  return files;
}

function collectLocaleDiffs(localesDir) {
  const localeFiles = fs
    .readdirSync(localesDir)
    .filter(fileName => fileName.endsWith('.json'))
    .sort();

  const baselineFileName = `${BASELINE_LOCALE}.json`;
  const baselinePath = path.join(localesDir, baselineFileName);

  if (!localeFiles.includes(baselineFileName)) {
    throw new Error(`Baseline locale file is missing: ${baselinePath}`);
  }

  const baselineKeys = flattenKeys(readJson(baselinePath)).sort();
  const baselineKeySet = new Set(baselineKeys);
  const localeDiffs = {};

  for (const localeFile of localeFiles) {
    if (localeFile === baselineFileName) {
      continue;
    }

    const locale = localeFile.replace(/\.json$/, '');
    const localeKeys = flattenKeys(
      readJson(path.join(localesDir, localeFile))
    ).sort();
    const localeKeySet = new Set(localeKeys);

    const missing = baselineKeys.filter(key => !localeKeySet.has(key));
    const extra = localeKeys.filter(key => !baselineKeySet.has(key));

    localeDiffs[locale] = { missing, extra };
  }

  return { baselineKeys, localeDiffs };
}

function getAliasMatches(source, section) {
  const aliasPattern = new RegExp(`copy\\s*=\\s*\\{`, 'g');
  const aliases = new Set(['messages']);
  let match;

  while ((match = aliasPattern.exec(source))) {
    const before = source.slice(0, match.index);
    const directAliases = ['copy'];

    const copyAliasMatch = /(?:const|let|var)\s+(\w+)\s*=\s*copy\b/g;
    let currentAlias;
    while ((currentAlias = copyAliasMatch.exec(before))) {
      directAliases.push(currentAlias[1]);
    }

    for (const directAlias of directAliases) {
      aliases.add(directAlias);

      const nestedAliasPattern = new RegExp(
        `(?:const|let|var)\\s+(\\w+)\\s*=\\s*${directAlias}\\b`,
        'g'
      );
      let nestedAlias;
      while ((nestedAlias = nestedAliasPattern.exec(source))) {
        aliases.add(nestedAlias[1]);
      }
    }
  }

  return aliases;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isBaselinePathUsed(source, keyPath) {
  const escapedKeyPath = escapeRegExp(keyPath);
  const singleArgumentGetMessagePattern = new RegExp(
    `\\bgetMessage\\s*\\(\\s*(['"])${escapedKeyPath}\\1`
  );

  return (
    source.includes(`messages.${keyPath}`) ||
    source.includes(`messages['${keyPath}']`) ||
    source.includes(`messages["${keyPath}"]`) ||
    source.includes(`getMessage(messages, '${keyPath}')`) ||
    source.includes(`getMessage(messages,"${keyPath}")`) ||
    source.includes(`getMessage(messages, "${keyPath}")`) ||
    singleArgumentGetMessagePattern.test(source)
  );
}

function collectUsedBaselinePaths(rootDir, baselineKeys) {
  const files = collectCodeFiles(rootDir);
  const fileSources = files.map(filePath => ({
    filePath,
    source: fs.readFileSync(filePath, 'utf8')
  }));
  const usedPaths = new Set();

  for (const { source } of fileSources) {
    for (const keyPath of baselineKeys) {
      if (isBaselinePathUsed(source, keyPath)) {
        usedPaths.add(keyPath);
        continue;
      }
    }
  }

  return Array.from(usedPaths).sort();
}

function analyzeLocals(rootDir = process.cwd()) {
  const localesDir = path.join(rootDir, LOCALES_DIR);
  const { baselineKeys, localeDiffs } = collectLocaleDiffs(localesDir);
  const usedBaselinePaths = collectUsedBaselinePaths(rootDir, baselineKeys);
  const usedPathSet = new Set(usedBaselinePaths);
  const unusedBaselinePaths = baselineKeys.filter(key => !usedPathSet.has(key));

  return {
    baselineLocale: BASELINE_LOCALE,
    baselineKeys,
    localeDiffs,
    usedBaselinePaths,
    unusedBaselinePaths
  };
}

function printReport(result) {
  let hasProblems = false;

  console.log(
    `[check:local] baseline: ${LOCALES_DIR}/${result.baselineLocale}.json`
  );

  for (const [locale, diff] of Object.entries(result.localeDiffs)) {
    if (!diff.missing.length && !diff.extra.length) {
      console.log(`[check:local] ${locale}: OK`);
      continue;
    }

    hasProblems = true;
    console.log(`[check:local] ${locale}: drift detected`);

    if (diff.missing.length) {
      console.log(`  missing (${diff.missing.length})`);
      for (const key of diff.missing) {
        console.log(`  - ${key}`);
      }
    }

    if (diff.extra.length) {
      console.log(`  extra (${diff.extra.length})`);
      for (const key of diff.extra) {
        console.log(`  - ${key}`);
      }
    }
  }

  if (result.unusedBaselinePaths.length) {
    hasProblems = true;
    console.log(
      `[check:local] unused baseline keys (${result.unusedBaselinePaths.length})`
    );
    for (const key of result.unusedBaselinePaths) {
      console.log(`  - ${key}`);
    }
  } else {
    console.log('[check:local] unused baseline keys: none');
  }

  if (!hasProblems) {
    console.log(
      '[check:local] all locale files are aligned and all baseline keys are used'
    );
  }

  return hasProblems ? 1 : 0;
}

if (require.main === module) {
  try {
    const result = analyzeLocals(process.cwd());
    process.exitCode = printReport(result);
  } catch (error) {
    console.error('[check:local] failed');
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

module.exports = {
  analyzeLocals,
  flattenKeys
};
