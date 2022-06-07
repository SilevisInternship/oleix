import { FC } from 'react';
import { Button, Container, Nav, Navbar, NavDropdown, NavLink } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { BoxArrowInLeft, List } from 'react-bootstrap-icons';
import useAuth from '../hooks/useAuth';
import UserAvatar from '../components/UserAvatar/UserAvatar';

const Layout: FC = () => {
  const { auth, logout } = useAuth();

  return (
    <div>
      <Navbar collapseOnSelect expand="sm" bg="dark" className="sticky-top" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex gap-1 align-items-center">
              <p className="fs-2 mb-1">Oleix</p>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              {auth?.userId ? (
                <>
                  <NavLink className="d-flex align-items-center">
                    <UserAvatar
                      className="size-50-px p-1 mb-auto ml-auto"
                      username={auth?.username || 'unknown'}
                    />
                    <NavDropdown title="My account" id="basic-nav-dropdown">
                      <NavDropdown.Item>Hello, {auth?.username || 'unknown'}</NavDropdown.Item>
                      <NavDropdown.Divider />

                      <LinkContainer to="/adverts/me">
                        <NavDropdown.Item>
                          <List className="size-25-px" />
                          <span className="d-inline px-2">My adverts</span>
                        </NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Item onClick={logout}>
                        <BoxArrowInLeft className="size-25-px" />
                        <span className="d-inline px-2">Log out</span>
                      </NavDropdown.Item>
                    </NavDropdown>
                  </NavLink>
                  <LinkContainer to="/adverts/new">
                    <Nav.Link className="d-flex align-items-center justify-content-end">
                      <Button variant="light" size="sm" className="m-1 d-none d-sm-flex">
                        Add Advert
                      </Button>
                      <span className="d-flex d-sm-none">Add Advert</span>
                    </Nav.Link>
                  </LinkContainer>
                </>
              ) : (
                <>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <span>Sign Up</span>
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <span>Login</span>
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
};

export default Layout;
