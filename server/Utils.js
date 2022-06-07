'use strict';

function StudyPlan(type, courses=[]){
    this.type = type;
    this.courses = courses.map(courseCode => { return {code : courseCode} });
}


function Course(code, name, credits, enrolledStudents, maxStudents, preparatoryCourse){
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.enrolledStudents = enrolledStudents;
    this.maxStudents = maxStudents;
    this.preparatoryCourse = preparatoryCourse;
    this.incompatibleCourses = [];

    this.addIncompatibleCourse = (incompatibleCourse) => {
        this.incompatibleCourses.push({code: incompatibleCourse});
    }
}


function User(id, name, surname, username){
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
}

module.exports = {StudyPlan, Course, User};