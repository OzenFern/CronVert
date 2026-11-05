# Copilot instructions for CronVert

## Project overview

CronVert is a client-side React 19 single-page application built with Vite. The browser UI is mounted from `src/main.jsx` and currently composes the header/theme controls and cron input through `src/App.jsx`; there is no backend or server-side application layer.

The cron domain logic is intentionally separated into a pipeline under `src/lib/`:

1. `parseField.js` parses and validates one cron field into a structured AST.
2. `parseCron.js` normalizes whitespace, enforces exactly five fields, applies field-specific ranges, and returns the five-field parsed object.
3. `formatCron.js` converts that AST into human-readable English, using the utilities in `src/lib/utils/`.
4. `cronToText.js` is the public orchestration entry point that returns either `{ success: true, value }` or the parser's error result.

The supported cron format is the standard five-field form: minute, hour, day of month, month, and day of week. The AST field types are `any`, `exact`, `range`, `list`, and `step`; the canonical shapes and field ranges are documented in `docs/cron-ast.md`.

Styling uses Tailwind CSS 4 through the Vite plugin. `src/index.css` defines the Tailwind theme mappings and light/dark design tokens as CSS custom properties. The theme toggle applies a `light` or `dark` class to the document root and persists the selection in `localStorage`.

## Commands

Use npm with the committed `package-lock.json`. CI uses Node.js 24 and `npm ci`.

```text
npm run dev                 # Start the Vite development server
npm run build               # Create a production build
npm run preview             # Preview the production build locally
npm run lint                # Run Oxlint
npm run lint:fix            # Apply Oxlint fixes
npm run fmt                 # Format with Oxfmt
npm run fmt:check           # Check formatting without changing files
npm test -- --run           # Run the full Vitest suite once
```

The test environment is Node and Vitest globals are enabled in `vite.config.js`. Tests are colocated with the implementation, primarily under `src/lib/`, and use `.test.js` filenames.

## Repository conventions

- Keep parser, formatter, and UI responsibilities separate. Do not make the formatter parse raw cron syntax or make UI components duplicate domain logic.
- Preserve the parser result contract: successful operations return `{ success: true, value: ... }`; validation failures return `{ success: false, error: ... }`, with field-specific errors from `parseCron.js` carrying both `message` and `description`.
- Keep parsed values numeric and structured. Do not replace AST objects with raw strings; use the shapes in `docs/cron-ast.md`, including `null` bounds for `*/step`.
- Keep natural-language punctuation and capitalization centralized in `formatSentence`; helper formatters should return phrase fragments without adding their own final punctuation.
- Use the existing field-specific bounds: minute `0-59`, hour `0-23`, day of month `1-31`, month `1-12`, and day of week `0-7` (where both `0` and `7` mean Sunday).
- Follow the existing JavaScript ESM style (`"type": "module"`), `.jsx` components, default exports, and double-quoted imports/strings as produced by Oxfmt.
- Prefer the existing Tailwind theme tokens (`bg`, `surface`, `text`, `accent`, `border`, `success`, `error`, and related variants) over hard-coded colors so light/dark mode remains consistent. Keep Tailwind class ordering formatter-compatible.
- Add or update focused colocated Vitest tests when changing parser or formatter behavior, including both successful AST/text results and invalid-input error cases where applicable.
- Keep formatting and lint configuration aligned with `.oxfmtrc.json` and `.oxlintrc.json`; the CI workflow runs formatting check, lint, tests, and build in that order.
