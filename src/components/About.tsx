import type {ReactNode} from 'react';
import {Link} from 'react-router';
import Table from 'react-bootstrap/Table';

import {dependencies, devDependencies, version} from '../../package.json';
import {experiments} from '../app/experiments';

const REPO_URL = 'https://github.com/peterlharding/react-bootstrap-demo';

// Major version from a package.json range such as "^19.3.0", so the page tracks upgrades.
const major = (range: string) => /\d+/.exec(range)?.[0] ?? range;

const stack = [
  {name: 'React', version: major(dependencies.react), url: 'https://react.dev/', role: 'UI library'},
  {name: 'React Router', version: major(dependencies['react-router']), url: 'https://reactrouter.com/', role: 'Client-side routing'},
  {name: 'React Bootstrap', version: major(dependencies['react-bootstrap']), url: 'https://react-bootstrap.github.io/', role: 'Bootstrap components for React'},
  {name: 'Bootstrap', version: major(dependencies.bootstrap), url: 'https://getbootstrap.com/', role: 'Styling and layout'},
  {name: 'Redux Toolkit', version: major(dependencies['@reduxjs/toolkit']), url: 'https://redux-toolkit.js.org/', role: 'State management'},
  {name: 'Vite', version: major(devDependencies.vite), url: 'https://vite.dev/', role: 'Dev server and build'},
  {name: 'Vitest', version: major(devDependencies.vitest), url: 'https://vitest.dev/', role: 'Unit and component tests'},
  {name: 'Playwright', version: major(devDependencies['@playwright/test']), url: 'https://playwright.dev/', role: 'End-to-end tests'},
];

const External = ({href, children}: {href: string, children: ReactNode}) => (
  <a href={href} target='_blank' rel='noreferrer'>{children}</a>
);

const About = () => (
  <div className='container page-container page-content text-start'>
    <h1 className='text-info py-2'>About</h1>

    <p className='lead'>
      Sandpit is a small React playground for trying out React Bootstrap components,
      client-side routing and Redux Toolkit state inside a realistic application shell.
    </p>
    <p>
      This is version <strong>{version}</strong>.
      See the <Link to='/release-notes'>release notes</Link> for what changed in each version.
    </p>

    <h2 className='h4'>Experiments</h2>
    <Table size='sm' className='info-table'>
      <tbody>
        {experiments.map(({to, name, what}) => (
          <tr key={to}>
            <th scope='row'><Link to={to}>{name}</Link></th>
            <td>{what}</td>
          </tr>
        ))}
      </tbody>
    </Table>

    <h2 className='h4'>Built with</h2>
    <Table size='sm' className='info-table'>
      <tbody>
        {stack.map(({name, version, url, role}) => (
          <tr key={name}>
            <th scope='row'><External href={url}>{name}</External> {version}</th>
            <td>{role}</td>
          </tr>
        ))}
      </tbody>
    </Table>

    <h2 className='h4'>Credits</h2>
    <p>
      Written by Peter Harding, with much helpful advice and guidance
      from Ben Golding of <External href='http://object-craft.com.au/'>ObjectCraft</External>.
      The counter feature comes from the Create React App Redux TypeScript template.
    </p>

    <h2 className='h4'>Source and licence</h2>
    <p>
      The source code is on <External href={REPO_URL}>GitHub</External> and is
      released under the <External href={`${REPO_URL}/blob/main/LICENSE`}>MIT License</External>.
    </p>
  </div>
);

export default About;
