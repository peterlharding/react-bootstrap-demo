#!/usr/bin/env node
// Usage:
//   node scripts/changelog.mjs notes            Regenerate release_notes/ from CHANGELOG.md
//   node scripts/changelog.mjs notes --check    Fail if release_notes/ is out of date
//   node scripts/changelog.mjs release <version|major|minor|patch> [--no-publish]
//       Cut [Unreleased] into a new version, bump package.json and regenerate notes, then
//       commit, tag v<version>, push, and create the GitHub Release (unless --no-publish).
//   node scripts/changelog.mjs publish <version>
//       Create the GitHub Release for an already pushed v<version> tag from CHANGELOG.md.

import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

import {
  bumpVersion,
  cutRelease,
  findRelease,
  parseChangelog,
  parseVersion,
  releaseNotesFileName,
  renderGitHubReleaseBody,
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

const run = (command, args, options = {}) =>
  execFileSync(command, args, {cwd: root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...options}).trim();

const succeeds = (command, args) => {
  try {
    run(command, args);
    return true;
  } catch {
    return false;
  }
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

// Everything a published release needs, checked before any file is touched.
const checkCanPublish = (tag) => {
  if (!succeeds('gh', ['auth', 'status'])) {
    fail('the GitHub CLI is not logged in (run `gh auth login`), or use --no-publish');
  }
  if (run('git', ['status', '--porcelain']) !== '') {
    fail('the working tree has uncommitted changes; commit them (including the [Unreleased] entries) first');
  }
  const upstream = run('git', ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}']);
  run('git', ['fetch', '--quiet', '--tags']);
  if (run('git', ['rev-parse', 'HEAD']) !== run('git', ['rev-parse', upstream])) {
    fail(`the current branch is not in sync with ${upstream}; pull or push first`);
  }
  if (succeeds('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`])) {
    fail(`tag ${tag} already exists`);
  }
};

const publish = ([version]) => {
  if (!version) fail('usage: npm run release:publish -- <version>');
  const release = findRelease(readFileSync(changelogPath, 'utf8'), version);
  const tag = `v${version}`;
  const url = run(
    'gh',
    ['release', 'create', tag, '--verify-tag', '--title', tag, '--notes-file', '-'],
    {input: renderGitHubReleaseBody(release)},
  );
  console.log(`Published GitHub Release ${tag}: ${url}`);
};

const release = (args) => {
  const target = args.find((a) => !a.startsWith('--'));
  const shouldPublish = !args.includes('--no-publish');
  if (!target) fail('usage: npm run release -- <version|major|minor|patch> [--no-publish]');

  const current = JSON.parse(readFileSync(packagePath, 'utf8')).version;
  const version = bumpVersion(current, target);
  parseVersion(version);
  const tag = `v${version}`;

  const changelog = readFileSync(changelogPath, 'utf8');
  const latest = parseChangelog(changelog).releases[0]?.name;
  if (latest && latest !== current) {
    fail(`package.json version ${current} does not match the latest CHANGELOG.md release ${latest}`);
  }
  const updatedChangelog = cutRelease(changelog, version, today());
  if (shouldPublish) checkCanPublish(tag);

  writeFileSync(changelogPath, updatedChangelog);
  run('npm', ['version', version, '--no-git-tag-version']);
  syncNotes({check: false});
  console.log(`Prepared ${version}: updated CHANGELOG.md, package.json and release_notes/${releaseNotesFileName(version)}`);
  if (!shouldPublish) return;

  run('git', ['add', 'CHANGELOG.md', 'package.json', 'release_notes']);
  run('git', ['commit', '--quiet', '-m', `Release ${version}`]);
  run('git', ['tag', '-a', tag, '-m', `Release ${version}`]);
  run('git', ['push', '--atomic', 'origin', 'HEAD', `refs/tags/${tag}`]);
  console.log(`Committed, tagged ${tag} and pushed`);
  try {
    publish([version]);
  } catch (error) {
    fail(`${error.stderr?.trim() || error.message}\nThe release is pushed; retry the GitHub Release with \`npm run release:publish -- ${version}\``);
  }
};

const [command, ...args] = process.argv.slice(2);
try {
  if (command === 'notes') notes(args);
  else if (command === 'release') release(args);
  else if (command === 'publish') publish(args);
  else fail('usage: node scripts/changelog.mjs <notes [--check] | release <version|major|minor|patch> [--no-publish] | publish <version>>');
} catch (error) {
  fail(error.stderr?.trim() || error.message);
}
