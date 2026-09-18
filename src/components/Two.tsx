import {Fragment} from 'react';
import {loremIpsum} from 'react-lorem-ipsum';

import {Counter} from '../features/counter/Counter';


const createAppCommand = ['npx', 'create-react-app', '--template', 'redux-typescript', 'some-app'];

const Two = () => {
  return (
  <div className='container page-container text-start'>
      <h1 className='text-success py-2'>Two works!</h1>
      <div className='text-wrapper'>
        {loremIpsum({p: 3, random: true }).map((text, index) => (
          <p className='text' key={index}>
            {text}
          </p>
        ))}
      </div>
      <div className='py-2'>
        <h1 className='text-danger py-2'>Counter</h1>
        The Counter <em>feature</em> is taken from the app initialized using the command:
        <pre style={{padding: '20px 0', textAlign: 'center', whiteSpace: 'pre-wrap'}}>
          {/* Wrap only between arguments, never at the hyphens inside them. */}
          {createAppCommand.map((arg, i) => (
            <Fragment key={arg}>{i > 0 && ' '}<span className='text-nowrap'>{arg}</span></Fragment>
          ))}
        </pre>
        <Counter />
      </div>
    </div>
  );
}

export default Two;
