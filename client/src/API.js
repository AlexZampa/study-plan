import Course from "./utils/Course";
import StudyPlan from "./utils/StudyPlan";

const SERVER_URL = "http://localhost:3001";

const getAllCourses = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/courses');
    const courses = await response.json();
    if (response.ok) {
      return courses.map(c => new Course(c.code, c.name, c.credits, c.enrolledStudents, c.maxStudents, c.preparatoryCourse, c.incompatibleCourses.map(ic => ic.code)));
    }
    else
      throw courses;
  } catch (err) {
    throw new Error(err.msg);
  }
};



const getStudyPlan = async () => {
  try {
    const response = await fetch(SERVER_URL + '/api/studyplan', { credentials: 'include' });
    const studyPlan = await response.json();
    if (response.ok) {
      return new StudyPlan(studyPlan.type, studyPlan.courses.map(s => s.code));
    }
    else {
      if (studyPlan.err === 404)
        return '';
      throw studyPlan;
    }
  } catch (err) {
    throw new Error(err.msg);
  }
};

const updateStudyPlan = async (studyPlan) => {
  try {
    const response = await fetch(SERVER_URL + '/api/studyplan', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ "type": studyPlan.type, "courses": studyPlan.courses.map(courseCode => { return { "code": courseCode } }) })
    });
    if (!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else return null;
  } catch (err) {
    throw new Error(err.msg);
  }
};

const createStudyPlan = async (studyPlan) => {
  try {
    const response = await fetch(SERVER_URL + '/api/studyplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ "type": studyPlan.type, "courses": studyPlan.courses.map(courseCode => { return { "code": courseCode } }) })
    });
    if (!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else return null;
  } catch (err) {
    throw new Error(err.msg);
  }
};

const deleteStudyPlan = async (studyPlan) => {
  try {
    const response = await fetch(SERVER_URL + '/api/studyplan', {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
    }
    else return null;
  } catch (err) {
    throw new Error(err.msg);
  }
};


const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}


const API = { getAllCourses, getUserInfo, logIn, logOut, getStudyPlan, updateStudyPlan, createStudyPlan, deleteStudyPlan };
export default API;