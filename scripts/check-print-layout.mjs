import { readdir, readFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import {
  markdownToSheetHtml,
  printPreviewShell,
  PRINT_LAYOUT,
} from './cheat-sheet-html.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gamesDir = join(root, 'games');
const stylesheet = resolve(root, 'assets', 'cheat-sheet.css');

async function measureSheet(page, markdown) {
  const bodyHtml = markdownToSheetHtml(markdown);
  const html = printPreviewShell(bodyHtml);

  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ path: stylesheet });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMediaType('print');

  return page.evaluate((maxHeight) => {
    function blockHeight(selector) {
      const node = document.querySelector(selector);
      return node ? node.getBoundingClientRect().height : 0;
    }

    const setupBlock =
      blockHeight('.sheet-lead') + blockHeight('.sheet-section--setup');
    const playBlock = blockHeight('.sheet-section--play');

    return {
      setupBlock,
      playBlock,
      maxHeight,
      setupOverflow: setupBlock > maxHeight,
      playOverflow: playBlock > maxHeight,
    };
  }, PRINT_LAYOUT.contentHeightPx);
}

async function main() {
  const files = (await readdir(gamesDir))
    .filter((name) => name.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    throw new Error('No game cheat sheets found in games/');
  }

  const executablePath = await puppeteer.executablePath();
  const launchOptions = { executablePath, headless: true };

  if (process.env.CI) {
    launchOptions.args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ];
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setViewport({ width: 816, height: 1056 });

  const overflows = [];

  for (const file of files) {
    const markdown = await readFile(join(gamesDir, file), 'utf8');
    const result = await measureSheet(page, markdown);
    const label = file.replace(/\.md$/, '');

    if (result.setupOverflow) {
      overflows.push(
        `${label}: Setup block is ${Math.round(result.setupBlock)}px (limit ${Math.round(result.maxHeight)}px)`,
      );
    }

    if (result.playOverflow) {
      overflows.push(
        `${label}: Play block is ${Math.round(result.playBlock)}px (limit ${Math.round(result.maxHeight)}px)`,
      );
    }
  }

  await browser.close();

  if (overflows.length === 0) {
    console.log('Print layout OK — Setup and Play fit within one Letter page each.');
    return;
  }

  console.error('Print layout overflow detected:\n');
  for (const line of overflows) {
    console.error(`  - ${line}`);
  }
  console.error(`
Ask a human how to proceed. Do not trim or restyle content without approval.
Options to present:
  - Shorten bullets or move reference material to Additional details
  - Condense or omit Turn step details (keep the numbered turn summary)
  - Approve tighter global print CSS (margins, font size, list spacing)
  - Approve two-column layout for Setup and/or Play
  - Accept multi-page Setup or Play for this game
`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
