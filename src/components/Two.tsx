
import {loremIpsum} from 'react-lorem-ipsum';


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
        </div>
    );
}

export default Two;
