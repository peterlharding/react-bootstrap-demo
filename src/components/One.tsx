import { useState } from 'react';
import {loremIpsum} from 'react-lorem-ipsum';
import {
  BlockPicker,
  ChromePicker,
  CirclePicker,
  GithubPicker,
  HuePicker,
  TwitterPicker,
  PhotoshopPicker,
  SketchPicker} from 'react-color';

// See:
//  * https://casesandberg.github.io/react-color/
//  * https://fatihtelis.com/ LoremIpsum

interface Color {
  hex: string
}

const getText = () => {
  return (
    loremIpsum({ p: 3, random: true }).map((paragraph, index) => (
      <p className="text" key={index}>
        {paragraph}
      </p>
    ))
  );
}

const One = () => {
  
  const [text] = useState(getText);

  const [background, setBackground] = useState('#fff');

  const handleChangeComplete = (color: Color) => {
    setBackground(color.hex);
  };
  
  return (
      <div className='container page-container text-start' style={{background: background}}>
          <h1 className='text-info py-2'>Working with Colour Pickers</h1>

          <h2 className='text-break'>See - <a href="https://casesandberg.github.io/react-color/" target="_blank" rel="noreferrer">https://casesandberg.github.io/react-color/</a></h2>

          <hr></hr>

          {text}

          <hr></hr>

          <h1 style={{padding: '10px 0'}}>Block Picker</h1>
          <BlockPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px 0'}}>Chrome Picker</h1>
          <ChromePicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px 0'}}>Circle Picker</h1>
          <CirclePicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px 0'}}>Github Picker</h1>
          <GithubPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />


          <h1 style={{padding: '10px 0'}}>Hue Picker</h1>
          <HuePicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px 0'}}>Photoshop Picker</h1>
          {/* The Photoshop picker is a fixed 513px wide, so let it scroll on narrow screens. */}
          <div className='overflow-x-auto pb-2'>
            <PhotoshopPicker
              color={ background }
              onChangeComplete={ handleChangeComplete }
            />
          </div>

          <h1 style={{padding: '10px 0'}}>Sketch Picker</h1>
          <SketchPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px 0'}}>Twitter Picker</h1>
          <TwitterPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <p style={{padding: '20px'}}></p>

      </div>
  );
}

export default One;
