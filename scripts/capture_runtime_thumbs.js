#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('@playwright/test');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'thumbs');
const TMP_DIR = path.join(ROOT, '.tmp');
const EXPO_HOME_DIR = path.join(TMP_DIR, 'expo-home');
const WEB_EXPORT_DIR = path.join(TMP_DIR, 'web-export');
const DEBUG_DIR = path.join(TMP_DIR, 'thumbs-debug');
const EXPORT_ENTRY_PATH = path.join(WEB_EXPORT_DIR, 'index.html');
const LOCALES = ['zh-CN', 'zh-TW', 'en-US'];
const CAPTURES = [
  { slug: 'welcome', route: '/welcome' },
  { slug: 'report', route: '/report' },
  { slug: 'home', route: '/home' },
  { slug: 'items', route: '/items' },
  { slug: 'new-item', route: '/items/new' },
  { slug: 'my', route: '/my' },
  { slug: 'trigger-state', route: '/my/trigger-state' }
];

const PHONE_WIDTH = 390;
const PHONE_HEIGHT = 844;
const SCALE = 2;
const PREVIEW_ORIGIN = 'http://trust-ease.local';
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.css': 'text/css; charset=utf-8'
};
const SYSTEM_BROWSER_CANDIDATES =
  process.platform === 'win32'
    ? [
        path.join(
          process.env.PROGRAMFILES || 'C:\\Program Files',
          'Google\\Chrome\\Application\\chrome.exe'
        ),
        path.join(
          process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)',
          'Google\\Chrome\\Application\\chrome.exe'
        ),
        path.join(
          process.env.LOCALAPPDATA || '',
          'Google\\Chrome\\Application\\chrome.exe'
        ),
        path.join(
          process.env.PROGRAMFILES || 'C:\\Program Files',
          'Microsoft\\Edge\\Application\\msedge.exe'
        ),
        path.join(
          process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)',
          'Microsoft\\Edge\\Application\\msedge.exe'
        )
      ]
    : [];

function logStage(message) {
  console.log(`[thumbs] ${message}`);
}

function logFile(action, filePath, index, total) {
  console.log(
    `[thumbs] [${index}/${total}] ${action}: ${path.relative(ROOT, filePath)}`
  );
}

function removeDir(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function ensureDir(target) {
  fs.mkdirSync(target, { recursive: true });
}

function quoteWindowsCommandArg(value) {
  if (value.length === 0) {
    return '""';
  }

  if (!/[\s"]/u.test(value)) {
    return value;
  }

  return `"${value.replace(/"/gu, '\\"')}"`;
}

function resolveSpawnCommand(command, args) {
  if (process.platform !== 'win32') {
    return { command, args };
  }

  return {
    command: process.env.ComSpec || 'cmd.exe',
    args: [
      '/d',
      '/s',
      '/c',
      [command, ...args].map(quoteWindowsCommandArg).join(' ')
    ]
  };
}

function resolveBrowserLaunchOptions() {
  const executablePath =
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
    SYSTEM_BROWSER_CANDIDATES.find(candidate => fs.existsSync(candidate));

  return {
    headless: true,
    ...(executablePath ? { executablePath } : {})
  };
}

function buildPreviewUrl({ route, locale, homeState }) {
  const url = new URL(`${PREVIEW_ORIGIN}${route}`);
  url.searchParams.set('preview', '1');
  url.searchParams.set('locale', locale);
  url.searchParams.set('route', route);
  if (homeState) {
    url.searchParams.set('homeState', homeState);
  }
  return url;
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const spawnCommand = resolveSpawnCommand(command, args);
    const child = spawn(spawnCommand.command, spawnCommand.args, {
      cwd: ROOT,
      ...options
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', chunk => {
      stdout += chunk.toString();
      process.stdout.write(chunk);
    });

    child.stderr?.on('data', chunk => {
      stderr += chunk.toString();
      process.stderr.write(chunk);
    });

    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      reject(
        new Error(
          stderr ||
            stdout ||
            `${command} exited with code ${code} signal ${signal ?? 'none'}`
        )
      );
    });
  });
}

