import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { CourseTable } from './CourseComponents';
import { toast } from 'react-toastify';


function StudyPlanApp(props) {
    const [showCourses, setShowCourses] = useState(false);

    const hideCoursesTable = () => setShowCourses(false);
    const showCoursesTable = () => setShowCourses(true);

    return (
        <Container fluid>
            {props.studyPlan ?
                <Row className='studyplan-text mb-4'>
                    <Col align='left' xs={2}> <h2>type:</h2></Col>
                    <Col align='left'><p> {props.studyPlan.type} </p> </Col>
                </Row>
                : <></>
            }

            <Row align='left' className='studyplan-text'>
                <h2>Courses:</h2>
            </Row>

            <Row>
                <StudyPlanTable courses={props.courses} studyPlan={props.studyPlan} />
            </Row>

            <Row className='studyplan-text' >
                <Col className='col-2' align='left'>
                    {props.studyPlan ? 
                    <>
                        <ButtonEdit showCourses={showCourses} showCoursesTable={showCoursesTable} />
                        <ButtonDelete showCourses={showCourses} />
                    </>
                    : <ButtonAdd showCourses={showCourses} showCoursesTable={showCoursesTable} /> 
                    }
                </Col>
                {props.studyPlan ? <>
                    <Col className='col-8' align='right'><p>tot credits:</p></Col>
                    <Col className='col-2' align='center'><p>{props.studyPlan.courses.reduce((total, courseCode) => total + props.courses.find(c => c.code === courseCode).credits, 0)}</p></Col>
                </> : <></>
                }
            </Row>

            {showCourses ?
                <>
                    <Row className='mt-5'>
                        <CourseTable courses={props.courses} />
                    </Row>

                    <Row>
                        <Col className='col-1' align='left'>
                            <Button variant='success' onClick={hideCoursesTable}>Save</Button>
                        </Col>
                        <Col className='col-1' align='left'>
                            <Button variant='danger' onClick={hideCoursesTable}>Cancel</Button>
                        </Col>
                    </Row>
                </>
                : <></>}
        </Container>
    )
}


function StudyPlanTable(props) {
    return (
        <Table responsive="sm" hover>
            <thead>
                <tr>
                    <th>code</th>
                    <th>name</th>
                    <th>credits</th>
                </tr>
            </thead>
            <tbody>
                {props.studyPlan ? props.studyPlan.courses.map(course =>
                    <StudyPlanRow course={props.courses.find(c => c.code === course)} key={props.studyPlan.type + course} />)
                    : <></>
                }
            </tbody>
        </Table>
    );
}


function StudyPlanRow(props) {
    return (
        <tr>
            <td>{props.course.code}</td>
            <td>{props.course.name}</td>
            <td>{props.course.credits}</td>
        </tr>
    );
}

function ButtonAdd(props) {
    return (
        <>
            {!props.showCourses ?
                <Button className='mt-5' variant='dark' size='md' onClick={props.showCoursesTable}>Add</Button>
                : <></>
            }
        </>
    );
}

function ButtonEdit(props) {
    return (
        <>
            {!props.showCourses ?
                <Button className='mt-5' variant='dark' size='md' onClick={props.showCoursesTable}>Edit</Button>
                : <></>
            }
        </>
    );
}


function ButtonDelete(props) {
    const handleDelete = () => {
        toast.warning("Are you sure?", {position: "top-center", autoClose: false})
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