import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, Slide, toast } from 'react-toastify';
import { useEffect, useState, useRef } from 'react';
import { HomeLayout, NotFoundLayout, DefaultLayout, LoginLayout, StudyPlanLayout } from './layout/PageLayout';
import { Container } from 'react-bootstrap';
import API from './API';


function App() {
  const [courses, setCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const footerRef = useRef(null);

  // use effect: get userInfo
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
        setLoggedIn(true);
      } catch (error) {
        setLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // use effect: get courses
  useEffect(() => {
    getCourses();
  }, [loggedIn]);


  // get study plan
  const getStudyPlan = async () => {
    try {
      const result = await API.getStudyPlan();
      setStudyPlan(result);
    } catch (err) {
      toast.error(err.message, {toastId: "err-get-studyplan"});
    }
  }


  // get list of courses
  const getCourses = async () => {
    try {
      const courseList = await API.getAllCourses();
      setCourses(courseList);
    } catch (err) {
      toast.error(err.message, {toastId: "err-get-courses"});
    }
  }

  // login
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      toast.success(`Welcome ${user.name} ${user.surname}`, { position: "top-center", toastId: "login" });
    } catch (err) {
      toast.error(err, { position: "top-center", toastId: "err-login" });
    }
  };

  // logout
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    toast.success('successfully logged out', { position: "top-center", toastId: "logout" });
  };

  // update study plan
  const modifyStudyPlan = async (studyPlan) => {
    try {
      await API.updateStudyPlan(studyPlan);
      getCourses();
      getStudyPlan();
      toast.success("Study plan modified", {toastId: "update-studyplan"});
      return true;
    } catch (err) {
      toast.error(err.message, {toastId: "err-update-studyplan"});
    }
    return false;
  };

  // create study plan
  const createStudyPlan = async (studyPlan) => {
    try {
      await API.createStudyPlan(studyPlan);
      getCourses();
      getStudyPlan();
      toast.success("Study plan created", {toastId: "create-studyplan"});
      return true;
    } catch (err) {
      toast.error(err.message, {toastId: "err-create-studyplan"});
    }
    return false;
  };

  // delete study plan
  const deleteStudyPlan = async () => {
    try {
      await API.deleteStudyPlan();
      getCourses();
      getStudyPlan();
      toast.success("Study plan deleted", {toastId: "delete-studyplan"});
    } catch (err) {
      toast.error(err.message, {toastId:"err-delete-studyplan"});
    }
  };

  // update a course (only local update of the state)
  const updateCourse = (course) => {
    setCourses(oldCourses => {
      return oldCourses.map(c => {
        if (c.code === course.code) {
          return course;
        }
        else return c;
      })
    });
  }

  // set focus on footer
  const focusOnFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView();
    }
  };

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" theme="light" autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover={false} limit={3} transition={Slide} />
      <Container fluid className='App'>
        <Routes>
          <Route path='/login' element={loggedIn ? <Navigate replace to='/studyplan' /> : <LoginLayout handleLogin={handleLogin} />} />
          <Route path="/" element={<DefaultLayout loggedIn={loggedIn} handleLogout={handleLogout} footerRef={footerRef} focusOnFooter={focusOnFooter} />}>
            <Route index element={<Navigate to='/home' replace />} />
            <Route path='/home' element={<HomeLayout courses={courses} getCourses={getCourses} />} />
            <Route path='/studyplan' element={loggedIn ? <StudyPlanLayout courses={courses} updateCourse={updateCourse} studyPlan={studyPlan} setStudyPlan={setStudyPlan} loggedIn={loggedIn} getStudyPlan={getStudyPlan}
              modifyStudyPlan={modifyStudyPlan} createStudyPlan={createStudyPlan} deleteStudyPlan={deleteStudyPlan} /> : <Navigate replace to='/login' />} />
            <Route path='*' element={<NotFoundLayout />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;