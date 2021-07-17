
const ReleaseNotes = () => {

    const h3 = 'text-info';
    const h4 = 'text-success';

    return (
        <div className='container text-left p-2' style={{width: '80%'}}>

            <h1 className='text-primary'>Release Notes</h1>


            <h3 className={h3}>2021-07-14</h3>

            <h4 className={h4}>Version 0.1.1</h4>
            <ul>
                <li>Add in some Experimental components.</li>
            </ul>

            <h3 className={h3}>2021-07-14</h3>

            <h4 className={h4}>Version 0.1.0</h4>
            <ul>
                <li>Initial implementation of demo project.</li>
            </ul>

        </div>
    );

}

export default ReleaseNotes;
