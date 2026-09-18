import {Fragment} from 'react';
import {Link} from 'react-router';
import Table from 'react-bootstrap/Table';

import {Counter} from '../features/counter/Counter';

const createAppCommand = ['npx', 'create-react-app', '--template', 'redux-typescript', 'some-app'];

const buttons = [
  {
    label: '- and +',
    how: <>Dispatch the <code>decrement</code> and <code>increment</code> actions that <code>createSlice</code> generates from the slice&apos;s reducers.</>,
  },
  {
    label: 'Add Amount',
    how: <>Dispatches <code>incrementByAmount</code> with the number in the box as its payload, typed as <code>PayloadAction&lt;number&gt;</code>.</>,
  },
  {
    label: 'Add Async',
    how: <>Dispatches <code>incrementAsync</code>, a <code>createAsyncThunk</code> that calls a mock API taking half a second. The slice sets its status to <code>loading</code>, then adds the result when the request is fulfilled.</>,
  },
  {
    label: 'Add If Odd',
    how: <>Dispatches <code>incrementIfOdd</code>, a hand-written thunk that reads the current value with <code>getState</code> and only adds the amount when it is odd.</>,
  },
];

const files = [
  {path: 'src/features/counter/counterSlice.ts', what: <>The slice: state, reducers, the async thunk and the <code>selectCount</code> selector.</>},
  {path: 'src/features/counter/Counter.tsx', what: <>The component, using the typed <code>useAppSelector</code> and <code>useAppDispatch</code> hooks.</>},
  {path: 'src/features/counter/counterAPI.ts', what: <>The mock API that the async thunk calls.</>},
  {path: 'src/app/store.ts', what: <>Where the counter reducer is registered with the store.</>},
];

const Two = () => (
  <div className='container page-container page-content text-start'>
    <h1 className='text-success py-2'>The React Counter</h1>

    <p className='lead'>
      A small counter that keeps its state in a Redux Toolkit store.
      It is the model for adding shared state to the Sandpit.
    </p>

    <div className='py-3'>
      <Counter />
    </div>

    <h2 className='h4'>What each button shows</h2>
    <Table size='sm' className='info-table'>
      <tbody>
        {buttons.map(({label, how}) => (
          <tr key={label}>
            <th scope='row'>{label}</th>
            <td>{how}</td>
          </tr>
        ))}
      </tbody>
    </Table>

    <h2 className='h4'>Try this</h2>
    <p>
      Change the value, go to another page and come back: the value is still there, because the store
      lives above the router and outlasts the page.
      Reloading the browser creates a new store, so the counter starts again at 0.
    </p>

    <h2 className='h4'>Where the code lives</h2>
    <Table size='sm' className='info-table'>
      <tbody>
        {files.map(({path, what}) => (
          <tr key={path}>
            <th scope='row'><code>{path}</code></th>
            <td>{what}</td>
          </tr>
        ))}
      </tbody>
    </Table>
    <p>
      To add state of your own, copy this feature folder; <Link to='/help'>Help</Link> has the steps.
    </p>

    <h2 className='h4'>Where it came from</h2>
    <p>The counter feature comes from the Create React App Redux TypeScript template, created with:</p>
    <pre>
      {/* Wrap only between arguments, never at the hyphens inside them. */}
      {createAppCommand.map((arg, i) => (
        <Fragment key={arg}>{i > 0 && ' '}<span className='text-nowrap'>{arg}</span></Fragment>
      ))}
    </pre>
  </div>
);

export default Two;
