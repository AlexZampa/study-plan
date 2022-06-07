import React from "react";
import { Container, Navbar } from "react-bootstrap";

function FooterApp(props) {
    return (
        <Navbar expand="lg" bg="dark" variant="dark" className="footer" ref={props.footerRef}>
            <Container className="footer-items">
                <Navbar.Brand href="#home">Footer</Navbar.Brand>
            </Container>
        </Navbar>
    );
};

export default FooterApp;
