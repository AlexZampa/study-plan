import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, Slide, toast } from 'react-toastify';
import { useEffect, useState, useRef } from 'react';
import { HomeLayout, NotFoundLayout, DefaultLayout, LoginLayout, StudyPlanLayout } from './components/PageLayout';
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


  // use effect: get Study Plan
  useEffect(() => {
    if (loggedIn) {
      getStudyPlan();
    }
  }, [loggedIn]);

  // use effect: get courses
  useEffect(() => {
      getCourses();
  }, []);


  // get study plan
  const getStudyPlan = async () => {
    try {
      const result = await API.getStudyPlan();
      setStudyPlan(result);
    } catch (err) { }
  }

  const focusOnFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView();
    }
  };

  // get list of courses
  const getCourses = async () => {
    const courseList = await API.getAllCourses();
    setCourses(courseList);
  }

  // login
  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      toast.success(`Welcome, ${user.name} ${user.surname}!`, { position: "top-center" });
    } catch (err) {
      console.log(err);
      toast.error(err, { position: "top-center" });
    }
  };

  // logout
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    toast.success('Succeffully logged out!', { position: "top-center" });
    // setFilms([]);
  };


  return (
    <BrowserRouter>
      <ToastContainer position="top-right" theme="light" autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover={false} limit={3} transition={Slide} />
      <Container fluid className='App'>
        <Routes>
          <Route path="/" element={<DefaultLayout loggedIn={loggedIn} handleLogout={handleLogout} footerRef={footerRef} focusOnFooter={focusOnFooter} />}>
            <Route index element={<HomeLayout courses={courses} getCourses={getCourses} />} />
            <Route path='/login' element={loggedIn ? <Navigate replace to='/' /> : <LoginLayout handleLogin={handleLogin} />} />
            <Route path='/studyplan' element={loggedIn ? <StudyPlanLayout courses={courses} studyPlan={studyPlan} setStudyPlan={setStudyPlan} loggedIn={loggedIn} setLoggedIn={setLoggedIn} /> : <Navigate replace to='/login' />} />
            <Route path='*' element={<NotFoundLayout />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;