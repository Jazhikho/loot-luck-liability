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
  const result =
    process.platform === "win32"
      ? spawnSync("cmd.exe", ["/d", "/s", "/c", [command, ...args].map(quoteWindowsArg).join(" ")], {
          cwd: rootDir,
          stdio: "inherit",
          shell: false,
          ...options,
        })
      : spawnSync(command, args, {
          cwd: rootDir,
          stdio: "inherit",
          shell: false,
          ...options,
        });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function quoteWindowsArg(value) {
  if (value.length === 0) return '""';
  if (!/[\s"&()^<>|]/.test(value)) return value;
  return `"${value.replace(/(\\*)"/g, "$1$1\\\"").replace(/(\\+)$/g, "$1$1")}"`;
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
    path.join("D:\\", "Android"),
    path.join(process.env.LOCALAPPDATA || "", "Android", "Sdk"),
    path.join("C:\\", "Program Files (x86)", "Android", "android-sdk"),
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

export function resolveJavaHome() {
  const candidates = [process.env.JAVA_HOME, path.join("C:\\", "Program Files", "Android", "Android Studio", "jbr")].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}
