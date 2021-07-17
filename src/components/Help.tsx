
import {LoremIpsum} from 'react-lorem-ipsum';

const Help = () => {

    return (
        <div className='container text-left ' style={{width: '80%'}}>
            <h1 className='text-info p-2'>Help for Starter</h1>
            <div className='text-wrapper'>
                <LoremIpsum p={5} />
            </div>
        </div>
    );

}

export default Help;
