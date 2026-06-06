const { spawnSync } = require('node:child_process');
const path = require('node:path');

const isWindows = process.platform === 'win32';
const includeRuntime = process.argv.includes('--include-runtime');
const npmCachePath = path.join(process.cwd(), '.npm-cache');

const executable = name => (isWindows && name !== 'openspec' ? `${name}.cmd` : name);
const systemNpm = isWindows ? 'C:\\Program Files\\nodejs\\npm.cmd' : 'npm';
const quoteWindowsCommandArg = value =>
  `"${String(value).replace(/"/g, '""')}"`;

const resolveSpawnCommand = (command, args) => {
  if (!isWindows) {
    return {
      command,
      args,
      shell: false
    };
  }

  return {
    command: [command, ...args].map(quoteWindowsCommandArg).join(' '),
    args: [],
    shell: true
  };
};

const checks = [
  {
    label: 'TypeScript strict check',
    command: executable('pnpm'),
    args: ['check:type']
  },
  {
    label: 'Locale alignment check',
    command: executable('pnpm'),
    args: ['check:local']
  },
  {
    label: 'Single-device MVP Jest coverage',
    command: executable('pnpm'),
    args: [
      'test',
      'tests/store/trust',
      'tests/app',
      'tests/onboarding',
      'tests/pages/welcome',
      'tests/pages/items',
      'tests/pages/helpers',
      'tests/pages/trigger-state',
      'tests/pages/home',
      'tests/pages/my',
      'tests/skin',
      '--runInBand'
    ]
  },
  {
    label: 'Remote skin QA fixture',
    command: executable('pnpm'),
    args: ['skin:qa:remote']
  },
  {
    label: 'OpenSpec strict validation',
    command: systemNpm,
    args: [
      'exec',
      '--package=@fission-ai/openspec',
      '--',
      'openspec',
      'validate',
      '--all',
      '--strict'
    ]
  }
];

if (includeRuntime) {
  checks.push({
    label: 'Runtime screenshot QA',
    command: executable('pnpm'),
    args: ['check:qa:runtime']
  });
}

const quote = value => (value.includes(' ') ? `"${value}"` : value);

for (const check of checks) {
  console.log(`\n[check:qa] ${check.label}`);
  console.log(
    `[check:qa] ${check.command} ${check.args.map(quote).join(' ')}`
  );

  const resolved = resolveSpawnCommand(check.command, check.args);
  const result = spawnSync(resolved.command, resolved.args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      CI: process.env.CI || 'true',
      npm_config_cache: process.env.npm_config_cache || npmCachePath,
      NPM_CONFIG_CACHE: process.env.NPM_CONFIG_CACHE || npmCachePath
    },
    stdio: 'inherit',
    shell: resolved.shell
  });

  if (result.error) {
    console.error(`[check:qa] Failed to start ${check.label}`);
    console.error(result.error.message);
    process.exitCode = 1;
    break;
  }

  if (result.status !== 0) {
    console.error(
      `[check:qa] ${check.label} failed with exit code ${result.status}`
    );
    process.exitCode = 1;
    break;
  }
}

if (!process.exitCode) {
  console.log(
    includeRuntime
      ? '\n[check:qa] Deterministic and runtime QA passed.'
      : '\n[check:qa] Deterministic QA passed. Run pnpm check:qa:runtime before frontend visual QA.'
  );
}
