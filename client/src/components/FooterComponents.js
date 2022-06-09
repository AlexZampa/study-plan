import React from "react";
import { Container, Row, Col } from "react-bootstrap";

function FooterBar(props) {
    return (
        <footer className="footer" ref={props.footerRef}>
            <Container>
                <Row>
                    <Col className="col-6" align='left'>
                        <p>&copy; 2022 - Alessandro Zamparutti</p>
                    </Col>
                    <Col className="col-6" align='right'>
                        <p>s301132@studenti.it</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterBar;
