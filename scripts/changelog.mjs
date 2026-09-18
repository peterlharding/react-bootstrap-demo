#!/usr/bin/env node
// Usage:
//   node scripts/changelog.mjs notes            Regenerate release_notes/ from CHANGELOG.md
//   node scripts/changelog.mjs notes --check    Fail if release_notes/ is out of date
//   node scripts/changelog.mjs release <version|major|minor|patch>
//                                              Cut [Unreleased] into a new version, bump package.json, regenerate notes

import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

import {
  bumpVersion,
  cutRelease,
  parseChangelog,
  parseVersion,
  releaseNotesFileName,
  renderReleaseNotes,
} from './changelog-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const changelogPath = join(root, 'CHANGELOG.md');
const notesDir = join(root, 'release_notes');
const packagePath = join(root, 'package.json');

const fail = (message) => {
  console.error(`error: ${message}`);
  process.exit(1);
};

const today = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Returns the list of problems (check mode) or changed paths (write mode).
const syncNotes = ({check}) => {
  const {releases} = parseChangelog(readFileSync(changelogPath, 'utf8'));
  const expected = new Map(
    releases.map((r) => [releaseNotesFileName(r.name), renderReleaseNotes(r)]),
  );
  const existing = existsSync(notesDir)
    ? readdirSync(notesDir).filter((f) => /^v.+\.md$/.test(f))
    : [];

  const changes = [];
  for (const [file, content] of expected) {
    const path = join(notesDir, file);
    if (existsSync(path) && readFileSync(path, 'utf8') === content) continue;
    changes.push(`${existsSync(path) ? 'update' : 'create'} release_notes/${file}`);
    if (!check) {
      mkdirSync(notesDir, {recursive: true});
      writeFileSync(path, content);
    }
  }
  for (const file of existing.filter((f) => !expected.has(f))) {
    changes.push(`remove release_notes/${file}`);
    if (!check) rmSync(join(notesDir, file));
  }
  return changes;
};

const notes = (args) => {
  const check = args.includes('--check');
  const changes = syncNotes({check});
  if (check && changes.length > 0) {
    fail(`release_notes/ is out of date with CHANGELOG.md (run \`npm run release-notes\`):\n  ${changes.join('\n  ')}`);
  }
  console.log(changes.length > 0 ? changes.join('\n') : 'release_notes/ is up to date');
};

const release = ([target]) => {
  if (!target) fail('usage: npm run release -- <version|major|minor|patch>');
  const current = JSON.parse(readFileSync(packagePath, 'utf8')).version;
  const version = bumpVersion(current, target);
  parseVersion(version);

  const changelog = readFileSync(changelogPath, 'utf8');
  const latest = parseChangelog(changelog).releases[0]?.name;
  if (latest && latest !== current) {
    fail(`package.json version ${current} does not match the latest CHANGELOG.md release ${latest}`);
  }

  writeFileSync(changelogPath, cutRelease(changelog, version, today()));
  execFileSync('npm', ['version', version, '--no-git-tag-version'], {cwd: root, stdio: 'ignore'});
  syncNotes({check: false});
  console.log(`Released ${version}: updated CHANGELOG.md, package.json and release_notes/${releaseNotesFileName(version)}`);
};

const [command, ...args] = process.argv.slice(2);
try {
  if (command === 'notes') notes(args);
  else if (command === 'release') release(args);
  else fail('usage: node scripts/changelog.mjs <notes [--check] | release <version|major|minor|patch>>');
} catch (error) {
  fail(error.message);
}
