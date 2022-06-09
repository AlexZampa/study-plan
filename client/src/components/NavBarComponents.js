import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Book, PersonCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';


function NavBarApp(props) {
    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed="top">
            <Link to='/' style={{ textDecoration: 'none' }}>
                <Navbar.Brand className='m-4'>
                    <Book color="white" size={25} />
                    <Navbar.Text className='nav-items'>Home</Navbar.Text>
                </Navbar.Brand>
            </Link>
            <Nav className="ms-auto ">
                {props.hideMenu ? <></> :
                    <>
                        <Link to='/studyplan' className='nav-link'>
                            <Navbar.Text className='nav-items'>MyStudyPlan</Navbar.Text>
                        </Link>
                        <Nav.Link className='nav-items' onClick={props.focusOnFooter}>Contact me</Nav.Link>
                    </>
                }
            </Nav>
            <Nav className='nav-border-left'>
                {props.loggedIn ?
                    <Nav.Link className='nav-items' onClick={props.logout}>logout</Nav.Link>
                    :
                    <Link to='/login' className='nav-link'>
                        <Navbar.Text className='nav-items'>login</Navbar.Text>
                    </Link>
                }
                <Navbar.Brand>
                    <PersonCircle color='white' size={25} />
                </Navbar.Brand>
            </Nav>
        </Navbar>
    )
};


function MyNav(props) {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">

            <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                </Nav>
                <Nav className='nav-items'>
                    <Nav.Link href="#deets">More deets</Nav.Link>
                    <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}


export { NavBarApp, MyNav };