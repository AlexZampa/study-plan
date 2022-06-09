import { Container, Row, Col, Table, Button, Form, FormCheck } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CourseTable } from './CourseComponents';
import { toast } from 'react-toastify';
import StudyPlan from '../utils/StudyPlan';
import { creditsRange } from '../utils/StudyPlan';
import { Trash3Fill } from 'react-bootstrap-icons'
import { useState } from 'react';

function StudyPlanApp(props) {
    const [newStudyPlan, setNewStudyPlan] = useState(false);
    const [valid, setValid] = useState(false);

    // commit changes
    const handleSave = () => {
        if (newStudyPlan) {
            props.createStudyPlan(props.studyPlan);
            setNewStudyPlan(false);
        }
        else {
            props.modifyStudyPlan(props.studyPlan);
        }
    }

    // delete study plan
    const handleDelete = () => {
        props.deleteStudyPlan();
    }

    // revert changes
    const handleCancel = () => {
        if (newStudyPlan) {
            setNewStudyPlan(false);
            setValid(false);
        }
        props.getStudyPlan();
    };

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

        // check tot number of credits of studyPlan
        const newTotCredits = props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0) + course.credits;
        const maxCredits = creditsRange[props.studyPlan.type].max;
        if (newTotCredits > maxCredits)
            return { isValid: false, errMsg: `Max number of credits for study plan ${props.studyPlan.type} is ${maxCredits}` };
        return { isValid: true };
    }


    const checkRemoveCourse = (course) => {
        const studyPlanCourses = [];
        props.studyPlan.courses.forEach(c => {
            studyPlanCourses.push(props.courses.find(course => c === course.code));
        });

        // check preparatory course
        for (const spc of studyPlanCourses) {
            if (spc.preparatoryCourse === course.code)
                return { isValid: false, errMsg: <div>The course is a preparatory course of:<br />{spc.name}</div> };
        }

        // check tot number of credits of studyPlan
        const newTotCredits = props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0) - course.credits;
        const minCredits = creditsRange[props.studyPlan.type].min;
        if (newTotCredits < minCredits) {
            return { isValid: false, errMsg: `Min number of credits for study plan ${props.studyPlan.type} is ${minCredits}` };
        }
        return { isValid: true };
    }

    /*** function to add course to studyPlan ***/
    const handleAddCourse = (course) => {
        const check = checkAddCourse(course);
        if (check.isValid) {
            props.setStudyPlan((oldStudyPlan) => {
                return new StudyPlan(oldStudyPlan.type, [...oldStudyPlan.courses, course.code]);
            });
            if (newStudyPlan) {
                const totCredits = props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0) + course.credits;
                if (totCredits >= creditsRange[props.studyPlan.type].min && totCredits <= creditsRange[props.studyPlan.type].max) {
                    setValid(true);
                }
            }
        }
        else
            toast.error(check.errMsg, { toastId: check.errMsg, autoClose: 4000, pauseOnHover: true, hideProgressBar: false });
    };

    /*** function to remove course from studyPlan ***/
    const handleRemoveCourse = (course) => {
        const check = checkRemoveCourse(course);
        if (check.isValid) {
            props.setStudyPlan((oldStudyPlan) => {
                return new StudyPlan(oldStudyPlan.type, oldStudyPlan.courses.filter(c => c !== course.code));
            });
        }
        else
            toast.error(check.errMsg, { toastId: check.errMsg, autoClose: 4000, pauseOnHover: true, hideProgressBar: false });
    }


    return (
        <Container fluid>
            {props.studyPlan || newStudyPlan ?
                <Row className='studyplan-text mb-4'>
                    <Col align='left' xs={2}>{props.studyPlan.type}</Col>
                    <Col align='left'> {creditsRange[props.studyPlan.type].min} - {creditsRange[props.studyPlan.type].max} credits</Col>
                </Row>
                :
                <FormNewStudyPlan setNewStudyPlan={setNewStudyPlan} setStudyPlan={props.setStudyPlan} />
            }

            <Row>
                <StudyPlanTable courses={props.courses} studyPlan={props.studyPlan.courses} type={props.studyPlan.type} handleRemoveCourse={handleRemoveCourse} />
            </Row>

            {
                props.studyPlan ?
                    <Row className='studyplan-text'>
                        <Col className='col-10' align='right'><p>tot credits:</p></Col>
                        <Col className='col-2' align='center'><p>{props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0)}</p></Col>
                    </Row>
                    : <></>
            }

            {
                props.studyPlan ?
                    <Row>
                        <Col className='col-1' align='right'>
                            <Button disabled={!valid && newStudyPlan} variant='dark' size='sm' onClick={handleSave}>Save</Button>
                        </Col>
                        <Col className='col-1' align='left'>
                            <Button variant='dark' size='sm' onClick={handleCancel}>Cancel</Button>
                        </Col>
                        {
                            newStudyPlan ?
                                <></>
                                :
                                <Col className='col-10' align='right'>
                                    <Button variant='danger' size='sm' onClick={handleDelete}>Delete</Button>
                                </Col>
                        }
                    </Row>
                    :
                    <></>
            }


            <Row align='left' className='studyplan-text mt-5'>
                <h2>University Courses</h2>
            </Row>

            <Row className='mt-2'>
                <CourseTable courses={props.courses} studyPlan={props.studyPlan.courses ? props.studyPlan.courses : undefined} handleAddCourse={handleAddCourse} />
            </Row>

        </Container >
    )
}


function StudyPlanTable(props) {
    return (
        <Table responsive="sm">
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



function FormNewStudyPlan(props) {
    const [type, setType] = useState("full-time");

    const handleFormSubmit = (event) => {
        event.preventDefault();
        props.setStudyPlan(new StudyPlan(type, []));
        props.setNewStudyPlan(true);
    }

    return (
        <Form onSubmit={handleFormSubmit}>
            <Form.Group className='studyplan-text mb-5' as={Row} controlId="formStudyPlanType">
                <Form.Label column sm={2}>new study plan</Form.Label>
                <Col className='col-3'>
                    <Form.Select defaultValue="full-time" onChange={event => setType(event.target.value)}>
                        <option>full-time</option>
                        <option>part-time</option>
                    </Form.Select>
                </Col>
                <Col className='col-2' align='right'>
                    <Button variant='dark' size='sm' type="submit">Create</Button>
                </Col>
            </Form.Group>
        </Form>
    )

}

export default StudyPlanApp;