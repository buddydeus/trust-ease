# macOS And iOS Device Testing Handoff

This document is the handoff for continuing Trust Ease on macOS and producing an
iOS build for physical-device QA.

## Current State

- App stack: Expo 55, Expo Router, React Native 0.85, React 19.
- Package manager: `pnpm@11.5.0`.
- Main entry: `expo-router/entry`.
- Current branch: `refactor/all`.
- OpenSpec state: no active changes; 17 specs pass strict validation.
- QA gate:
  - `pnpm check:qa`
  - `pnpm check:qa:runtime`
  - `pnpm check:qa:all`
- iOS build configuration is not complete yet:
  - `app.json` does not yet define `ios.bundleIdentifier`.
  - `eas.json` does not yet exist.

## macOS Setup

Install or verify:

- Node.js 22 or newer.
- Corepack.
- Xcode from the Mac App Store.
- Xcode Command Line Tools.
- Apple Developer account if building installable iOS packages.

Recommended first commands:

```bash
node --version
corepack --version
xcodebuild -version
corepack enable
corepack pnpm install --frozen-lockfile
```

If dependency install fails because the local network cannot reach npm, use a
temporary registry override only:

```bash
pnpm --config.registry=https://registry.npmmirror.com install
```

Do not commit registry mirror settings.

## Baseline Verification

Run these before creating any iOS package:

```bash
pnpm check:qa
pnpm check:qa:runtime
npm exec --package=@fission-ai/openspec -- openspec validate --all --strict
```

Expected OpenSpec result:

```text
17 passed, 0 failed
```

## Local Development Preview

Start Expo:

```bash
pnpm start
```

Use:

- `w` for Web preview.
- Expo Go on iPhone for a lightweight preview when native modules are supported
  by the Expo Go runtime.

For production-like physical-device QA, use an iOS build instead of relying only
on Expo Go.

## Required iOS Configuration

Before iOS device builds, add an iOS bundle identifier to `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.buddydeus.trustease",
      "supportsTablet": false
    }
  }
}
```

The identifier must be unique in the Apple Developer account. Use the final
brand/domain identifier if it is already decided.

For EAS internal distribution, add `eas.json`:

```json
{
  "cli": {
    "version": ">= 19.1.0",
    "appVersionSource": "local"
  },
  "build": {
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

Recommended OpenFlow change id for this setup:

```text
add-ios-device-testing-build-profile
```

## Option A: EAS Build For Physical iPhone QA

This is the recommended path when the build machine does not have a stable local
iOS signing setup.

Commands:

```bash
npm install --global eas-cli
eas login
eas whoami
eas build:configure
eas device:create
eas device:list
eas build --platform ios --profile preview
```

Notes:

- `preview` should use internal distribution.
- iOS internal distribution requires registered test devices.
- If a new device is added after a profile was created, refresh the ad hoc
  provisioning profile before rebuilding:

```bash
eas build --platform ios --profile preview --non-interactive --refresh-ad-hoc-provisioning-profile
```

The resulting build page provides an install link for registered iPhones.

## Option B: Local Xcode Build On macOS

Use this when Xcode, signing, and a connected iPhone are ready:

```bash
pnpm build:ios
```

This runs:

```bash
expo run:ios
```

Local iOS builds still require Apple signing configuration. If local signing
becomes noisy, prefer EAS internal distribution for QA.

## QA Scope On iPhone

Test the single-device MVP only. Do not expect backend, account, cloud sync,
push, SMS, email, or remote helper workflows.

Core flows:

- First launch opens `welcome`.
- Start setup writes the formal report record and navigates to `home`.
- Reopening the app should not repeat `welcome`.
- Create, edit, and archive trust items.
- Create, edit, and archive helpers.
- Assign helpers to trust items.
- Run trigger simulation: start, pause, resume, reset.
- Review home readiness summary.
- Export and import local backup.
- Review skin runtime status on the My page.
- Check `zh-CN`, `zh-TW`, and `en-US` rendering.
- Check iOS file picker, sharing, local storage, and app lifecycle behavior.

## Bug Reporting

Record each issue under `.bugs/*.md`.

Required fields:

- Problem description.
- Reproduction path.
- Suspected location.
- Suggested fix.
- Verification method.

After fixing an issue, rerun at least:

```bash
pnpm check:qa
pnpm check:qa:runtime
```

Use focused Jest tests when the issue is local to a page, store, skin, or route.
