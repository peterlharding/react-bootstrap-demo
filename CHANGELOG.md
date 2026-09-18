# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Add entries under `Unreleased` as changes are made.
`npm run release -- <version>` moves them into a dated version section, generates `release_notes/v<version>.md`, then commits, tags, pushes and creates the GitHub Release.

## [Unreleased]

## [0.3.0] - 2026-09-18

### Added

- `npm run release` now commits, tags and pushes the release and creates the GitHub Release from the changelog; `--no-publish` only updates the files.
- `npm run release:publish -- <version>` creates the GitHub Release for an already pushed tag.
- The dev server reads `HOST` and `APP_PORT` from `.env` or the environment; `setup/env.template` documents them.
  Without them it still serves on `localhost:3004`.

## [0.2.0] - 2026-09-18

### Added

- Redux Toolkit store with the `counter` feature as the model for new state features.
- ESLint (`npm run lint`) and Vitest (`npm test`).
- `CHANGELOG.md` and generated per-version release notes in `release_notes/`, shown on the in-app Release Notes page.

### Changed

- Replaced Create React App with Vite.
  The dev server still runs on port 3004, and production builds now go to `dist/`.

### Removed

- `react-scripts`, `web-vitals` and the Jest-only test dependencies.

## [0.1.1] - 2021-07-14

### Added

- Experimental components: a modal example, colour pickers and a lorem ipsum page.

## [0.1.0] - 2021-07-14

### Added

- Initial implementation of the demo project.
