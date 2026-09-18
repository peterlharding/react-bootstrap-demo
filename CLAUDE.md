# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A small "sandpit" starter kit: Vite + TypeScript + React 19 with Bootstrap 5 CSS, react-bootstrap 2, React Router 8 and Redux Toolkit 2.
It was originally a Create React App project; the Redux `counter` feature (from the CRA redux-typescript template) is kept as the reference model for adding new state features.

## Commands

- `npm install` (or `make install`) - install dependencies. Vite 8 needs Node 20.19+ or 22.12+.
- `npm run dev` / `npm start` (or `make run`) - Vite dev server.
  `vite.config.ts` reads `HOST` and `APP_PORT` from `.env` (gitignored; copy `setup/env.template`) or the shell, which wins over `.env`.
  Without them it serves on `localhost:3004`; `strictPort` makes a busy port an error instead of silently picking another.
- `npm run build` - typecheck with `tsc -b`, then production build into `dist/`.
- `npm run preview` - serve the built `dist/` locally.
- `npm run lint` - ESLint (flat config in `eslint.config.js`: typescript-eslint, react-hooks, react-refresh).
- `npm test` - Vitest unit and component tests in watch mode; `npx vitest run` for a single run.
- Single test: `npx vitest run src/features/counter/counterSlice.spec.ts`, or add `-t "<test name>"`.
- `npm run test:e2e` - Playwright E2E tests against the production build (builds, then serves `vite preview` on 127.0.0.1:4173).
  Single file: `npx playwright test e2e/navigation.spec.ts`; one-time browser setup: `npx playwright install chromium`.
- `npm run release -- <version|major|minor|patch>` - cut and publish a release (see below); add `--no-publish` to only update files.
- `npm run release:publish -- <version>` - create the GitHub Release for an already pushed tag.
- `npm run release-notes` / `npm run release-notes:check` - regenerate, or verify, `release_notes/` from `CHANGELOG.md`.

## Build and tooling notes

- `index.html` lives at the repo root and loads `/src/index.tsx` as the entry module; `public/` holds static files served from `/`.
- TypeScript uses project references: `tsconfig.app.json` covers `src/` (with `vite/client` and `vitest/globals` types), `tsconfig.node.json` covers `vite.config.ts`.
- `vite.config.ts` splits third-party code into `vendor` and `lorem` chunks; `react-lorem-ipsum` alone is over 400 kB, so keep it out of the vendor chunk to stay under the 500 kB chunk warning.
- TypeScript is pinned to 6.x because typescript-eslint does not support TypeScript 7 yet.
- Tailwind 1.9 is loaded from unpkg in `index.html`, in addition to Bootstrap.
- `react-color` and `react-lorem-ipsum` are unmaintained and rely on function-component `defaultProps`, which React 19 ignores.
  Pass their props explicitly (for example `<LoremIpsum p={5} random startWithLoremIpsum />`) instead of relying on library defaults.

## Architecture

- `src/index.tsx` wraps `App` in the Redux `Provider` and imports the Bootstrap CSS globally.
- `src/app/App.tsx` owns routing: a React Router 8 `<Routes>` of `<Route element={...}>` in declarative mode (`BrowserRouter`), rendered inside `HeaderFooterLayout` (a compound component with `.Header`, `.Body`, `.Footer` slots, sticky footer via flexbox in `HeaderFooterLayout.css`).
- `src/components/TopNavBar.tsx` is the navigation menu; `Nav.Link`/`NavDropdown.Item` use `as={NavLink}` from `react-router` so they route client-side and get the `active` class.
  Adding a page means adding a component in `src/components/`, a `<Route>` in `App.tsx` and a nav item in `TopNavBar.tsx`.
- React Router 8 has no `react-router-dom` package: import everything from `react-router` (only `RouterProvider`/`HydratedRouter` come from `react-router/dom`).
  Do not reintroduce `react-router-bootstrap`; it depends on `react-router-dom`.
- `src/app/store.ts` configures the store and exports `RootState`, `AppDispatch` and `AppThunk`; `src/app/hooks.ts` exports typed `useAppDispatch`/`useAppSelector`, which should be used instead of the plain react-redux hooks.
- `src/features/<name>/` follows the Redux Toolkit "feature folder" pattern: `<name>Slice.ts` (slice, actions, selectors, thunks), a component, CSS module and `*.spec.ts` reducer tests.
  New slices must be registered in the `reducer` map in `store.ts`.
  `setupListeners` from RTK Query is already wired up in `store.ts`, ready for RTK Query APIs.

## Testing

- Component tests are `*.spec.tsx` next to the code, run by Vitest (`globals: true`, jsdom, setup in `src/test/setup.ts` with jest-dom matchers).
  Render through `renderWithProviders` in `src/test/render.tsx`: it gives each test a fresh store from `makeStore()` and a `MemoryRouter` at the requested `route`, and returns a `user-event` instance.
  `App` has no router of its own (`BrowserRouter` lives in `src/index.tsx`) precisely so tests can mount it at any URL.
- E2E tests live in `e2e/` and import `test`/`expect` from `e2e/fixtures.ts`, whose auto fixture fails any test that logs a console error or warning or throws.
  Vitest excludes `e2e/`; Playwright's `testDir` is `e2e/`.
- TypeScript projects: `tsconfig.app.json` (app code, no Node types), `tsconfig.test.json` (specs, adds Vitest and Node types), `tsconfig.node.json` (`vite.config.ts`), `tsconfig.e2e.json` (Playwright, adds DOM lib for `page.evaluate`).
- The app loads Tailwind from unpkg at runtime, so E2E tests need outbound network access.

## Changelog and releases

- `CHANGELOG.md` is hand-maintained in Keep a Changelog format; add entries under `## [Unreleased]` as part of each change.
- `release_notes/v<version>.md` files are generated from `CHANGELOG.md` by `scripts/changelog.mjs`; never edit them by hand.
- `npm run release -- <version>` moves the Unreleased entries into a dated version section, bumps `package.json` via `npm version --no-git-tag-version`, and regenerates the notes.
  It then commits `Release <version>`, creates an annotated `v<version>` tag, pushes both atomically and runs `gh release create` with the changelog section as the body.
- Before touching any file it checks that Unreleased is non-empty, the version is newer than the latest release, `gh` is logged in, the working tree is clean, the branch matches its upstream and the tag does not exist.
  If only the GitHub step fails, rerun it with `npm run release:publish -- <version>`.
- The pure parsing and rendering logic lives in `scripts/changelog-lib.mjs`, tested by `scripts/changelog-lib.spec.mjs` (run with the normal Vitest suite).
- The in-app Release Notes page (`src/components/ReleaseNotes.tsx`) bundles `release_notes/v*.md` via `import.meta.glob` and renders them with `marked`, newest first.
