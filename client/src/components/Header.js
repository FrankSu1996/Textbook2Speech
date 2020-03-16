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
    this.state = { showTutorial: false }
  }

  toggleTutorial() {
    this.setState({
      showTutorial: !this.state.showTutorial
    });
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
              <NavItem>Search |</NavItem>
              <NavItem>Table of Contents</NavItem>
              <NavItem><button onClick={this.toggleTutorial.bind(this)}> Tutorial</button></NavItem>
            </Nav>
          </Container>
        </Navbar>
        {this.state.showTutorial ?
          <Tutorial closePopup={this.toggleTutorial.bind(this)}/>
          : null
        }
      </div>

    );
  }
}

export default Header;
