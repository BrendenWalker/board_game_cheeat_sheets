# AI Agent Instructions — Board Game Cheat Sheets

Instructions for AI tooling (Cursor, Copilot, Claude Code, etc.) authoring cheat sheets in this repository.

## Repository purpose

This repo hosts markdown cheat sheets for board games. Each file is a **quick-reference** for use at the table — not a full rulebook rewrite.

## File layout

- **Output location:** `games/<game-slug>.md`
- **Slug format:** lowercase, hyphenated (e.g. `ticket-to-ride`, `wingspan`)
- **Template:** [`templates/cheat-sheet.md`](templates/cheat-sheet.md) — copy this structure exactly

## Required section hierarchy

Every cheat sheet must use these three top-level sections in order:

### 1. Setup

| Subsection | Content |
|------------|---------|
| Board setup | Place board, tiles, tokens, decks, market, supply, etc. |
| Player setup | Starting hands, resources, pieces, hidden information |
| Choosing starting player | Method for determining first player |

### 2. Play

| Subsection | Content |
|------------|---------|
| Step-by-step turn | Numbered list — one full turn in order |
| Commonly overlooked rules | Easy-to-miss rules that affect turn flow — **immediately after** step-by-step turn; omit if none |
| Turn step details | Subsections per step **only when needed** — action lists, limits, costs, exceptions |

### 3. Additional details

Scoring, end game conditions, variants, edge cases, quick-reference tables.

## Authoring workflow

1. **Read the template** — [`templates/cheat-sheet.md`](templates/cheat-sheet.md)
2. **Research the rules** — use official rulebooks; note player count and edition only when they change setup or play
3. **Draft the cheat sheet** — save to `games/<game-slug>.md`
4. **Update the Board Game Index** — in [`README.md`](README.md), add a bullet link under **Board Game Index** using the cheat sheet's `#` title as link text and `games/<game-slug>.md` as the path; keep entries sorted alphabetically by title
5. **Self-check** — run through the quality checklist below before finishing

### Board Game Index format

```markdown
- [Game Title](games/game-slug.md)
```

When removing a cheat sheet, remove its index entry as well.

## Writing style

- Terse bullets, imperative voice, no fluff
- **Main section headings** — `## **Setup**`, `## **Play**`, `## **Additional details**`, each followed by **one** `---` line beneath. No line above the heading.
- **Multi-part steps use sub-bullets** — when a bullet has multiple parts, make it a parent bullet with indented sub-bullets; do not chain parts with semicolons or em dashes on one line
- Use official rulebook terminology
- Omit subsections that do not apply to the game
- Include **Turn step details** only when a turn step needs expansion
- Do not duplicate prose between **Step-by-step turn** and **Turn step details** — summary in the numbered list, detail in subsections

### Multi-part step example

```markdown
- **Initial infection:**
  - Shuffle Infection deck.
  - Draw 3 cities → place 3 cubes on each.
  - Draw 3 more → place 2 cubes on each.
  - Draw 3 more → place 1 cube on each.
  - Discard those 9 cards to the Infection discard pile.

- **Player deck:**
  - Choose difficulty — Introductory 4 / Standard 5 / Heroic 6 Epidemic cards.
  - Split Player deck into that many equal piles.
  - Shuffle 1 Epidemic into each pile.
  - Stack piles to form the draw deck.
```

## Quality checklist

Before finishing, verify:

- [ ] All three top-level sections present: Setup, Play, Additional details
- [ ] Main sections use `## **Title**` plus one `---` line beneath (no line above)
- [ ] Setup covers board setup, player setup, and choosing starting player
- [ ] Play has an ordered, numbered turn flow
- [ ] Commonly overlooked rules (if any) appear after Step-by-step turn, before Turn step details
- [ ] Turn step details exist only where a step needs expansion
- [ ] Additional details covers scoring and end game (if applicable)
- [ ] No duplicate prose between turn summary and step details
- [ ] Multi-part steps use parent bullets with sub-bullets (not semicolon chains)
- [ ] Filename is `games/<game-slug>.md` with correct slug format
- [ ] README **Board Game Index** includes a link to the new cheat sheet (alphabetical by title)
- [ ] Content is accurate and concise — quick-reference, not tutorial

## Example turn structure

```markdown
### Step-by-step turn

1. Draw 2 cards.
2. Play up to 1 action card.
3. Buy up to 1 card from the market.
4. Discard down to 7 cards.

### Turn step details

#### Play action card

- **+2 Actions** — take 2 more actions this turn
- **+1 Buy** — buy 1 additional card from the market
- **+2 Coins** — gain 2 coins this turn
```

Only add `####` subsections under **Turn step details** for steps that need this level of detail.
