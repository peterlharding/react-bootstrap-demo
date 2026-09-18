# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Add entries under `Unreleased` as changes are made.
`npm run release -- <version>` moves them into a dated version section, generates `release_notes/v<version>.md`, then commits, tags, pushes and creates the GitHub Release.

## [Unreleased]

### Added

- `.markdownlint.json`, which allows repeated headings in different sections (such as each version's Added and Changed) and turns off the line-length rule; README lint issues fixed.

### Changed

- The One page explains how its eight react-color pickers share one colour in React state, shows the current colour, and describes each picker, instead of placeholder text.
- The Two page is now "The React Counter": the counter comes first, followed by what each button demonstrates in Redux Toolkit, how the state survives navigation, where the code lives and where it came from, instead of placeholder text.

### Removed

- `react-lorem-ipsum`, no longer used by any page, which also drops its 428 kB chunk from the build.

## [0.7.0] - 2026-09-18

### Fixed

- Page headings line up with the text below them instead of being indented.
- Pages use the full width on phones, with Bootstrap's normal side gutters, and are capped at 1024px on large screens, instead of a fixed 80% width.
- No page scrolls sideways on a phone: the colour picker link wraps, the Photoshop picker scrolls inside its own box, and the counter buttons and the Create React App command wrap.
- Text alignment uses Bootstrap's `text-start`, so pages no longer centre their text if the Tailwind CDN fails to load.

## [0.6.0] - 2026-09-18

### Changed

- The About page describes the project instead of showing placeholder text: the current version, the experiments, the stack with major versions read from `package.json`, credits, source and licence.
- `/home` is a landing page with a short introduction, Get started and About buttons, a card for each experiment and the current version, instead of placeholder text.
- The Help page explains how to get around the app, run it locally, use the npm commands, add pages and state, and cut a release, instead of showing placeholder text.

## [0.5.0] - 2026-09-18

### Added

- Playwright E2E tests (`npm run test:e2e`) against the production build, covering navigation, the Redux counter, colour pickers, the modal and release notes, and failing on any console error.
- Vitest and Testing Library component tests for routes, the navbar, the counter and the pages.

### Changed

- `BrowserRouter` moved from `App` to `src/index.tsx`, and `store.ts` exports a `makeStore()` factory, so tests can render the app with their own router and store.

## [0.4.0] - 2026-09-18

### Changed

- Upgraded React 17 to 19, React Router 5 to 8, react-bootstrap 1 to 2, React Redux 7 to 9 and Redux Toolkit 1 to 2.
- Routing now imports from `react-router`; the `react-router-dom` package no longer exists in v8.
- Navbar links use react-bootstrap's `as={NavLink}` instead of `react-router-bootstrap`, which does not support React Router 8.
- React, React DOM and React Router are split into their own build chunk.

### Fixed

- The navbar brand link navigates within the app instead of reloading the page.
- The modal close button works and renders as the Bootstrap 5 close icon.
- The lorem ipsum on the Home, Help and About pages is random again under React 19, which ignores the library's defaults.
- The two navbar dropdowns no longer share a DOM id.

### Removed

- `react-router-dom`, `react-router-bootstrap` and outdated `@types` packages for libraries that now ship their own types.

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
