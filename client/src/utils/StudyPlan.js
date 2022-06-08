
function StudyPlan(type, courses=[]){
    this.type = type;
    this.courses = courses;
}

export const creditsRange = {"part-time": {min: 20, max: 40}, "full-time": {min: 60, max: 80} };

export default StudyPlan;