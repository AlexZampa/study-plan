import { Container, Row, Col, Table, Form, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { CourseTable } from './CourseComponents';
import { toast } from 'react-toastify';


function StudyPlanApp(props) {
    const [studyPlanCourses, setStudyPlanCourses] = useState(props.studyPlan.courses);

    const handleAddCourse = (course) => {
        setStudyPlanCourses(oldStudyPlanCourses => {
            return ([...oldStudyPlanCourses, course.code]);
        });
    };

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
                <StudyPlanTable courses={props.courses} studyPlan={studyPlanCourses} type={props.studyPlan.type} />
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
                <CourseTable courses={props.courses} studyPlan={true} handleAddCourse={handleAddCourse} />
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
                    <th>code</th>
                    <th>name</th>
                    <th>credits</th>
                </tr>
            </thead>
            <tbody>
                {props.studyPlan ? props.studyPlan.map(course =>
                    <StudyPlanRow course={props.courses.find(c => c.code === course)} key={props.type + course} />)
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