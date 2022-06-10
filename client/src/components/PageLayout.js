import { Row, Col, Button, Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { CourseTable } from './CourseComponents';
import { LoginForm } from './LoginComponents';
import FooterBar from './FooterComponents';
import { NavBar } from './NavBarComponents';
import { useEffect } from 'react';
import StudyPlanPage from './StudyPlanComponents';


function DefaultLayout(props) {
  return (
    <>
      <NavBar loggedIn={props.loggedIn} logout={props.handleLogout} focusOnFooter={props.focusOnFooter} />
      <Row>
        <Outlet />
      </Row>
      <FooterBar footerRef={props.footerRef} />
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
    <>
      <NavBar loggedIn={props.loggedIn} hideMenu={true}/>
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
    </>
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

  useEffect(() => {
    props.getStudyPlan();
  }, []);

  return (
    <Container className='mt-5'>
      <Row className='mt-5'>
        <h1 className='main-header'>Study Plan</h1>
      </Row>
      <Row className='m-5'>
        <StudyPlanPage studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} courses={props.courses} updateCourse={props.updateCourse} getStudyPlan={props.getStudyPlan}
          modifyStudyPlan={props.modifyStudyPlan} createStudyPlan={props.createStudyPlan} deleteStudyPlan={props.deleteStudyPlan} />
      </Row>
    </Container>
  );
}

export { DefaultLayout, NotFoundLayout, HomeLayout, LoginLayout, StudyPlanLayout }; 