import {Link} from 'react-router';
import Table from 'react-bootstrap/Table';

// Every command listed here must exist in package.json (checked by pages.spec.tsx).
const commands = [
  {command: 'npm run dev', what: 'Start the dev server with hot reload.'},
  {command: 'npm run build', what: 'Typecheck, then build the production bundle into dist/.'},
  {command: 'npm run preview', what: 'Serve the production build locally.'},
  {command: 'npm run lint', what: 'Check the code with ESLint.'},
  {command: 'npm test', what: 'Run the unit and component tests in watch mode.'},
  {command: 'npm run test:e2e', what: 'Build, then run the Playwright end-to-end tests in a real browser.'},
  {command: 'npm run release -- minor', what: 'Cut a release from the changelog and publish it to GitHub.'},
];

const Help = () => (
  <div className='container page-container page-content text-start'>
    <h1 className='text-info py-2'>Help</h1>

    <p className='lead'>
      How to find your way around the Sandpit, and how to run and extend it yourself.
      For what the project is and what it is built with, see <Link to='/about'>About</Link>.
    </p>

    <h2 className='h4'>Getting around</h2>
    <ul>
      <li>The <strong>Experimental</strong> menu opens the demo pages: a modal, the colour pickers and the Redux counter.</li>
      <li>The <strong>Help</strong> menu has this page, the <Link to='/release-notes'>release notes</Link> and <Link to='/about'>About</Link>.</li>
      <li>The Sandpit logo and <strong>Home</strong> take you back to the start page.</li>
      <li>
        The counter keeps its value while you move between pages because it lives in the Redux store;
        reloading the browser resets it.
        The colour picker page keeps its colour only while you stay on it.
      </li>
    </ul>

    <h2 className='h4'>Running it locally</h2>
    <p>You need Node.js 22.22 or newer.</p>
    <pre><code>{`npm install
npm run dev`}</code></pre>
    <p>
      The dev server runs on <code>localhost:3004</code> by default.
      To use a different host or port, copy <code>setup/env.template</code> to <code>.env</code> and
      set <code>HOST</code> and <code>APP_PORT</code>.
    </p>

    <h2 className='h4'>Commands</h2>
    <Table size='sm' className='info-table'>
      <tbody>
        {commands.map(({command, what}) => (
          <tr key={command}>
            <th scope='row'><code>{command}</code></th>
            <td>{what}</td>
          </tr>
        ))}
      </tbody>
    </Table>

    <h2 className='h4'>Adding a page</h2>
    <ol>
      <li>Create the page component in <code>src/components/</code>.</li>
      <li>Add a <code>&lt;Route&gt;</code> for it in <code>src/app/App.tsx</code>.</li>
      <li>Add a menu item for it in <code>src/components/TopNavBar.tsx</code>.</li>
      <li>For a new experiment, also add it to <code>src/app/experiments.ts</code> so it appears on the Home and About pages.</li>
    </ol>

    <h2 className='h4'>Adding shared state</h2>
    <p>
      The counter in <code>src/features/counter/</code> is the model to copy.
      Create a slice with <code>createSlice</code>, register its reducer in <code>src/app/store.ts</code>,
      and read and update it with the typed <code>useAppSelector</code> and <code>useAppDispatch</code> hooks.
    </p>

    <h2 className='h4'>Releasing</h2>
    <p>
      Describe each change under <code>Unreleased</code> in <code>CHANGELOG.md</code> as you make it.
      To release, commit your work and run <code className='text-nowrap'>npm run release -- &lt;version&gt;</code>.
      It updates the changelog and version, tags and pushes the release, creates the GitHub Release,
      and adds the new version to the <Link to='/release-notes'>release notes</Link>.
    </p>
  </div>
);

export default Help;
