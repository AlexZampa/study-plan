import { Row, Col, Container } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import { CourseTable } from '../components/CourseComponents';
import { LoginForm } from '../components/LoginComponents';
import FooterBar from '../components/FooterComponents';
import { NavBar } from '../components/NavBarComponents';
import { useEffect } from 'react';
import StudyPlanPage from '../components/StudyPlanComponents';
import { ExclamationCircle, CaretRightFill } from 'react-bootstrap-icons'


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
      <NavBar loggedIn={props.loggedIn} hideMenu={true} />
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
    <Container fluid className='App not-found-container mt-5 p-5'>
      <Row className='mt-5 mb-5'>
        <Col className='col-2' align='right'>
          <ExclamationCircle size={50} />
        </Col>
        <Col align='left'>
          <h1>The page you are looking for does not exist</h1>
        </Col>
      </Row>
      <Row className='col-8'>
        <Col className='col-6' align='center'>
          <Link to="/home" style={{"text-decoration": "none"}}>
            <p>Go to Home Page 
            <CaretRightFill/>
            </p>
          </Link>
        </Col>
      </Row>
    </Container>
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