'use strict';

const express = require('express');
const { expressValidator, check, validationResult } = require('express-validator');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const { User, StudyPlan, Course } = require('./utils');
const userDAO = require('./Database/UserDAO');
const courseDAO = require('./Database/CourseDAO');
const studyPlanDAO = require('./Database/StudyPlanDAO');


// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(express.json());
app.use(morgan('dev'));

// set up and enable cors
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));


// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDAO.getUser(username, password);
  if (!user)
    return cb(null, false, 'Incorrect username or password.');
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// user with id + email + name + surname
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

// check if user logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

app.use(session({
  secret: "myverylongsecrets",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));



/******* APIs *******/

// GET ALL COURSES IN ALPHABETICAL ORDER
app.get('/api/courses', async (req, res) => {
  try {
    const result = await courseDAO.getAllCourses();
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).end();
  }
});

// GET STUDY PLAN
app.get('/api/studyplan', isLoggedIn,
  async (req, res) => {
    try {
      const result = await studyPlanDAO.getStudyPlan(req.user.id);
      return res.status(200).json(result);
    } catch (err) {
      console.log(err);
      switch (err.err) {
        case 404: return res.status(404).json(err);
        default: return res.status(500).end();
      }
    }
  });

// CREATE STUDY PLAN
app.post('/api/studyplan',
  [check("type").exists().isString().trim().notEmpty(),
  check("courses").exists().isArray(),
    isLoggedIn],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log({ errors: errors.array() });
        return res.status(422).end();
      }
      const courses = [];
      for (const c of req.body.courses) {
        if (c.code === undefined)
          return res.status(422).end();
        courses.push(c.code);
      }
      const studyPlan = new StudyPlan(req.body.type, courses);
      const isValid = await checkStudyPlan(studyPlan);
      if (isValid) {
        const result = await studyPlanDAO.createStudyPlan(studyPlan, req.user.id);
        return res.status(201).end();
      }
      return res.status(422).end();
    } catch (err) {
      console.log(err);
      switch (err.err) {
        case 422: return res.status(422).end();
        default: return res.status(503).end();
      }
    }
  });



// MODIFY STUDY PLAN
app.put('/api/studyplan',
  [check("type").exists().isString().trim().notEmpty(),
  check("courses").exists().isArray(),
    isLoggedIn],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log({ errors: errors.array() });
        return res.status(422).end();
      }
      const courses = [];
      for (const c of req.body.courses) {
        if (c.code === undefined)
          return res.status(422).end();
        courses.push(c.code);
      }
      const studyPlan = new StudyPlan(req.body.type, courses);
      const oldStudyPlan = await studyPlanDAO.getStudyPlan(req.user.id);
      const isValid = await checkStudyPlan(studyPlan, oldStudyPlan);
      if (isValid) {
        const resultDelete = await studyPlanDAO.deleteStudyPlan(req.user.id);
        const result = await studyPlanDAO.createStudyPlan(studyPlan, req.user.id);
        return res.status(200).end();
      }
      return res.status(422).end();
    } catch (err) {
      console.log(err);
      switch (err.err) {
        case 422: return res.status(422).end();
        default: return res.status(503).end();
      }
    }
  });


// DELETE STUDY PLAN
app.delete('/api/studyplan', isLoggedIn,
  async (req, res) => {
    try {
      const result = await studyPlanDAO.deleteStudyPlan(req.user.id);
      return res.status(204).end();
    } catch (err) {
      return res.status(503).end();
    }
  });




async function checkStudyPlan(studyPlan, oldStudyPlan) {
  try {
    const courses = [];
    let totCredits = 0;
    for (const c of studyPlan.courses) {
      const course = await courseDAO.getCourseByCode(c.code);   // get course
      courses.push(course);
      totCredits += course.credits;
    }

    // check if totCredits is in the range
    switch (studyPlan.type) {
      case 'full-time':
        if (totCredits < 60 || totCredits > 80) {
          console.log("Tot credits must be in the range 60-80");
          return false
        }
        break;
      case 'part-time':
        if (totCredits < 20 || totCredits > 40) {
          console.log("Tot credits must be in the range 20-40");
          return false;
        }
        break;
      default:
        console.log("Type must be part-time or full-time");
        return false
    }

    for (const course of courses) {
      // check if maximum number of student enrolled
       // check if old study plan had already the course
      const alreadyCounted = oldStudyPlan && oldStudyPlan.courses.find(c => c.code === course.code);
      // if not increment num of enrolledStudents
      const numEnrolledStudents = alreadyCounted ? course.enrolledStudents : course.enrolledStudents + 1;
      if (course.maxStudents !== null && numEnrolledStudents > course.maxStudents) {
        console.log(`Course ${course.code} has maximum number of enrolled students`);
        return false;
      }

      // if prepparatoryCourse not in the studyPlan -> invalid
      if (course.preparatoryCourse !== null && !courses.find(c => c.code === course.preparatoryCourse)) {
        console.log('Missing preparatory course of ' + course.code + ' - ' + course.preparatoryCourse);
        return false;
      }

      // search for incompatible courses
      for (const ic of course.incompatibleCourses) {
        if (courses.find(co => co.code === ic.code)) {
          console.log('Found incompatible courses');
          return false;
        }
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};



/*** User APIs ***/

// POST /api/sessions
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      return res.status(201).json(req.user);
    });
  })(req, res, next);
});


// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});


// activate the server
app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));
