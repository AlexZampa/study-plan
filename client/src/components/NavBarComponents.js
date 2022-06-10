import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Book, PersonCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';


function NavBar(props) {
    return (
        <Navbar expand="lg" bg="dark" variant="dark" fixed="top">
            <Link to='/home' style={{ textDecoration: 'none' }}>
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



export { NavBar };