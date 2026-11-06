# Copilot instructions for CronVert

## Project overview

CronVert is a client-side React 19 single-page application built with Vite. `src/main.jsx` mounts `App`, which composes the presentational components in `src/components/`; there is no backend or server-side application layer. The UI computes the description in the browser as the user types, stores the cron input and theme in `localStorage`, and uses the `light`/`dark` class on the document root to drive CSS variables.

The cron domain logic is a deliberate pipeline under `src/lib/`:

1. `parseField.js` validates one field against supplied bounds and returns a structured field node.
2. `parseCron.js` normalizes whitespace, requires exactly five fields in minute/hour/day-of-month/month/day-of-week order, applies field-specific bounds, and returns the full AST.
3. `formatCron.js` converts only the AST into English; it does not parse raw cron syntax.
4. `cronToText.js` is the public orchestration entry point and returns either the formatted text or the parser error result.

The supported syntax is standard five-field cron with `any`, `exact`, `range`, `list`, and `step` AST nodes. Canonical node shapes and examples live in `docs/cron-ast.md`; keep that document aligned with parser changes.

Styling is Tailwind CSS 4 through `@tailwindcss/vite`. `src/index.css` maps Tailwind theme names to light/dark CSS custom properties, so component classes should use the existing semantic tokens rather than raw colors.

## Commands

Use npm and the committed `package-lock.json`. CI uses Node.js 24 and runs `npm ci`.

```text
npm ci                                      # Install the locked dependencies
npm run dev                                 # Start the Vite development server
npm run build                               # Create a production build in dist/
npm run preview                             # Preview the production build
npm run lint                                # Run Oxlint
npm run lint:fix                            # Apply Oxlint fixes
npm run fmt                                 # Format with Oxfmt
npm run fmt:check                           # Check formatting without changing files
npm test -- --run                            # Run the full Vitest suite once
npm test -- --run src/lib/parseField.test.js # Run one test file once
npm test -- --run src/lib/parseField.test.js -t "step" # Run matching tests by name
npm run doctor                              # Run React Doctor locally
```

Vitest is configured in `vite.config.js` with Node environment and global test APIs. Tests are colocated with implementations under `src/lib/` and use `.test.js` filenames. The required CI order is formatting check, lint, tests, then build. React Doctor runs in a separate advisory workflow for pull requests and pushes to `main`.

## Architecture and conventions

- Keep parser, formatter, and UI responsibilities separate. UI components call `cronToText`; they should not duplicate parsing or formatting rules.
- Preserve the result contract: successful operations return `{ success: true, value: ... }`; failures return `{ success: false, error: ... }`. Field failures from `parseCron.js` include both `error.message` and `error.description`.
- Keep AST values numeric and structured. Use the shapes in `docs/cron-ast.md`; an unbounded `*/step` uses `start: null` and `end: null`.
- Preserve the field bounds: minute `0-59`, hour `0-23`, day of month `1-31`, month `1-12`, and day of week `0-7`. Both `0` and `7` format as Sunday.
- Keep final capitalization and punctuation in `src/lib/utils/formatSentence.js`. Formatter helpers should return phrase fragments, not independently punctuated sentences.
- `formatCron.js` handles special combinations such as unrestricted fields and exact times; extend those rules there rather than in parser code or components.
- Add focused colocated tests for parser/formatter changes, covering both valid AST/text results and relevant invalid-input error objects.
- Follow the repository's ESM style: explicit `.js`/`.jsx` imports, default exports, and double-quoted strings as produced by Oxfmt.
- Use semantic Tailwind tokens such as `bg`, `surface`, `text`, `accent`, `border`, `success`, and `error` so light/dark mode remains consistent. Keep class ordering formatter-compatible.
- Keep `vite.config.js` changes compatible with the React Compiler, Tailwind Vite plugin, `__APP_VERSION__` definition, and Vitest settings.
