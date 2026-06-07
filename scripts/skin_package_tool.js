#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const projectRoot = path.resolve(__dirname, '..');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: filename
  }).outputText;

  module._compile(output, filename);
};

const { runSkinPackagePublishing } = require(
  path.join(projectRoot, 'src/skin/publishingTool.ts')
);

const usage = `Usage:
  pnpm skin:package -- check <package-dir>
  pnpm skin:package -- update <package-dir>

Modes:
  check   Validate manifest asset hashes and packageHash without writing.
  update  Write current asset hashes and canonical packageHash to manifest.json.`;

const printIssues = issues => {
  for (const issue of issues) {
    const pathText = issue.path ? ` (${issue.path})` : '';
    const expectedText = issue.expected ? ` expected=${issue.expected}` : '';
    const actualText = issue.actual ? ` actual=${issue.actual}` : '';

    console.error(
      `- ${issue.code}${pathText}: ${issue.message}${expectedText}${actualText}`
    );
  }
};

const main = async () => {
  const args = process.argv.slice(2);

  if (args[0] === '--') {
    args.shift();
  }

  const [mode, packageDir] = args;

  if (mode === '--help' || mode === '-h') {
    console.log(usage);
    return;
  }

  if ((mode !== 'check' && mode !== 'update') || !packageDir) {
    console.error(usage);
    process.exitCode = 1;
    return;
  }

  const result = await runSkinPackagePublishing({
    mode,
    packageDir: path.resolve(process.cwd(), packageDir)
  });

  if (!result.ok) {
    console.error(`Skin package ${mode} failed: ${result.manifestPath}`);
    printIssues(result.issues);
    process.exitCode = 1;
    return;
  }

  console.log(`Skin package ${mode} passed: ${result.manifestPath}`);

  if (result.packageHash) {
    console.log(`packageHash=${result.packageHash}`);
  }

  if (mode === 'update') {
    console.log(
      result.updated ? 'manifest.json updated' : 'manifest.json unchanged'
    );
  }
};

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
