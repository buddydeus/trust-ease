# Build Plan: add-remote-skin-source-adapter

## Source

- Proposal: `openspec/changes/add-remote-skin-source-adapter/proposal.md`
- Design: `openspec/changes/add-remote-skin-source-adapter/design.md`
- Spec: `openspec/changes/add-remote-skin-source-adapter/specs/skin-downloader-runtime/spec.md`
- Tasks: `openspec/changes/add-remote-skin-source-adapter/tasks.md`
- Plan-ready: `openspec/changes/add-remote-skin-source-adapter/plan-ready.md`

## Checklist

- [x] Define remote adapter contracts in `src/skin/remoteSourceAdapter.ts`.
- [x] Add focused tests in `tests/skin/remote-source-adapter.test.ts`.
- [x] Implement manifest fetch, asset staging, progress, retry, and cancellation.
- [x] Prove integration with `downloadSkinPackage`.
- [x] Update README/AGENTS skin runtime boundaries.
- [x] Mark OpenSpec tasks complete.
- [x] Run OpenSpec, type, skin, structure, and `.ai/` verification.

## Commands

```bash
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin/remote-source-adapter.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/skin --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm test tests/support/source-structure.test.ts --runInBand
npm.cmd exec --package=pnpm@11.5.0 -- pnpm check:type
npm.cmd exec -- openspec validate add-remote-skin-source-adapter --strict
git diff -- .ai
```
