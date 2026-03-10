import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ensureDir, rootDir, run } from "./release-utils.mjs";

const sourceIcon = path.join(rootDir, "LLL.png");
const publicDir = path.join(rootDir, "public");
const androidResDir = path.join(rootDir, "android", "app", "src", "main", "res");
const androidBackground = "#0f766e";
const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

const launcherSizes = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const splashPortraitSizes = {
  mdpi: [320, 480],
  hdpi: [480, 800],
  xhdpi: [720, 1280],
  xxhdpi: [960, 1600],
  xxxhdpi: [1280, 1920],
};

if (!fs.existsSync(sourceIcon)) {
  throw new Error(`Missing source icon: ${sourceIcon}`);
}

ensureDir(publicDir);

async function writePng(outputPath, size, options = {}) {
  await sharp(sourceIcon)
    .resize(size, size, {
      fit: options.fit || "contain",
      background: options.background || transparent,
    })
    .png()
    .toFile(outputPath);
}

async function writeForeground(outputPath, size) {
  const innerSize = Math.max(1, Math.round(size * 0.72));
  const iconBuffer = await sharp(sourceIcon)
    .resize(innerSize, innerSize, { fit: "contain", background: transparent })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: transparent,
    },
  })
    .composite([{ input: iconBuffer, gravity: "center" }])
    .png()
    .toFile(outputPath);
}

async function writeSplash(outputPath, width, height) {
  const iconSize = Math.max(1, Math.round(Math.min(width, height) * 0.45));
  const iconBuffer = await sharp(sourceIcon)
    .resize(iconSize, iconSize, { fit: "contain", background: transparent })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: androidBackground,
    },
  })
    .composite([{ input: iconBuffer, gravity: "center" }])
    .png()
    .toFile(outputPath);
}

run("npx", ["tauri", "icon", "LLL.png", "-o", path.join("src-tauri", "icons")]);

await writePng(path.join(publicDir, "favicon.png"), 128);

for (const [density, size] of Object.entries(launcherSizes)) {
  const mipmapDir = path.join(androidResDir, `mipmap-${density}`);
  ensureDir(mipmapDir);
  await writePng(path.join(mipmapDir, "ic_launcher.png"), size);
  await writePng(path.join(mipmapDir, "ic_launcher_round.png"), size);
  await writeForeground(path.join(mipmapDir, "ic_launcher_foreground.png"), size);
}

await writeSplash(path.join(androidResDir, "drawable", "splash.png"), 320, 480);

for (const [density, [width, height]] of Object.entries(splashPortraitSizes)) {
  const portraitDir = path.join(androidResDir, `drawable-port-${density}`);
  const landscapeDir = path.join(androidResDir, `drawable-land-${density}`);
  ensureDir(portraitDir);
  ensureDir(landscapeDir);
  await writeSplash(path.join(portraitDir, "splash.png"), width, height);
  await writeSplash(path.join(landscapeDir, "splash.png"), height, width);
}
