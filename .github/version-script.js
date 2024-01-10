/**
 * Update the package.json version property for the given package
 *
 * Usage:
 *
 * ```
 * node ./.github/version-script.js <package-name>
 * ```
 *
 * `<package-name>` defaults to `cfsetup` if not provided.
 */

const { existsSync, readFileSync, writeFileSync } = require("node:fs");
const { execSync } = require("node:child_process");
const { join } = require('node:path')
const process = require('node:process');

try {
  /** packageName {string} **/
  let packageName = getArgs()[0] ?? "cfsetup";
  if(/^@.*\/.*/.test(packageName)) {
    packageName = packageName.split('/')[1]
  }
  /** packageJsonPath {string} **/
  let packageJsonPath;
  if (existsSync(join(process.cwd(), 'packages', packageName))) {
    packageJsonPath = join(process.cwd(), 'packages', packageName, 'package.json');
  } else if (existsSync(join(process.cwd(), 'pages_apps', packageName))){
    packageJsonPath = join(process.cwd(), 'pages_apps', packageName, 'package.json')
  } else if (existsSync(join(process.cwd(), 'worker_apps', packageName))) {
    packageJsonPath = join(process.cwd(), 'worker_apps', packageName, 'package.json')
  }
  if (!packageJsonPath) {
    throw Error("Package not found");
  }
  const pkg = JSON.parse(readFileSync(packageJsonPath));
  const stdout = execSync("git rev-parse --short HEAD", { encoding: "utf8" });
  pkg.version = "0.0.0-" + stdout.trim();
  writeFileSync(packageJsonPath, JSON.stringify(pkg, null, "\t") + "\n");
} catch (error) {
  console.error(error);
  process.exit(1);
}

/**
 * Get the command line args, stripping `node` and script filename, etc.
 */
function getArgs() {
  const args = Array.from(process.argv);
  while (args.shift() !== module.filename) {}
  return args;
}
