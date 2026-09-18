
import {
  Routes,
  Route,
  Link
} from 'react-router';

import TopNavBar from '../components/TopNavBar';
import {HeaderFooterLayout} from '../components/HeaderFooterLayout';

import Home from '../components/Home';

import ModalExample from '../components/ModalExample';
import One from '../components/One';
import Two from '../components/Two';

import About from '../components/About';
import ReleaseNotes from '../components/ReleaseNotes';
import Help from '../components/Help';

import './App.css';


export const App = () => {
  return (
    <div className='app'>
      <HeaderFooterLayout>
        <HeaderFooterLayout.Header>
          <TopNavBar />
        </HeaderFooterLayout.Header>

        <HeaderFooterLayout.Body>
          <div>
            <Routes>
              <Route path="/"                        element={<Home />} />
              <Route path="/home"                    element={<Home />} />

              <Route path="/modal-example"           element={<ModalExample />} />

              <Route path="/help"                    element={<Help />} />
              <Route path="/release-notes"           element={<ReleaseNotes />} />
              <Route path="/about"                   element={<About />} />

              <Route path="/one"                     element={<One />} />
              <Route path="/two"                     element={<Two />} />

            </Routes>
            <div style={{padding: '10px'}}></div>
          </div>
        </HeaderFooterLayout.Body >

        <HeaderFooterLayout.Footer>
          <div>
            <div className='container green p-3'>
              <Link to='/home'>Home</Link>
              &nbsp;|&nbsp;
              <Link to='/help' style={{padding: '10px'}}>Help</Link>
              &nbsp;|&nbsp;
              <Link to='/about' style={{padding: '10px'}}>About</Link>
            </div>
            <div style={{ fontSize: "10pt", color: "#33ccff" }}>
              <a href='https://react-bootstrap.github.io/' target='_blank' rel='noreferrer'>React Bootstrap</a>
            </div>
          </div>
        </HeaderFooterLayout.Footer>
      </HeaderFooterLayout>
    </div>
  );
}

export default App;
