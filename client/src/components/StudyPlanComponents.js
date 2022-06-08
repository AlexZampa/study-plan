import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { CourseTable } from './CourseComponents';
import { toast } from 'react-toastify';
import StudyPlan from '../utils/StudyPlan';
import { Trash3Fill } from 'react-bootstrap-icons'

function StudyPlanApp(props) {

    const checkAddCourse = (course) => {
        // check preparatory course
        if (course.preparatoryCourse && !props.studyPlan.courses.find(c => c === course.preparatoryCourse))
            return { isValid: false, errMsg: <div>Missing preparatory course:<br />{props.courses.find(c => c.code === course.preparatoryCourse).name}</div> };
        // check number of enrolled students
        if (course.enrolledStudents === course.maxStudents)
            return { isValid: false, errMsg: "Course has reached maximum number of enrolled students" };
        // check incompatible courses
        for (const ic of course.incompatibleCourses) {
            const incompatibleCourse = props.studyPlan.courses.find(sc => sc === ic);
            if (incompatibleCourse)
                return { isValid: false, errMsg: <div>Incompatible course:<br />{props.courses.find(c => c.code === incompatibleCourse).name}</div> };
        }

        // check tot num of credits of studyPlan TODO
        // if (props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0) + course.credits)
        //     return { isValid: false, errMsg: <div>Incompatible course:<br />{props.courses.find(c => c.code === incompatibleCourse).name}</div> };
        return { isValid: true };
    }

    const checkRemoveCourse = (course) => {
        return true;
    }

    const handleAddCourse = (course) => {
        const check = checkAddCourse(course);
        if (check.isValid) {
            props.setStudyPlan((oldStudyPlan) => {
                return new StudyPlan(oldStudyPlan.type, [...oldStudyPlan.courses, course.code]);
            })
        }
        else
            toast.error(check.errMsg, { toastId: check.errMsg, autoClose: 4000, hideProgressBar: false });
    };

    const handleRemoveCourse = (course) => {
        if (checkRemoveCourse(course)) {
            props.setStudyPlan((oldStudyPlan) => {
                return new StudyPlan(oldStudyPlan.type, oldStudyPlan.courses.filter(c => c !== course.code));
            })
        }
    }

    return (
        <Container fluid>
            {props.studyPlan ?
                <Row className='studyplan-text mb-4'>
                    <Col align='left' xs={2}> <h2>type:</h2></Col>
                    <Col align='left'><p> {props.studyPlan.type} </p> </Col>
                </Row>
                : <></>
            }

            <Row>
                <StudyPlanTable courses={props.courses} studyPlan={props.studyPlan.courses} type={props.studyPlan.type} handleRemoveCourse={handleRemoveCourse} />
            </Row>

            <Row className='studyplan-text'>
                {props.studyPlan ? <>
                    <Col className='col-10' align='right'><p>tot credits:</p></Col>
                    <Col className='col-2' align='center'><p>{props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0)}</p></Col>
                </> : <></>
                }
            </Row>

            <Row align='left' className='studyplan-text mt-4'>
                <h2>University Courses</h2>
            </Row>

            <Row className='mt-2'>
                <CourseTable courses={props.courses} studyPlan={props.studyPlan.courses} handleAddCourse={handleAddCourse} />
            </Row>

            <Row>
                <Col className='col-1' align='left'>
                    <Button variant='success'>Save</Button>
                </Col>
                <Col className='col-1' align='left'>
                    <Button variant='danger'>Cancel</Button>
                </Col>
            </Row>
        </Container>
    )
}


function StudyPlanTable(props) {
    return (
        <Table responsive="sm" hover>
            <thead>
                <tr>
                    <th></th>
                    <th>code</th>
                    <th>name</th>
                    <th>credits</th>
                </tr>
            </thead>
            <tbody>
                {props.studyPlan ? props.studyPlan.map(course =>
                    <StudyPlanRow course={props.courses.find(c => c.code === course)} key={props.type + course} handleRemoveCourse={props.handleRemoveCourse} />)
                    : <></>
                }
            </tbody>
        </Table>
    );
}


function StudyPlanRow(props) {
    return (
        <tr>
            <td>
                <Trash3Fill className='trash-icon' size={16} onClick={() => props.handleRemoveCourse(props.course)} />
            </td>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    );
}


function ButtonDelete(props) {
    const handleDelete = () => {
        toast.warning("Are you sure?", { position: "top-center", autoClose: false })
    }

    return (
        <>
            {!props.showCourses ?
                <Button className='mt-5' variant='danger' size='md' onClick={handleDelete}>Delete</Button>
                : <></>
            }
        </>
    );
}


export default StudyPlanApp;