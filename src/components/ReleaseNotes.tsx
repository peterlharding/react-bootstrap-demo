import {marked} from 'marked';

import './ReleaseNotes.css';

// Generated from CHANGELOG.md by scripts/changelog.mjs, bundled at build time.
const notesFiles = import.meta.glob<string>('../../release_notes/v*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
});

const versionOf = (path: string) =>
    (/v(\d+)\.(\d+)\.(\d+)\.md$/.exec(path) ?? []).slice(1).map(Number);

const newestFirst = ([a]: [string, string], [b]: [string, string]) => {
    const [va, vb] = [versionOf(a), versionOf(b)];
    return vb[0] - va[0] || vb[1] - va[1] || vb[2] - va[2];
};

const releases = Object.entries(notesFiles)
    .sort(newestFirst)
    .map(([path, markdown]) => ({path, html: marked.parse(markdown, {async: false})}));

const ReleaseNotes = () => (
    <div className='container text-left p-2' style={{width: '80%'}}>
        <h1 className='text-primary'>Release Notes</h1>

        {releases.map(({path, html}) => (
            <section key={path} className='release-notes' dangerouslySetInnerHTML={{__html: html}} />
        ))}
    </div>
);

export default ReleaseNotes;
