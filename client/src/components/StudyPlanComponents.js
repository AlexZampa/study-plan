import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CourseTable } from './CourseComponents';
import { toast } from 'react-toastify';
import StudyPlan from '../utils/StudyPlan';
import { creditsRange } from '../utils/StudyPlan';
import { Trash3Fill } from 'react-bootstrap-icons'
import { useEffect, useState } from 'react';
import Course from '../utils/Course';

function StudyPlanPage(props) {
    // used to hide button delete study plan when user does not have a study plan and to change API call when saving
    const [newStudyPlan, setNewStudyPlan] = useState(false);
    // used to disable button save when credits not in range
    const [valid, setValid] = useState(false);

    // check if study plan is valid (credits range) every time the study plan courses change
    useEffect(() => {
        if (props.studyPlan) {
            const totCredits = props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0);
            if (totCredits >= creditsRange[props.studyPlan.type].min && totCredits <= creditsRange[props.studyPlan.type].max)
                setValid(true);
            else
                setValid(false);
        }
        else {
            setValid(false);
        }
    }, [props.studyPlan.courses])

    // commit changes
    const handleSave = async () => {
        if (newStudyPlan) {
            const success = await props.createStudyPlan(props.studyPlan);
            if(success)
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
            return { isValid: false, errMsg: <div>Missing preparatory course:<br />{props.courses.find(c => c.code === course.preparatoryCourse).name}</div>, errId: `err-${course.code}-prep-course`};
        // check number of enrolled students
        if (course.enrolledStudents === course.maxStudents)
            return { isValid: false, errMsg: "Course has reached maximum number of enrolled students", errId: `err-${course.code}-max-students` };
        // check incompatible courses
        for (const ic of course.incompatibleCourses) {
            const incompatibleCourse = props.studyPlan.courses.find(sc => sc === ic);
            if (incompatibleCourse)
                return { isValid: false, errMsg: <div>Incompatible course:<br />{props.courses.find(c => c.code === incompatibleCourse).name}</div>, errId: `err-${course.code}-incompatible-course` };
        }
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
                return { isValid: false, errMsg: <div>The course is a preparatory course of:<br />{spc.name}</div>, errId: `err-rm-${course.code}-prep-course` };
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
            // add 1 enrolled student to course (locally)
            props.updateCourse(new Course(course.code, course.name, course.credits, course.enrolledStudents + 1, course.maxStudents, course.preparatoryCourse, course.incompatibleCourses));
        }
        else
            toast.error(check.errMsg, { toastId: check.errId, autoClose: 4000, pauseOnHover: true, hideProgressBar: false });
    };

    /*** function to remove course from studyPlan ***/
    const handleRemoveCourse = (course) => {
        const check = checkRemoveCourse(course);
        if (check.isValid) {
            props.setStudyPlan((oldStudyPlan) => {
                return new StudyPlan(oldStudyPlan.type, oldStudyPlan.courses.filter(c => c !== course.code));
            });
            // remove 1 enrolled student to course (locally)
            props.updateCourse(new Course(course.code, course.name, course.credits, course.enrolledStudents - 1, course.maxStudents, course.preparatoryCourse, course.incompatibleCourses));
        }
        else
            toast.error(check.errMsg, { toastId: check.errId, autoClose: 4000, pauseOnHover: true, hideProgressBar: false });
    }


    return (
        <Container fluid>
            {props.studyPlan ?
                <Row className='studyplan-text mb-4'>
                    <Col align='left' xs={2}>{props.studyPlan.type}</Col>
                    <Col align='left'> {creditsRange[props.studyPlan.type].min} - {creditsRange[props.studyPlan.type].max} credits</Col>
                </Row>
                :
                <FormNewStudyPlan setNewStudyPlan={setNewStudyPlan} setStudyPlan={props.setStudyPlan} />
            }

            {props.studyPlan ?
                <Row>
                    <StudyPlanTable courses={props.courses} studyPlan={props.studyPlan.courses} type={props.studyPlan.type} handleRemoveCourse={handleRemoveCourse} />
                </Row>
                :
                <></>
            }

            {props.studyPlan ?
                <Row className={valid ? 'studyplan-text' : 'studyplan-text studyplan-text-error'} >
                    <Col className='col-10' align='right'><p>tot credits:</p></Col>
                    <Col className='col-2' align='center'><p>{props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0)}</p></Col>
                </Row>
                :
                <></>
            }

            {props.studyPlan ?
                <Row>
                    <Col className='col-1' align='right'>
                        <Button disabled={!valid} variant='dark' size='sm' onClick={handleSave}>Save</Button>
                    </Col>
                    <Col className='col-1' align='left'>
                        <Button variant='dark' size='sm' onClick={handleCancel}>Cancel</Button>
                    </Col>
                    {
                        newStudyPlan ?
                            <></>
                            :
                            <Col className='col-10' align='right'>
                                <Button variant='danger' size='sm' onClick={handleDelete}>Delete study plan</Button>
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
                <CourseTable courses={props.courses} studyPlan={props.studyPlan.courses ? props.studyPlan.courses : undefined} handleAddCourse={handleAddCourse} checkAddCourse={checkAddCourse} />
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
                <Col className='col-3'>
                    <Form.Select defaultValue="full-time" onChange={event => setType(event.target.value)}>
                        <option value='full-time'>full-time ({creditsRange['full-time'].min} - {creditsRange['full-time'].max} credits)</option>
                        <option value='part-time'>part-time ({creditsRange['part-time'].min} - {creditsRange['part-time'].max} credits)</option>
                    </Form.Select>
                </Col>
                <Col className='col-3' align='right'>
                    <Button variant='dark' size='sm' type="submit">new study plan</Button>
                </Col>
            </Form.Group>
        </Form>
    )

}

export default StudyPlanPage;