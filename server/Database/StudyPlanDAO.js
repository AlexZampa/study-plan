const db = require('./DBmanager');
const { StudyPlan } = require('../utils');
const courseDAO = require('./CourseDAO');


exports.getStudyPlan = async (userid) => {
    try {
        let sql = "SELECT * FROM StudyPlans WHERE userId = ?";
        const row = await db.DBget(sql, [userid]);
        if(row === undefined)
            throw({err: 404, msg: "user does not have a study plan"});

        sql = "SELECT courseCode FROM StudyPlanCourses WHERE studyPlanId = ?";
        let rows = await db.DBgetAll(sql, [row.id]);
        const studyPlan = new StudyPlan(row.type, rows.map(r => r.courseCode));
        return studyPlan;
    } catch (err) {
        throw err;
    }
};



exports.createStudyPlan = async (studyPlan, userid) => {
    try {
        let sql = "SELECT COUNT(*) AS num FROM StudyPlans WHERE userid = ?";        // check if studyPlan already exist
        let result = await db.DBget(sql, [userid]);
        if(result.num !== 0)
            throw({err: 422, msg: "study plan already exists for the user"});

        sql = "INSERT INTO StudyPlans(type, userId) VALUES (?, ?)";
        result = await db.DBexecuteQuery(sql, [studyPlan.type, userid]);

        sql = "INSERT INTO StudyPlanCourses(studyPlanId, courseCode) VALUES (?, ?)";
        for (const course of studyPlan.courses) {
            const res = await db.DBexecuteQuery(sql, [result.lastID, course.code]);
            await courseDAO.addEnrolledStudentsToCourse(course.code);           // update enrolled student
        }
        return result.lastID;
    } catch (err) {
        throw err;
    }
};


exports.deleteStudyPlan = async (userid) => {
    try {
        let sql = "SELECT * FROM StudyPlans WHERE userId = ?";
        const row = await db.DBget(sql, [userid]);
        sql = "SELECT * FROM StudyPlanCourses WHERE studyPlanId = ?";
        const rows = await db.DBgetAll(sql, [row.id]);
        for (const course of rows) {
            await courseDAO.removeEnrolledStudentsToCourse(course.courseCode);           // update enrolled student
        }
        sql = "DELETE FROM StudyPlanCourses WHERE studyPlanId = ?";
        let result = await db.DBexecuteQuery(sql, [row.id]);
        sql = "DELETE FROM StudyPlans WHERE id = ?";
        result = await db.DBexecuteQuery(sql, [row.id]);
        return result.changes;
    } catch (err) {
        throw err;
    }
};

