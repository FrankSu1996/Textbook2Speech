import React, {Component} from 'react';
import Tutorial from './Tutorial';

import {
  Nav,
  Navbar,
  NavbarBrand,
  Container,
  NavItem,
  NavLink,
  Collapse,
} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeadset} from '@fortawesome/free-solid-svg-icons';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <Container>
            <NavbarBrand>
              <FontAwesomeIcon icon={faHeadset} /> Textbook2Speech{' '}
            </NavbarBrand>
            <Nav>
              <NavItem>Table of Contents</NavItem>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default Header;
