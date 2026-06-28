// Renders the built /resume page to public/resume.pdf via headless Chromium.
// Run after `astro build` (the `pnpm pdf` script chains them).
import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = path.join(root, "dist", "resume", "index.html");
const outPath = path.join(root, "public", "resume.pdf");

if (!existsSync(htmlPath)) {
  console.error(`Built résumé not found at ${htmlPath}. Run \`astro build\` first.`);
  process.exit(1);
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
  });
  console.log(`✓ Wrote ${path.relative(root, outPath)}`);
} finally {
  await browser.close();
}
