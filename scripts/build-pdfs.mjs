import { readdir, mkdir } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mdToPdf } from 'md-to-pdf';
import puppeteer from 'puppeteer';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gamesDir = join(root, 'games');
const pdfDir = join(root, '_site', 'pdf');
const stylesheet = resolve(root, 'assets', 'cheat-sheet.css');

async function main() {
  await mkdir(pdfDir, { recursive: true });
  const executablePath = await puppeteer.executablePath();
  const launchOptions = { executablePath };

  // GitHub Actions and other Linux CI runners block Chrome's sandbox.
  if (process.env.CI) {
    launchOptions.args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ];
  }

  const files = (await readdir(gamesDir))
    .filter((name) => name.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    throw new Error('No game cheat sheets found in games/');
  }

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const inputPath = join(gamesDir, file);
    const dest = join(pdfDir, `${slug}.pdf`);

    await mdToPdf(
      { path: inputPath },
      {
        dest,
        stylesheet,
        page_media_type: 'print',
        launch_options: launchOptions,
        pdf_options: {
          format: 'Letter',
          margin: { top: '0.6in', right: '0.6in', bottom: '0.6in', left: '0.6in' },
          printBackground: true,
        },
      },
    );

    console.log(`Wrote ${dest}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
