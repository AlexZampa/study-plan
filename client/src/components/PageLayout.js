import React, { useState } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { CourseTable } from './CourseComponents';
import { LoginForm } from './LoginComponents';
import FooterApp from './FooterComponents';
import { NavBarApp } from './NavBarComponents';
import { useEffect } from 'react';
import API from '../API';
import { toast } from 'react-toastify';
import StudyPlanApp from './StudyPlanComponents';


function DefaultLayout(props) {
  return (
    <>
      <NavBarApp loggedIn={props.loggedIn} logout={props.handleLogout} focusOnFooter={props.focusOnFooter} />
      <Row>
        <Outlet />
      </Row>
      <FooterApp footerRef={props.footerRef} />
    </>
  );
}

function HomeLayout(props) {

  useEffect(() => {
    props.getCourses();
  }, []);

  return (
    <Container className='mt-5'>
      <Row className='mt-5'>
        <h1 className='main-header'>University Courses</h1>
      </Row>
      <Row className='m-5'>
        <CourseTable courses={props.courses} />
      </Row>
    </Container>
  )
}

function LoginLayout(props) {
  return (
    <Container fluid className='App login-form mt-5 p-5'>
      <Row>
        <Col>
          <h1>Login</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm login={props.handleLogin} />
        </Col>
      </Row>
    </Container>
  );
}

function NotFoundLayout() {
  return (
    <>
      <h2>This is not the route you are looking for!</h2>
      <Link to="/">
        <Button variant="primary">Go Home!</Button>
      </Link>
    </>
  );
}



function StudyPlanLayout(props) {
  
  return (
    <Container className='mt-5'>
      <Row className='mt-5'>
        <h1 className='main-header'>Study Plan</h1>
      </Row>
      <Row className='m-5'>
        <StudyPlanApp studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} courses={props.courses}/>
      </Row>
    </Container>
  );
}

export { DefaultLayout, NotFoundLayout, HomeLayout, LoginLayout, StudyPlanLayout }; 