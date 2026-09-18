// Pure helpers for reading and rewriting CHANGELOG.md (Keep a Changelog format)
// and rendering the generated release_notes/v<version>.md files.

export const GENERATED_HEADER =
  '<!-- Generated from CHANGELOG.md by scripts/changelog.mjs - do not edit. -->';

const SECTION_RE = /^## \[([^\]]+)\](?: - (\d{4}-\d{2}-\d{2}))?[ \t]*$/gm;
const VERSION_RE = /^(\d+)\.(\d+)\.(\d+)$/;

export const parseVersion = (version) => {
  const match = VERSION_RE.exec(version);
  if (!match) {
    throw new Error(`Invalid version "${version}": expected MAJOR.MINOR.PATCH`);
  }
  return match.slice(1).map(Number);
};

export const compareVersions = (a, b) => {
  const [pa, pb] = [parseVersion(a), parseVersion(b)];
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
};

export const bumpVersion = (current, bump) => {
  const [major, minor, patch] = parseVersion(current);
  switch (bump) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'patch': return `${major}.${minor}.${patch + 1}`;
    default: return bump;
  }
};

// Splits the changelog into its preamble and `## [name] - date` sections.
// Each section's body is its trimmed text up to the next section heading.
export const parseChangelog = (text) => {
  const headings = [...text.matchAll(SECTION_RE)];
  if (headings.length === 0) {
    throw new Error('CHANGELOG.md has no "## [...]" sections');
  }
  const sections = headings.map((match, i) => {
    const bodyStart = match.index + match[0].length;
    const bodyEnd = i + 1 < headings.length ? headings[i + 1].index : text.length;
    return {
      name: match[1],
      date: match[2] ?? null,
      body: text.slice(bodyStart, bodyEnd).trim(),
    };
  });
  const releases = sections.filter((s) => s.name !== 'Unreleased');
  for (const release of releases) {
    parseVersion(release.name);
    if (!release.date) {
      throw new Error(`CHANGELOG.md section [${release.name}] is missing its date`);
    }
  }
  return {
    preamble: text.slice(0, headings[0].index).trimEnd(),
    unreleased: sections.find((s) => s.name === 'Unreleased') ?? null,
    releases,
  };
};

// Moves the Unreleased entries into a new dated version section, leaving an empty Unreleased section.
export const cutRelease = (text, version, date) => {
  const {preamble, unreleased, releases} = parseChangelog(text);
  if (!unreleased || unreleased.body === '') {
    throw new Error('Nothing to release: the [Unreleased] section of CHANGELOG.md is empty');
  }
  const latest = releases[0]?.name;
  if (latest && compareVersions(version, latest) <= 0) {
    throw new Error(`Version ${version} must be greater than the latest release ${latest}`);
  }
  const released = [{name: version, date, body: unreleased.body}, ...releases];
  const renderSection = (s) => `## [${s.name}] - ${s.date}\n\n${s.body}\n`;
  return [preamble, '## [Unreleased]\n', ...released.map(renderSection)].join('\n\n').replace(/\n{3,}/g, '\n\n');
};

const promoteHeadings = (body) => body.replace(/^###(?=\s)/gm, '##');

// Renders one release as a standalone Markdown document, promoting `###` headings to `##`.
export const renderReleaseNotes = ({name, date, body}) =>
  `${GENERATED_HEADER}\n\n# v${name}\n\nReleased ${date}.\n\n${promoteHeadings(body)}\n`;

// Renders the body of a GitHub Release; GitHub shows the tag, title and date itself.
export const renderGitHubReleaseBody = ({body}) => `${promoteHeadings(body)}\n`;

export const findRelease = (text, version) => {
  const release = parseChangelog(text).releases.find((r) => r.name === version);
  if (!release) {
    throw new Error(`CHANGELOG.md has no [${version}] release section`);
  }
  return release;
};

export const releaseNotesFileName = (version) => `v${version}.md`;
