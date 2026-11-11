# AGENTS.md

## Purpose

This file provides working instructions for coding agents contributing to CronVert. Follow these instructions alongside the repository's existing configuration and documentation.

## Project at a Glance

- **Application:** CronVert, a client-side cron-expression translator.
- **Stack:** React 19, TypeScript, Vite+, Tailwind CSS 4, Vitest, pnpm.
- **Runtime:** Browser; there is no backend or server-side application layer.
- **Entry point:** `src/main.tsx`.
- **Main application:** `App` and the presentational components in `src/components/`.
- **Domain logic:** `src/lib/`.
- **AST reference:** `docs/cron-ast.md`.
- **Styles and theme tokens:** `src/index.css`.

The browser translates expressions as the user types. The cron input and theme are persisted in `localStorage`; the `light` or `dark` theme is applied to the document root and drives CSS custom properties.

## Before You Change Code

1. Inspect the relevant implementation and its tests before editing.
2. Read `package.json` and `vite.config.ts` before assuming scripts, plugins, or tasks are available.
3. Read `docs/cron-ast.md` before changing cron parsing, AST nodes, or formatting behavior.
4. Check nearby code for established naming, import, export, typing, and styling conventions.
5. Keep changes scoped to the requested task. Avoid unrelated refactors.

## Architecture Rules

Keep the responsibilities separate:

- `src/lib/parseField.ts` validates one field against supplied bounds and creates a structured field node.
- `src/lib/parseCron.ts` normalizes whitespace, validates the five-field expression in minute/hour/day-of-month/month/day-of-week order, applies field bounds, and returns the complete AST.
- `src/lib/formatCron.ts` converts the AST into English. It must not parse raw cron syntax.
- `src/lib/cronToText.ts` is the public orchestration entry point. UI components should call it rather than implementing cron parsing or formatting themselves.
- `src/components/` contains the React UI. Do not move domain rules into components.
- `src/lib/utils/formatSentence.ts` owns final sentence capitalization and punctuation. Formatter helpers return phrase fragments.

Put special formatting combinations, including unrestricted fields and exact times, in `formatCron.ts`, not in parser code or components.

## Cron Syntax and AST Invariants

CronVert supports standard five-field cron expressions with `any`, `exact`, `range`, `list`, and `step` AST nodes.

Preserve the canonical node shapes in `docs/cron-ast.md`. Keep AST values numeric and structured. An unbounded `*/step` node uses `start: null` and `end: null`.

Preserve these field bounds:

| Field        | Minimum | Maximum |
| ------------ | ------: | ------: |
| Minute       |       0 |      59 |
| Hour         |       0 |      23 |
| Day of month |       1 |      31 |
| Month        |       1 |      12 |
| Day of week  |       0 |       7 |

Both `0` and `7` represent Sunday when formatting day-of-week values.

If parser or AST behavior changes, update `docs/cron-ast.md` and add focused tests.

## Result Contract

Preserve the existing discriminated result shape:

```ts
{ success: true, value: ... }
{ success: false, error: ... }
```

Invalid-field failures returned by `parseCron.ts` include both `error.message` and `error.description`.

Do not replace structured error results with thrown exceptions or change the result shape without a deliberate, coordinated change to callers, tests, and documentation.

## TypeScript and React Conventions

- Use `.ts` for TypeScript files without JSX and `.tsx` for files containing JSX.
- Keep tests in TypeScript with `.test.ts` filenames.
- Follow the repository's ESM conventions and explicit `.ts`/`.tsx` relative import extensions where required by the project configuration.
- Use default exports for modules, following the existing convention.
- Prefer useful inferred types; add explicit types for public contracts, complex data, and component props where they improve clarity.
- Avoid `any`, unnecessary type assertions, and suppression comments.
- Do not add `@ts-ignore` or weaken strict TypeScript settings merely to silence an error.
- Preserve existing component APIs unless the task explicitly requires changing them. Update all affected call sites when an API changes.
- Keep React components presentational where practical and preserve React Compiler compatibility.

## Tests

Tests are colocated with implementations under `src/lib/`. They:

- Use `.test.ts` filenames.
- Import test APIs from `vite-plus/test`.
- Run in the Node environment configured in `vite.config.ts`.

For parser or formatter changes, add or update focused tests for:

- Valid AST results or formatted text.
- Relevant invalid inputs and structured error objects.
- Boundary values.
- Special combinations affected by the change.

Preserve existing tests and behavior unless the task explicitly changes the requirements. Do not rewrite tests merely to make an implementation pass.

## Tooling and Commands

Use Vite+ (`vp`), which manages Node.js and the package manager (pnpm). The repository has a committed `pnpm-lock.yaml` and targets Node.js 24+.

```powershell
vp install
vp dev
vp build
vp preview
vp check
vp test run
vpr <script>
```

Use `vp test run` for the test suite or focused Vitest-style runs:

```powershell
vp test run src/lib/parseField.test.ts
vp test run src/lib/parseField.test.ts -t "step"
```

- `vp check` runs the combined formatting, lint, and type-check workflow.
- `vp test run` executes the Vitest suite once.
- Use `vp run <script>` (or `vpr <script>`) only to invoke a `package.json` script or Vite task explicitly.
- Inspect `package.json` and `vite.config.ts` before assuming a task exists.
- Use `vp` for installs and package-manager operations; do not introduce or update `package-lock.json`.

## Styling and Theme

CronVert uses Tailwind CSS 4 through `@tailwindcss/vite`.

- Prefer semantic tokens such as `bg`, `surface`, `text`, `accent`, `border`, `success`, and `error`.
- Avoid raw color values when an existing token is appropriate.
- Preserve formatter-compatible class ordering.
- Keep light and dark themes working through the CSS custom properties in `src/index.css`.
- Do not bypass the existing theme system with component-specific hard-coded colors.

## Configuration Guardrails

When editing `vite.config.ts`, preserve compatibility with:

- React Compiler.
- The Tailwind CSS Vite plugin (`@tailwindcss/vite`).
- The `__APP_VERSION__` definition.
- Vite+ lint and format settings.
- Vitest configuration.

Do not remove, reorder, or replace configuration integrations without understanding their purpose and checking the impact.

## CI Expectations

The main CI workflow runs Node.js 24, formatting check, lint, tests, and production build in that order.

React Doctor runs separately as an advisory workflow on pull requests and pushes to `main`.

When changing CI:

- Use `vp` commands consistently; prefer `voidzero-dev/setup-vp` for GitHub Actions workflows.
- Preserve the established check sequence unless the task requires a change.
- Ensure the workflow matches the actual local project commands.
- Do not describe advisory checks as mandatory gates unless the workflow enforces that.

## Verification and Reporting

After making changes:

1. Run focused tests for the affected behavior.
2. Run `vp check`.
3. Run `vp test run`.
4. Run `vp build` when the change could affect the production build.

If a check cannot be run, say so and explain why. Report the commands actually executed and their results. Do not claim tests, type checks, linting, or builds passed without running them.

## Scope and Safety

- Do not add dependencies unless they are needed for the requested change.
- Do not change application behavior as part of an unrelated tooling or documentation task.
- Do not modify generated files or lockfile manually when the package manager can update them.
- Do not commit, push, tag, publish, or create a release unless explicitly asked.
- If requirements conflict with these instructions, explain the conflict and follow the user's explicit task while preserving project correctness.
