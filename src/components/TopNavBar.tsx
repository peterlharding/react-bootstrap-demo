
import {LinkContainer} from 'react-router-bootstrap'

import {NavDropdown} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from '../assets/logo.svg';
import './TopNavBar.css';


const TopNavBar = () => {
  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg' style={{width: '100%'}}>
        <Navbar.Brand href='/home'>
            <img alt='' src={logo} style={{width: 100, marginTop: -7}} />
            &#9776; Sandpit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='mr-auto'>

            <LinkContainer to='/home'>
              <Nav.Link eventKey={1}>Home</Nav.Link>
            </LinkContainer>

            <NavDropdown title='Experimental' id='basic-nav-dropdown'>

              <LinkContainer to='/modal-example'>
                <NavDropdown.Item eventKey={4.5}>Modal Example</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to='/one'>
                <NavDropdown.Item eventKey={4.6}>One - Color Picker</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to='/two'>
                <NavDropdown.Item eventKey={4.7}>Two - The React Counter</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

            <NavDropdown title='Help' id='basic-nav-dropdown'>
              <LinkContainer to='/help'>
                <NavDropdown.Item eventKey={5.1}>Help</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to='/release-notes'>
                <NavDropdown.Item eventKey={5.2}>Release Notes</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to='/about'>
                <NavDropdown.Item eventKey={5.3}>About</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default TopNavBar;
