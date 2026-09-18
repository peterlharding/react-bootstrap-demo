
import {Link, NavLink} from 'react-router';

import {NavDropdown} from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from '../assets/logo.svg';
import './TopNavBar.css';


const TopNavBar = () => {
  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg' style={{width: '100%'}}>
        <Navbar.Brand as={Link} to='/home'>
            <img alt='' src={logo} style={{width: 100, marginTop: -7}} />
            &#9776; Sandpit
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>

            <Nav.Link as={NavLink} to='/home'>Home</Nav.Link>

            <NavDropdown title='Experimental' id='experimental-nav-dropdown'>

              <NavDropdown.Item as={NavLink} to='/modal-example'>Modal Example</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to='/one'>One - Color Picker</NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to='/two'>Two - The React Counter</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title='Help' id='help-nav-dropdown'>
              <NavDropdown.Item as={NavLink} to='/help'>Help</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to='/release-notes'>Release Notes</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={NavLink} to='/about'>About</NavDropdown.Item>
            </NavDropdown>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}

export default TopNavBar;
