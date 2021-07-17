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

const getText = (no: number) => {
  const x = loremIpsum({ p: 3, random: true });

  console.log(x);

  return (
    x.map((paragraph, index) => (
      <p className="text" key={index}>
        {paragraph}
      </p>
    ))
  );
}

const One = () => {
  
  const [text] = useState(getText(5));

  const [background, setBackground] = useState('#fff');

  const handleChangeComplete = (color: Color) => {
    setBackground(color.hex);
  };
  
  return (
      <div className='container text-left' style={{width: '80%', background: background}}>
          <h1 className='text-info p-2'>Working with Colour Pickers</h1>

          <h2>See - <a href="https://casesandberg.github.io/react-color/" target="_blank" rel="noreferrer">https://casesandberg.github.io/react-color/</a></h2>

          <hr></hr>

          {text}

          <hr></hr>

          <h1 style={{padding: '10px'}}>Block Picker</h1>
          <BlockPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px'}}>Chrome Picker</h1>
          <ChromePicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px'}}>Circle Picker</h1>
          <CirclePicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px'}}>Github Picker</h1>
          <GithubPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />


          <h1 style={{padding: '10px'}}>Hue Picker</h1>
          <HuePicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px'}}>Photoshop Picker</h1>
          <PhotoshopPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px'}}>Sketch Picker</h1>
          <SketchPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <h1 style={{padding: '10px'}}>Twitter Picker</h1>
          <TwitterPicker
            color={ background }
            onChangeComplete={ handleChangeComplete }
          />

          <p style={{padding: '20px'}}></p>

      </div>
  );
}

export default One;
