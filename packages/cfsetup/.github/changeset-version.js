const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

// This script is used by the `release.yml` workflow to update the version of the packages being released.
// The standard step is only to run `changeset version` but this does not update the lockfile.
// So we also run `pnpm install`, which does this update.
// This is a workaround until this is handled automatically by `changeset version`.
// See https://github.com/changesets/changesets/issues/421.

function getPkg(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
function setPkg(filePath, newPkg) {
  fs.writeFileSync(filePath, `${JSON.stringify(newPkg, null, '\t')}\n`);
}
function parseVersion(version) {
  // Extract `<major>.<minor>.<patch>` from version (could be a constraint)
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(version);
  assert(match !== null, `Expected ${version} to be <major>.<minor>.<patch>`);
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

const rootPath = path.resolve(__dirname, '..');

function main() {
  // 2. Run standard `changeset version` command to apply changesets, bump
  //    versions, and update changelogs
  execSync('pnpm exec changeset version');

  // 4. Update the lockfile
  console.log(execSync('pnpm install --lockfile-only', { encoding: 'utf8' }));
}

if (require.main === module) main();
