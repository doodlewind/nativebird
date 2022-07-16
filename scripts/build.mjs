import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const __dirname = path.resolve();
const sourcePath = path.posix.join(__dirname, "../dist/promise.mjs");
const targetPath = path.posix.join(__dirname, "../dist/promise.cjs");

execSync(
  "tsc promise.mjs --module commonjs --target esnext --allowJs --outDir dist",
  { stdio: "inherit" }
);

if (!fs.existsSync(sourcePath)) {
  throw new Error("[ERR] build failed");
}

fs.renameSync(sourcePath, targetPath);
