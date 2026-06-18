#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const defaultDeveloperDir = '/Applications/Xcode.app/Contents/Developer';
const preferredDeviceNames = ['iPhone 17', 'iPhone 16', 'iPhone 15'];

const usage = `Usage:
  pnpm ios:sim [--clear] [--device "iPhone 17"] [--udid <udid>] [-- <expo args>]
  pnpm ios:sim:clear

Options:
  --clear, -c       Clear Metro cache before opening the app.
  --device <name>   Prefer an available simulator by name.
  --udid <udid>     Use a specific simulator UDID.
  --dry-run         Print the selected simulator and Expo command without launching.

Environment:
  IOS_SIMULATOR_NAME      Same as --device.
  IOS_SIMULATOR_UDID      Same as --udid.
  TRUST_EASE_DEVELOPER_DIR Override the Xcode developer directory.

Examples:
  pnpm ios:sim
  pnpm ios:sim:clear
  pnpm ios:sim -- --tunnel
  pnpm ios:sim -- --device "iPhone 17 Pro"`;

const isWindows = process.platform === 'win32';
const executable = name => (isWindows ? `${name}.cmd` : name);

const safeEnv = {
  ...process.env,
  DEVELOPER_DIR: process.env.TRUST_EASE_DEVELOPER_DIR || defaultDeveloperDir
};

delete safeEnv.SDKROOT;

const quote = value => {
  const text = String(value);
  return text.includes(' ') ? `"${text}"` : text;
};

const printCommand = (command, args) => {
  console.log(`[ios:sim] $ ${[command, ...args].map(quote).join(' ')}`);
};

const fail = message => {
  console.error(`[ios:sim] ${message}`);
  process.exit(1);
};

const parseArgs = argv => {
  const options = {
    clear: false,
    deviceName: process.env.IOS_SIMULATOR_NAME,
    dryRun: false,
    expoArgs: [],
    udid: process.env.IOS_SIMULATOR_UDID
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--') {
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      console.log(usage);
      process.exit(0);
    }

    if (arg === '--clear' || arg === '-c') {
      options.clear = true;
      continue;
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--device') {
      options.deviceName = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith('--device=')) {
      options.deviceName = arg.slice('--device='.length);
      continue;
    }

    if (arg === '--udid') {
      options.udid = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg.startsWith('--udid=')) {
      options.udid = arg.slice('--udid='.length);
      continue;
    }

    options.expoArgs.push(arg);
  }

  return options;
};

const run = (command, args, options = {}) => {
  printCommand(command, args);

  const result = spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
    env: safeEnv,
    stdio: options.capture ? 'pipe' : 'inherit'
  });

  if (result.error) {
    fail(result.error.message);
  }

  if (result.status !== 0) {
    if (options.capture) {
      const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
      if (output.trim()) {
        console.error(output.trim());
      }
    }

    fail(`${command} exited with code ${result.status}`);
  }

  return result.stdout || '';
};

const assertMacOS = () => {
  if (process.platform !== 'darwin') {
    fail('iOS Simulator can only be started on macOS.');
  }
};

const loadAvailableDevices = () => {
  run('xcrun', ['--find', 'simctl'], { capture: true });

  const output = run(
    'xcrun',
    ['simctl', 'list', 'devices', 'available', '--json'],
    { capture: true }
  );

  try {
    const parsed = JSON.parse(output);
    return Object.values(parsed.devices || {})
      .flat()
      .filter(device => {
        const isAvailable = device.isAvailable !== false;
        const isIPhone = String(device.name || '').includes('iPhone');
        return isAvailable && isIPhone;
      });
  } catch (error) {
    fail(
      `Unable to parse simulator devices: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  return [];
};

const pickDevice = (devices, options) => {
  if (options.udid) {
    const byUdid = devices.find(device => device.udid === options.udid);
    if (byUdid) {
      return byUdid;
    }

    fail(`No available iPhone simulator matches UDID ${options.udid}.`);
  }

  const bootedDevices = devices.filter(device => device.state === 'Booted');

  if (options.deviceName) {
    const exactBooted = bootedDevices.find(
      device => device.name === options.deviceName
    );
    const exactAvailable = devices.find(
      device => device.name === options.deviceName
    );
    const fuzzyBooted = bootedDevices.find(device =>
      device.name.includes(options.deviceName)
    );
    const fuzzyAvailable = devices.find(device =>
      device.name.includes(options.deviceName)
    );

    const selected =
      exactBooted || exactAvailable || fuzzyBooted || fuzzyAvailable;

    if (selected) {
      return selected;
    }

    fail(`No available iPhone simulator matches "${options.deviceName}".`);
  }

  if (bootedDevices[0]) {
    return bootedDevices[0];
  }

  for (const preferredName of preferredDeviceNames) {
    const preferred = devices.find(device => device.name === preferredName);
    if (preferred) {
      return preferred;
    }
  }

  if (devices[0]) {
    return devices[0];
  }

  fail('No available iPhone simulator was found.');
};

const buildExpoCommand = options => {
  const args = ['exec', 'expo', 'start', '--ios', '--localhost'];

  if (options.clear) {
    args.push('--clear');
  }

  args.push(...options.expoArgs);

  return {
    args,
    command: executable('pnpm')
  };
};

const main = () => {
  const options = parseArgs(process.argv.slice(2));
  assertMacOS();

  const devices = loadAvailableDevices();
  const device = pickDevice(devices, options);
  const expoCommand = buildExpoCommand(options);

  console.log(`[ios:sim] DEVELOPER_DIR=${safeEnv.DEVELOPER_DIR}`);
  console.log('[ios:sim] SDKROOT cleared for this command.');
  console.log(
    `[ios:sim] Selected simulator: ${device.name} (${device.udid}) ${device.state}`
  );

  if (options.dryRun) {
    printCommand(expoCommand.command, expoCommand.args);
    return;
  }

  run('open', ['-a', 'Simulator']);

  if (device.state !== 'Booted') {
    run('xcrun', ['simctl', 'boot', device.udid]);
  }

  run('xcrun', ['simctl', 'bootstatus', device.udid, '-b']);
  run(expoCommand.command, expoCommand.args);
};

main();
