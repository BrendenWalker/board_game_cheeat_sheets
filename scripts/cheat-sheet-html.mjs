import { marked } from 'marked';

marked.setOptions({ gfm: true });

const SECTION_CLASSES = [
  'sheet-section--setup',
  'sheet-section--play',
  'sheet-section--additional-details',
];

const MAIN_SECTION_HEADING = /^## \*\*.+\*\*\s*$/gm;

/** Letter page with margins used for PDF and print layout checks. */
export const PRINT_LAYOUT = {
  pageHeightPx: 11 * 96,
  marginInches: 0.5,
  marginHorizontalInches: 0.25,
  get contentHeightPx() {
    return this.pageHeightPx - this.marginInches * 2 * 96;
  },
};

export function wrapSheetSections(markdown) {
  const matches = [...markdown.matchAll(MAIN_SECTION_HEADING)];

  if (matches.length < 3) {
    throw new Error('Expected at least Setup, Play, and Additional details sections');
  }

  let result = '';
  const lead = markdown.slice(0, matches[0].index).trim();

  if (lead) {
    result += `<div class="sheet-lead">\n\n${lead}\n\n</div>\n\n`;
  }

  for (let i = 0; i < matches.length; i += 1) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const sectionContent = markdown.slice(start, end).trim();
    const sectionClass = SECTION_CLASSES[i] ?? 'sheet-section--extra';
    result += `<section class="sheet-section ${sectionClass}">\n\n${sectionContent}\n\n</section>\n\n`;
  }

  return result.trim();
}

export function markdownToSheetHtml(markdown) {
  return marked.parse(wrapSheetSections(markdown));
}

export function printPreviewShell(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Print layout check</title>
</head>
<body>
  <main>${bodyHtml}</main>
</body>
</html>`;
}
