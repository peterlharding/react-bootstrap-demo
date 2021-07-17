
import {loremIpsum} from 'react-lorem-ipsum';

import {Counter} from '../features/counter/Counter';


const Two = () => {
  return (
  <div className='container text-left ' style={{width: '80%'}}>
      <h1 className='text-success p-2'>Two works!</h1>
      <div className='text-wrapper'>
        {loremIpsum({p: 3, random: true }).map((text, index) => (
          <p className='text' key={index}>
            {text}
          </p>
        ))}
      </div>
      <div className='p-2'>
        <h1 className='text-danger p-2'>Counter</h1>
        The Counter <em>feature</em> is taken from the app initialized using the command:
        <pre style={{padding: '20px', textAlign: 'center'}}>npx create-react-app  --template redux-typescript some-app</pre>
        <Counter />
      </div>
    </div>
  );
}

export default Two;
