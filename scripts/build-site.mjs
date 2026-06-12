import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gamesDir = join(root, 'games');
const siteDir = join(root, '_site');
const assetsDir = join(siteDir, 'assets');

marked.setOptions({ gfm: true });

function pageShell({ title, bodyHtml, backLink }) {
  const header = backLink
    ? `<header class="site-header"><a href="${backLink}">← All cheat sheets</a></header>`
    : `<header class="site-header"><strong>Board Game Cheat Sheets</strong></header>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="assets/cheat-sheet.css">
</head>
<body>
  ${header}
  <main>${bodyHtml}</main>
</body>
</html>
`;
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function parseTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (!match) {
    throw new Error('Missing # title heading');
  }
  return match[1].trim();
}

async function loadGames() {
  const files = (await readdir(gamesDir))
    .filter((name) => name.endsWith('.md'))
    .sort();

  const games = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const markdown = await readFile(join(gamesDir, file), 'utf8');
    const title = parseTitle(markdown);
    games.push({ slug, title, markdown });
  }

  return games.sort((a, b) => a.title.localeCompare(b.title));
}

async function main() {
  await mkdir(assetsDir, { recursive: true });
  await copyFile(join(root, 'assets', 'cheat-sheet.css'), join(assetsDir, 'cheat-sheet.css'));

  const games = await loadGames();
  if (games.length === 0) {
    throw new Error('No game cheat sheets found in games/');
  }

  const indexItems = games
    .map(({ slug, title }) => `    <li><a href="${slug}.html">${escapeHtml(title)}</a></li>`)
    .join('\n');

  const indexHtml = pageShell({
    title: 'Board Game Cheat Sheets',
    bodyHtml: `<h1>Board Game Cheat Sheets</h1>\n<ul class="index-list">\n${indexItems}\n</ul>`,
    backLink: null,
  });

  await writeFile(join(siteDir, 'index.html'), indexHtml);

  for (const { slug, title, markdown } of games) {
    const bodyHtml = marked.parse(markdown);
    const html = pageShell({
      title,
      bodyHtml,
      backLink: 'index.html',
    });
    await writeFile(join(siteDir, `${slug}.html`), html);
  }

  console.log(`Built ${games.length} cheat sheet(s) in _site/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
