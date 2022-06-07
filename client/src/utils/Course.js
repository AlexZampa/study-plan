
function Course(code, name, credits, enrolledStudents, maxStudents, preparatoryCourse, incompatibleCourses=[]){
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.enrolledStudents = enrolledStudents;
    this.maxStudents = maxStudents ? maxStudents : null;
    this.preparatoryCourse = preparatoryCourse ? preparatoryCourse : null;
    this.incompatibleCourses = incompatibleCourses;
}

export default Course;