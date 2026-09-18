import {useState, type ComponentType} from 'react';
import {Link} from 'react-router';
import {
  BlockPicker,
  ChromePicker,
  CirclePicker,
  GithubPicker,
  HuePicker,
  PhotoshopPicker,
  SketchPicker,
  TwitterPicker,
  type Color,
  type ColorChangeHandler,
  type ColorResult,
} from 'react-color';

import './One.css';

const DOCS_URL = 'https://casesandberg.github.io/react-color/';

// The props every react-color picker shares.
type PickerProps = {color?: Color, onChangeComplete?: ColorChangeHandler};

const pickers: {name: string, Picker: ComponentType<PickerProps>, about: string, scroll?: boolean}[] = [
  {name: 'Block', Picker: BlockPicker, about: 'A large preview of the colour, a set of swatches and a hex input.'},
  {name: 'Chrome', Picker: ChromePicker, about: 'In the style of Chrome DevTools: a saturation area, hue and alpha sliders, and fields that switch between hex, RGB and HSL.'},
  {name: 'Circle', Picker: CirclePicker, about: 'Material Design colours as circles.'},
  {name: 'Github', Picker: GithubPicker, about: 'The palette GitHub uses for issue labels.'},
  {name: 'Hue', Picker: HuePicker, about: 'A single hue slider. It always picks a fully saturated colour.'},
  // The Photoshop picker is a fixed 513px wide, so it scrolls on narrow screens.
  {name: 'Photoshop', Picker: PhotoshopPicker, about: 'A Photoshop-style dialog with HSV and RGB fields. Its OK and Cancel buttons are not wired up on this page.', scroll: true},
  {name: 'Sketch', Picker: SketchPicker, about: 'In the style of the Sketch app: saturation, hue and alpha controls, hex and RGBA fields, and preset swatches.'},
  {name: 'Twitter', Picker: TwitterPicker, about: 'The Twitter palette with a hex input.'},
];

const One = () => {
  const [colour, setColour] = useState('#ffffff');

  const handleChangeComplete = (result: ColorResult) => setColour(result.hex);

  return (
    <div className='container page-container page-content text-start colour-page' style={{background: colour}}>
      <h1 className='text-info py-2'>Working with Colour Pickers</h1>

      <p className='lead'>
        All eight colour pickers from react-color, sharing one colour.
        Choose a colour in any of them and the page background and every other picker follow.
      </p>
      <p>
        Current colour: <code>{colour}</code>
      </p>

      <h2 className='h4'>How it works</h2>
      <p>
        The page keeps the colour in React state with <code>useState</code>.
        Each picker is controlled: it receives the colour through its <code>color</code> prop and reports
        a new one through <code>onChangeComplete</code>, which fires once a change is complete rather than
        continuously while you drag.
      </p>
      <p>
        Unlike the <Link to='/two'>counter</Link>, this state belongs to the page, so the colour resets when you leave it.
      </p>
      <p>
        react-color has not been updated since 2022, but all eight pickers work with React 19.
        See its <a href={DOCS_URL} target='_blank' rel='noreferrer'>documentation</a> for every option.
      </p>

      <h2 className='h4'>The pickers</h2>
      {pickers.map(({name, Picker, about, scroll}) => (
        <section key={name} className='colour-picker'>
          <h3 className='h5'>{name} Picker</h3>
          <p>{about}</p>
          <div className={scroll ? 'overflow-x-auto pb-2' : undefined}>
            <Picker color={colour} onChangeComplete={handleChangeComplete} />
          </div>
        </section>
      ))}
    </div>
  );
};

export default One;
