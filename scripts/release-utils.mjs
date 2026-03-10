import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import packageInfo from "../package.json" with { type: "json" };

export const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const releaseDir = path.join(rootDir, "release");
export const version = packageInfo.version;
export const productName = "LootLuckLiability";
export const itchTarget = process.env.ITCH_TARGET || "jazhikho/loot-luck-liability";

export function toPlatformPath(p) {
  return process.platform === "win32" ? p.replace(/\//g, "\\") : p;
}

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    stdio: "inherit",
    shell: process.platform === "win32",
    ...options,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function emptyDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

export function copyDirContents(sourceDir, targetDir) {
  ensureDir(targetDir);
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copyDirContents(sourcePath, targetPath);
    } else {
      ensureDir(path.dirname(targetPath));
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

export function copyFile(source, target) {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function printButlerHint(channel) {
  console.log(`butler push ${toPlatformPath(path.join("release", channel))} ${itchTarget}:${channel}`);
}

export function resolveSdkRoot() {
  const candidates = [
    process.env.ANDROID_SDK_ROOT,
    process.env.ANDROID_HOME,
    path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk"),
    path.join(
      process.env.LOCALAPPDATA || "",
      "Microsoft",
      "WinGet",
      "Packages",
      "Google.PlatformTools_Microsoft.Winget.Source_8wekyb3d8bbwe"
    ),
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}
