import fs from "node:fs";
import path from "node:path";
import {
  copyFile,
  emptyDir,
  printButlerHint,
  releaseDir,
  requireEnv,
  resolveJavaHome,
  resolveSdkRoot,
  run,
  version,
} from "./release-utils.mjs";

const targetDir = path.join(releaseDir, "android");
const projectRoot = path.dirname(releaseDir);
const apkOutputDir = path.join(projectRoot, "android", "app", "build", "outputs", "apk", "release");

function ensureAndroidSdkReady() {
  const sdkRoot = resolveSdkRoot();
  if (!sdkRoot) {
    throw new Error("Android SDK root not found. Install Android Studio/SDK and set ANDROID_SDK_ROOT if needed.");
  }

  const requiredDirs = ["platform-tools", "platforms", "build-tools"];
  for (const dir of requiredDirs) {
    if (!fs.existsSync(path.join(sdkRoot, dir))) {
      throw new Error(`Android SDK is incomplete. Missing ${dir} under ${sdkRoot}. Open Android Studio once and install the SDK platform/build-tools.`);
    }
  }

  process.env.ANDROID_SDK_ROOT = sdkRoot;
  process.env.ANDROID_HOME = sdkRoot;
  return sdkRoot;
}

emptyDir(targetDir);
ensureAndroidSdkReady();

const javaHome = resolveJavaHome();
if (javaHome) {
  process.env.JAVA_HOME = javaHome;
  process.env.PATH = `${path.join(javaHome, "bin")}${path.delimiter}${process.env.PATH || ""}`;
}

const keystorePath = requireEnv("ANDROID_KEYSTORE_PATH");
const keystorePassword = requireEnv("ANDROID_KEYSTORE_PASSWORD");
const keyAlias = requireEnv("ANDROID_KEY_ALIAS");
const keyAliasPassword = requireEnv("ANDROID_KEY_ALIAS_PASSWORD");

if (!fs.existsSync(keystorePath)) {
  throw new Error(`Android keystore not found: ${keystorePath}`);
}

run("npm", ["run", "build"]);
run("npx", ["cap", "sync", "android"]);
run("npx", [
  "cap",
  "build",
  "android",
  "--androidreleasetype",
  "APK",
  "--keystorepath",
  keystorePath,
  "--keystorepass",
  keystorePassword,
  "--keystorealias",
  keyAlias,
  "--keystorealiaspass",
  keyAliasPassword,
]);

if (!fs.existsSync(apkOutputDir)) {
  throw new Error(`Android APK output folder missing: ${apkOutputDir}`);
}

const apkCandidates = fs
  .readdirSync(apkOutputDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".apk"))
  .map((entry) => path.join(apkOutputDir, entry.name));

if (apkCandidates.length === 0) {
  throw new Error("No release APK found after Capacitor build.");
}

apkCandidates.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
copyFile(apkCandidates[0], path.join(targetDir, `${version}.apk`));

console.log(`Android release ready at ${targetDir}`);
printButlerHint("android");
