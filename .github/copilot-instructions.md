# Copilot Instructions for CronVert

## Project Overview

CronVert is a client-side, single-page application built with React 19 and Vite+. It has no backend or server-side application layer.

The application entry point is `../src/main.tsx`, which mounts `App`. The app composes presentational components from `src/components/`.

CronVert translates cron expressions in the browser as the user types. It persists the cron input and selected theme in `localStorage`, and applies the `light` or `dark` theme to the document root so CSS custom properties can provide the appropriate theme values.

### Cron Domain Logic

Cron parsing and formatting are deliberately separated from the UI and live in `../src/lib`.

The processing pipeline is:

1. **`parseField.ts`** validates one cron field against supplied bounds and returns a structured field node.
2. **`parseCron.ts`** normalizes whitespace, requires exactly five fields in minute, hour, day-of-month, month, and day-of-week order, applies field-specific bounds, and returns the complete AST.
3. **`formatCron.ts`** converts the AST into human-readable English. It does not parse raw cron syntax.
4. **`cronToText.ts`** is the public orchestration entry point. It invokes parsing and, on success, formatting; otherwise, it returns the parser's error result.

The supported syntax is standard five-field cron. The AST supports these node types:

- `any`
- `exact`
- `range`
- `list`
- `step`

The canonical node shapes and examples are documented in [`../docs/cron-ast.md`](../docs/cron-ast.md). Keep that document in sync with any AST or parser changes.

### Styling

CronVert uses Tailwind CSS 4 through `@tailwindcss/vite`.

`../src/index.css` maps semantic Tailwind colors to CSS custom properties for light and dark themes. Prefer the existing semantic tokens over hard-coded colors. Common tokens include `bg`, `surface`, `text`, `accent`, `border`, `success`, and `error`.

## Commands and Tooling

The repository uses Vite+ (`vp`), which manages Node.js and the package manager (pnpm). The committed lockfile is `../pnpm-lock.yaml`.

- Use **Node.js 24 or later** (or let `vp env` manage it).
- Use **`vp install`** to install dependencies; do not run `pnpm install`/`npm install` directly.
- Prefer Vite+ built-in tasks for development, checking, testing, and building.

```powershell
vp install
vp dev
vp build
vp preview
vp check
vp test run
vpr <script>
```

Use `vp test run` for the test suite or pass Vitest-style selectors for a focused run:

```powershell
vp test run src/lib/parseField.test.ts
vp test run src/lib/parseField.test.ts -t "step"
```

`vp check` runs the combined formatting, linting, and type-checking workflow. `vp test run` executes the test suite once.

Use `vp run <script>` (or `vpr <script>`) only when you explicitly need to invoke a `../package.json` script or Vite task. Do not assume a script or task exists: inspect `package.json` and `vite.config.ts` first.

### Tests and CI

Tests are colocated with their implementations under `../src/lib`, use the `.test.ts` filename convention, import test APIs from `vite-plus/test`, and run in the Node environment configured in `vite.config.ts`.

The main CI workflow runs the following checks in order:

1. Node.js 24 setup and dependency installation.
2. Formatting check.
3. Lint.
4. Tests.
5. Production build.

React Doctor runs separately as an advisory workflow on pull requests and pushes to `main`. Treat its findings as advisory unless the repository's workflow configuration says otherwise.

## Architecture and Development Conventions

### Separation of Responsibilities

- Keep parser, formatter, and UI responsibilities separate.
- UI components should call `cronToText`; they must not duplicate parsing or formatting rules.
- Keep `formatCron.ts` responsible for AST-to-English conversion. It must not parse raw cron strings.
- Put special combinations, such as unrestricted fields and exact times, in `formatCron.ts`, not in parser code or UI components.

### Result Contract

Preserve the existing result contract:

```ts
{ success: true, value: ... }
{ success: false, error: ... }
```

Failures produced by `parseCron.ts` for invalid fields include both `error.message` and `error.description`.

Do not change this contract casually. If a change is necessary, update all affected callers and tests together.

### AST and Cron Semantics

- Keep AST values numeric and structured.
- Follow the canonical shapes in `../docs/cron-ast.md`.
- An unbounded `*/step` node uses `start: null` and `end: null`.
- Preserve these field bounds:

  | Field        | Minimum | Maximum |
  | ------------ | ------: | ------: |
  | Minute       |       0 |      59 |
  | Hour         |       0 |      23 |
  | Day of month |       1 |      31 |
  | Month        |       1 |      12 |
  | Day of week  |       0 |       7 |

- Both `0` and `7` represent Sunday when formatting day-of-week values.

### Sentence Formatting

- Keep final capitalization and punctuation in `../src/lib/utils/formatSentence.ts`.
- Formatter helpers should return phrase fragments, not independently punctuated sentences.
- Preserve the existing sentence composition flow when changing formatter helpers.

### Tests

For parser or formatter changes, add or update focused, colocated tests.

Cover:

- Valid AST or formatted-text results.
- Relevant invalid inputs.
- The expected structured error objects.
- Boundary values and special combinations affected by the change.

Prefer testing observable behavior and the public `cronToText` entry point where appropriate, while retaining focused unit tests for individual parsing and formatting functions.

### TypeScript and Module Style

- Use TypeScript for source and test files.
- Use `.ts` for files without JSX and `.tsx` for files containing JSX.
- Follow the repository's ESM conventions.
- Use explicit `.ts` or `.tsx` extensions in relative imports where required by the existing project configuration.
- Use default exports for modules, following the existing repository convention.
- Prefer inferred types when they are clear; add explicit types where they improve API clarity or prevent ambiguity.
- Avoid `any`, unnecessary type assertions, and suppression comments. Do not use `@ts-ignore` to bypass errors without a documented, justified reason.
- Use double-quoted strings and the formatting produced by Oxfmt.

### React and UI

- Keep components presentational where practical.
- Keep cron-domain behavior in `../src/lib`, not in React components.
- Preserve existing component APIs unless a change is intentional and all call sites are updated.
- Handle optional props deliberately and use TypeScript to make component contracts clear.
- Preserve the existing React Compiler compatibility.

### Styling

- Use semantic Tailwind tokens such as `bg`, `surface`, `text`, `accent`, `border`, `success`, and `error`.
- Avoid raw color values when an existing semantic token expresses the intended design.
- Preserve formatter-compatible class ordering.
- Keep light and dark theme behavior working through the CSS custom properties defined in `../src/index.css`.

### Vite+ Configuration

Keep `../vite.config.ts` compatible with all existing project integrations and settings, including:

- React Compiler.
- Tailwind CSS Vite plugin (`@tailwindcss/vite`).
- The `__APP_VERSION__` definition.
- Vite+ lint and format settings.
- Vitest configuration.

Before changing this file, inspect its current contents and understand the purpose of the existing plugins and configuration. Do not remove or replace integrations simply to make a migration or configuration change easier.

## Making Changes

Before editing:

1. Inspect the relevant source files, tests, `../package.json`, and configuration.
2. Read `../docs/cron-ast.md` before changing parser or AST behavior.
3. Identify the existing behavior and the tests that protect it.

While editing:

1. Make the smallest coherent change.
2. Preserve the architecture and result contract.
3. Update tests and documentation alongside behavior changes.
4. Avoid unrelated refactors and dependency changes.

After editing, run the most relevant focused tests, then the broader checks when practical:

```powershell
vp check
vp test run
vp build
```

Report which checks were run and whether they passed. Never claim a check passed unless it was actually executed successfully.