async function exportWebBundle() {
  ensureDir(TMP_DIR);
  ensureDir(EXPO_HOME_DIR);
  removeDir(WEB_EXPORT_DIR);

  await runCommand(
    process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
    ['expo', 'export', '--platform', 'web', '--output-dir', WEB_EXPORT_DIR],
    {
      env: {
        ...process.env,
        CI: '1',
        EXPO_NO_TELEMETRY: '1',
        HOME: EXPO_HOME_DIR,
        EXPO_HOME: EXPO_HOME_DIR
      },
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );
}

async function renderOneCapture(page, capture, locale, index, total) {
  const localeDir = path.join(OUT_DIR, locale);
  ensureDir(localeDir);
  ensureDir(DEBUG_DIR);
  const outputPath = path.join(localeDir, `${capture.slug}.png`);
  const url = buildPreviewUrl({
    route: capture.route,
    locale,
    homeState: capture.homeState
  });

  logFile('Capturing', outputPath, index, total);
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  try {
    await page.waitForFunction(
      () => document.body?.dataset?.previewReady === '1',
      null,
      { timeout: 15000 }
    );
  } catch (error) {
    const state = await page
      .evaluate(() => ({
        href: window.location.href,
        title: document.title,
        bodyText: document.body?.innerText?.slice(0, 500) ?? '',
        dataset: { ...document.body?.dataset },
        rootHtml:
          document.querySelector('#root')?.innerHTML?.slice(0, 500) ?? ''
      }))
      .catch(evaluateError => ({ evaluateError: evaluateError.message }));
    const debugBaseName = `${locale}-${capture.slug}`;
    const debugScreenshotPath = path.join(DEBUG_DIR, `${debugBaseName}.png`);
    const debugHtmlPath = path.join(DEBUG_DIR, `${debugBaseName}.html`);
    await page
      .screenshot({ path: debugScreenshotPath, fullPage: true })
      .catch(() => {});
    await fs.promises
      .writeFile(debugHtmlPath, await page.content())
      .catch(() => {});
    throw new Error(
      `Timed out waiting for previewReady at ${url.toString()}: ${JSON.stringify(state)}`
    );
  }
  await page.screenshot({
    path: outputPath,
    fullPage: false
  });
}

async function captureAll() {
  const browser = await chromium.launch(resolveBrowserLaunchOptions());
  const context = await browser.newContext({
    viewport: {
      width: PHONE_WIDTH,
      height: PHONE_HEIGHT
    },
    deviceScaleFactor: SCALE
  });
  const page = await context.newPage();
  page.on('console', message => {
    console.log(`[thumbs] console ${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', error => {
    console.error(`[thumbs] pageerror: ${error.message}`);
  });
  page.on('requestfailed', request => {
    console.error(
      `[thumbs] requestfailed: ${request.url()} ${request.failure()?.errorText ?? ''}`
    );
  });
  await page.route(`${PREVIEW_ORIGIN}/**`, async route => {
    const requestUrl = new URL(route.request().url());
    const normalizedPath = decodeURIComponent(requestUrl.pathname);
    const relativePath =
      normalizedPath === '/' ? 'index.html' : normalizedPath.slice(1);
    const candidatePath = path.resolve(WEB_EXPORT_DIR, relativePath);

    if (
      candidatePath.startsWith(WEB_EXPORT_DIR) &&
      fs.existsSync(candidatePath) &&
      fs.statSync(candidatePath).isFile()
    ) {
      await route.fulfill({
        status: 200,
        contentType:
          CONTENT_TYPES[path.extname(candidatePath).toLowerCase()] ??
          'application/octet-stream',
        body: fs.readFileSync(candidatePath)
      });
      return;
    }

    const fallbackPath = path.join(WEB_EXPORT_DIR, 'index.html');
    await route.fulfill({
      status: 200,
      contentType: CONTENT_TYPES['.html'],
      body: fs.readFileSync(fallbackPath)
    });
  });

  try {
    let current = 0;
    const total = LOCALES.length * CAPTURES.length;

    for (const locale of LOCALES) {
      logStage(`Preparing locale ${locale}`);
      for (const capture of CAPTURES) {
        current += 1;
        await renderOneCapture(page, capture, locale, current, total);
      }
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  const startedAt = Date.now();

  logStage(
    `Starting runtime thumbnail capture to ${path.relative(ROOT, OUT_DIR)}`
  );
  removeDir(OUT_DIR);
  removeDir(DEBUG_DIR);
  ensureDir(OUT_DIR);

  logStage(
    `Exporting real web bundle to ${path.relative(ROOT, WEB_EXPORT_DIR)}`
  );
  await exportWebBundle();

  if (!fs.existsSync(EXPORT_ENTRY_PATH)) {
    throw new Error(`Missing web export entry: ${EXPORT_ENTRY_PATH}`);
  }

  await captureAll();

  const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(2);
  logStage(
    `Completed ${LOCALES.length * CAPTURES.length} runtime thumbnails in ${elapsedSeconds}s`
  );
}

main().catch(error => {
  console.error(`[thumbs] ${error.message}`);
  process.exitCode = 1;
});
