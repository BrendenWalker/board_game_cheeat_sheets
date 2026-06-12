# Board Game Cheat Sheets

Markdown quick-reference cheat sheets for board games. Each file distills setup, turn flow, and key details into a scannable format for use at the table.

## Board Game Index

- [Pandemic](games/pandemic.md)
- [Pandemic: Reign of Cthulhu](games/reign-of-cthulhu.md)
- [Pandemic: Rising Tide](games/rising-tide.md)

## Repository structure

```text
board_game_cheeat_sheets/
├── README.md              # This file — human onboarding
├── AGENTS.md              # Instructions for AI tooling
├── .cursor/rules/         # Cursor-specific authoring rules
├── templates/
│   └── cheat-sheet.md     # Canonical skeleton for new games
└── games/
    └── <game-slug>.md     # One cheat sheet per game
```

## Cheat sheet format

Every cheat sheet uses three top-level sections:

### 1. Setup

- **Board setup** — place board, tiles, tokens, decks, market, etc.
- **Player setup** — starting hands, resources, pieces, hidden info
- **Choosing starting player** — how first player is determined

### 2. Play

- **Step-by-step turn** — numbered list of what happens on one turn, in order
- **Commonly overlooked rules** — easy-to-miss rules that affect play (omit if none)
- **Turn step details** — expand only steps that need it (action lists, limits, costs, exceptions)

### 3. Additional details

Scoring, end game triggers, variants, edge cases, and quick-reference tables.

### Main section headings

The three top-level sections (`Setup`, `Play`, `Additional details`) use a bold `##` heading only:

```markdown
## **Setup**
```

Do **not** add `---` beneath main section headings — GitHub already renders a line under headings, and an extra rule looks redundant.

Use the same pattern for **Play** and **Additional details**.

### Style

Cheat sheets are **quick-reference**, not full rulebooks.

| Do | Don't |
|----|-------|
| Terse bullets, imperative voice | Long paragraphs or tutorial prose |
| Sub-bullets for each part of a multi-step item | Chaining parts with semicolons or em dashes on one line |
| Official rulebook terminology | Invented shorthand |
| Include player count / edition only when it changes setup or play | Repeat the entire rulebook |

**Multi-part steps** — use a parent bullet with indented sub-bullets:

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

**Good turn summary:**

```markdown
### Step-by-step turn
1. Draw 2 cards.
2. Play up to 1 action card.
3. Buy up to 1 card from the market.
```

**Too verbose:**

```markdown
### Step-by-step turn
On your turn, you will first draw two cards from your deck. After drawing,
you may choose to play one action card from your hand if you wish...
```

## Adding a game

1. Copy [`templates/cheat-sheet.md`](templates/cheat-sheet.md).
2. Save as `games/<game-slug>.md` (lowercase, hyphenated — e.g. `games/ticket-to-ride.md`).
3. Fill in each section. Omit subsections that do not apply.
4. Add **Turn step details** only for steps that need expansion (e.g. listing available actions).
5. Add a link to the new cheat sheet in the [Board Game Index](#board-game-index) above (use the game's `#` title as link text; keep the list sorted alphabetically by title).

## AI-assisted authoring

- **[AGENTS.md](AGENTS.md)** — tool-agnostic workflow and quality checklist for any AI agent.
- **[.cursor/rules/cheat-sheet-authoring.mdc](.cursor/rules/cheat-sheet-authoring.mdc)** — Cursor rule that applies when editing files in `games/`.

When asking an AI to author a cheat sheet, point it at `AGENTS.md` and the template.

## Contributing

- Match the template headings and section order.
- Keep changes focused on one game or one doc improvement per change.
- Prefer accuracy over completeness — a short correct sheet beats a long inaccurate one.
