import React, {Component} from 'react';
import {
  Nav,
  Navbar,
  NavbarBrand,
  Container,
  NavItem,
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
              <NavItem>Search |</NavItem>
              <NavItem>Table of Contents |</NavItem>
              <NavItem>Bookmarks</NavItem>
            </Nav>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default Header;

//
// <Container>
//   <NavbarToggler onClick={this.toggle}/>
//   <Collapse isOpen={this.state.isOpen} navbar>
//     <Nav className="ml-auto" navbar>
//       <NavItem>
//         <NavLink href="/profile/">Profile</NavLink>
//       </NavItem>
//       <NavItem>
//         <NavLink href={Pdf} target="_blank">Resume</NavLink>
//       </NavItem>
//       <NavItem>
//         <NavLink href="https://github.com/syjanna"><FontAwesomeIcon icon={faGithub}  /></NavLink>
//       </NavItem>
//       <NavItem>
//         <NavLink href="https://www.linkedin.com/in/syjanna/"><FontAwesomeIcon icon={faLinkedin} /></NavLink>
//       </NavItem>
//     </Nav>
//   </Collapse>
// </Container>
// </Navbar>
