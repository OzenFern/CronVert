# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-11-11

### Added

- Undo button to step back through recent cron edits, with edits batched into ~1-second snapshots (up to 50 entries).
- Reset button is now disabled when the cron expression already matches the default.
- App version displayed in the footer via the `__APP_VERSION__` global, sourced from `package.json`.
- Strict TypeScript checking across the parser, formatter, utilities, and UI components.
- Vite+ pre-commit hook running `vp staged`.

### Changed

- Migrated the codebase from JavaScript/JSX to TypeScript (`.ts`/`.tsx`).
- Enabled React Compiler through the `@vitejs/plugin-react` `compiler` option.
- Switched the package manager to pnpm, with a workspace catalog pinning `vite-plus` and `vite`.
- Adopted Vite+ (`vp`) for development, linting, formatting, type checking, and tests.

## [0.1.0] - 2026-11-06

### Added

- Initial public release of CronVert.
- Support for standard five-field cron expressions.
- Real-time cron expression validation.
- Human-readable cron expression translation.
- Field-specific validation feedback.

[2.0.0]: https://github.com/OzenFern/CronVert/releases/tag/v2.0.0
[0.1.0]: https://github.com/OzenFern/CronVert/releases/tag/v0.1.0
