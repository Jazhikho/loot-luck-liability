import fs from "node:fs";
import path from "node:path";
import { copyFile, emptyDir, ensureDir, printButlerHint, productName, releaseDir, run } from "./release-utils.mjs";

const targetDir = path.join(releaseDir, "windows");
const buildDir = path.join(path.dirname(releaseDir), "src-tauri", "target", "release");
const artifactPatterns = [".exe", ".dll", ".pak", ".dat", ".json"];
const excludedExtensions = new Set([".d", ".pdb", ".exp", ".lib"]);

emptyDir(targetDir);
run("npx", ["tauri", "build", "--no-bundle"]);

ensureDir(targetDir);
for (const entry of fs.readdirSync(buildDir, { withFileTypes: true })) {
  if (!entry.isFile()) continue;
  const ext = path.extname(entry.name).toLowerCase();
  if (!artifactPatterns.includes(ext) || excludedExtensions.has(ext)) continue;
  copyFile(path.join(buildDir, entry.name), path.join(targetDir, entry.name));
}

const executablePath = path.join(targetDir, `${productName}.exe`);
if (!fs.existsSync(executablePath)) {
  throw new Error(`Expected Windows executable missing: ${executablePath}`);
}

console.log(`Windows release ready at ${targetDir}`);
printButlerHint("windows");
