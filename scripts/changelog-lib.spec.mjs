import {
  bumpVersion,
  compareVersions,
  cutRelease,
  findRelease,
  GENERATED_HEADER,
  parseChangelog,
  renderGitHubReleaseBody,
  renderReleaseNotes,
} from './changelog-lib.mjs';

const changelog = `# Changelog

Intro text.

## [Unreleased]

### Added

- New thing.

## [0.2.0] - 2026-09-18

### Changed

- Old change.

## [0.1.0] - 2021-07-14

### Added

- First.
`;

describe('parseChangelog', () => {
  it('splits the preamble, unreleased and dated releases', () => {
    const {preamble, unreleased, releases} = parseChangelog(changelog);
    expect(preamble).toBe('# Changelog\n\nIntro text.');
    expect(unreleased).toEqual({name: 'Unreleased', date: null, body: '### Added\n\n- New thing.'});
    expect(releases.map((r) => [r.name, r.date])).toEqual([
      ['0.2.0', '2026-09-18'],
      ['0.1.0', '2021-07-14'],
    ]);
    expect(releases[1].body).toBe('### Added\n\n- First.');
  });

  it('rejects a release without a date', () => {
    expect(() => parseChangelog('## [1.0.0]\n\n- x\n')).toThrow('missing its date');
  });

  it('rejects a non-semver release name', () => {
    expect(() => parseChangelog('## [v1] - 2026-01-01\n')).toThrow('Invalid version');
  });
});

describe('cutRelease', () => {
  it('moves unreleased entries into a new dated section', () => {
    const result = cutRelease(changelog, '0.3.0', '2026-10-01');
    expect(result).toBe(`# Changelog

Intro text.

## [Unreleased]

## [0.3.0] - 2026-10-01

### Added

- New thing.

## [0.2.0] - 2026-09-18

### Changed

- Old change.

## [0.1.0] - 2021-07-14

### Added

- First.
`);
    expect(parseChangelog(result).unreleased.body).toBe('');
  });

  it('refuses to release when unreleased is empty', () => {
    const empty = cutRelease(changelog, '0.3.0', '2026-10-01');
    expect(() => cutRelease(empty, '0.4.0', '2026-10-02')).toThrow('Nothing to release');
  });

  it('refuses a version that is not newer than the latest release', () => {
    expect(() => cutRelease(changelog, '0.2.0', '2026-10-01')).toThrow('must be greater');
  });
});

describe('versions', () => {
  it('bumps major, minor and patch, and passes explicit versions through', () => {
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0');
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0');
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4');
    expect(bumpVersion('1.2.3', '1.5.0')).toBe('1.5.0');
  });

  it('compares numerically rather than lexically', () => {
    expect(compareVersions('0.10.0', '0.9.0')).toBeGreaterThan(0);
  });
});

describe('findRelease', () => {
  it('returns the named release and rejects unknown versions', () => {
    expect(findRelease(changelog, '0.1.0').body).toBe('### Added\n\n- First.');
    expect(() => findRelease(changelog, '9.9.9')).toThrow('no [9.9.9] release');
  });
});

describe('renderGitHubReleaseBody', () => {
  it('renders only the promoted body', () => {
    expect(renderGitHubReleaseBody({name: '0.2.0', date: '2026-09-18', body: '### Changed\n\n- Old change.'}))
      .toBe('## Changed\n\n- Old change.\n');
  });
});

describe('renderReleaseNotes', () => {
  it('renders a standalone document with promoted headings', () => {
    expect(renderReleaseNotes({name: '0.2.0', date: '2026-09-18', body: '### Changed\n\n- Old change.'}))
      .toBe(`${GENERATED_HEADER}\n\n# v0.2.0\n\nReleased 2026-09-18.\n\n## Changed\n\n- Old change.\n`);
  });
});
