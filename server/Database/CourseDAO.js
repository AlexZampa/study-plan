'use strict';

const db = require('./DBmanager');
const { Course } = require('../utils');


exports.getAllCourses = async () => {
    try {
        let sql = 'SELECT * FROM Courses ORDER BY name';
        let rows = await db.DBgetAll(sql, []);
        const courses = rows.map(r => new Course(r.code, r.name, r.credits, r.enrolledStudents, r.maxStudents, r.preparatoryCourseCode));
        sql = "SELECT * FROM IncompatibleCourses";
        rows = await db.DBgetAll(sql, []);
        courses.forEach(c => {
            for (const ic of rows) {
                if (ic.courseCode === c.code)
                    c.addIncompatibleCourse(ic.incompatibleCourseCode);
                if (ic.incompatibleCourseCode === c.code)
                    c.addIncompatibleCourse(ic.courseCode);
            }
        });
        return courses;
    } catch (err) {
        throw err;
    }
};


exports.getCourseByCode = async (code) => {
    try {
        let sql = 'SELECT * FROM Courses WHERE code = ?';
        const row = await db.DBget(sql, [code]);
        const course = new Course(row.code, row.name, row.credits, row.enrolledStudents, row.maxStudents, row.preparatoryCourseCode);
        sql = "SELECT * FROM IncompatibleCourses";
        const rows = await db.DBgetAll(sql, []);
        for (const ic of rows) {
            if (ic.courseCode === course.code)
                course.addIncompatibleCourse(ic.incompatibleCourseCode);
            if (ic.incompatibleCourseCode === course.code)
                course.addIncompatibleCourse(ic.courseCode);
        }
        return course;
    } catch (err) {
        throw err;
    }
}


exports.addEnrolledStudentsToCourse = async (code) => {
    try {
        const sql = "UPDATE Courses SET enrolledStudents = enrolledStudents + 1 WHERE code = ?";
        const result = await db.DBexecuteQuery(sql, [code]);
        return result.changes;
    } catch (err) {
        throw err;
    }
}

exports.removeEnrolledStudentsToCourse = async (code) => {
    try {
        const sql = "UPDATE Courses SET enrolledStudents = enrolledStudents - 1 WHERE code = ?";
        const result = await db.DBexecuteQuery(sql, [code]);
        return result.changes;
    } catch (err) {
        throw err;
    }
}


