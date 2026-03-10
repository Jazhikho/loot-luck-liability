import path from "node:path";
import { copyDirContents, emptyDir, printButlerHint, releaseDir, run } from "./release-utils.mjs";

const targetDir = path.join(releaseDir, "web");
const distDir = path.join(path.dirname(releaseDir), "dist");

emptyDir(targetDir);
run("npm", ["run", "build"]);
copyDirContents(distDir, targetDir);

console.log(`Web release ready at ${targetDir}`);
printButlerHint("web");
