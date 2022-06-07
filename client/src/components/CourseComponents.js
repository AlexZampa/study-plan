import { Button, Container, Table } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';

function CourseTable(props) {
    return (
        <Container>
            <Table responsive="sm" className='course-table'>
                <thead>
                    <tr>
                        <th className='col-2'>code</th>
                        <th className='col-5'>name</th>
                        <th className='col-1'>credits</th>
                        <th className='col-2'>maxStudents</th>
                        <th className='col-2'>enrolledStudents</th>
                        {props.studyPlan ? <th></th> : <></>}
                    </tr>
                </thead>
                <tbody>
                    {props.courses.map((course) => <CourseRow courses={props.courses} course={course} key={course.code} studyPlan={props.studyPlan} handleAddCourse={props.handleAddCourse}/>)}
                </tbody>
            </Table>
        </Container>
    )
};


function CourseRow(props) {
    const [showInfo, setShowInfo] = useState(false);

    const changeInfoState = () => { setShowInfo(!showInfo); }

    return (
        <>
            <tr className={showInfo ? 'active-table-row' : undefined} onClick={changeInfoState}>
                <CourseData course={props.course} />
                {props.studyPlan ? 
                <td><Button variant='dark' size='sm' onClick={(event) => {event.stopPropagation(); props.handleAddCourse(props.course);}}>ADD</Button></td> : <></>}
            </tr>
            {showInfo ? <CourseInfo courses={props.courses} course={props.course} /> : <></>}
        </>
    )
};


function CourseData(props) {
    return (
        <>
            <td align='left'> {props.course.code} </td>
            <td align='left'> {props.course.name} </td>
            <td> {props.course.credits} </td>
            <td> {props.course.maxStudents ? props.course.maxStudents : '-'} </td>
            <td> {props.course.enrolledStudents} </td>
        </>);
};


function CourseInfo(props) {    
    return (
        <>
            <tr className='table-row-info' align='center'>
                <th className='table-header-info' colSpan={1}>preparatory course </th>
                {props.course.preparatoryCourse ?
                    <>
                        <td align='center' colSpan={1}> {props.course.preparatoryCourse ? props.course.preparatoryCourse : '-'}</td>
                        <td align='left' colSpan={3}> {props.course.preparatoryCourse ? props.courses.find(c => c.code === props.course.preparatoryCourse).name : '-'}</td>
                    </>
                    : <></>
                }
            </tr>
            <tr className='table-row-info' align='center' key={(`${props.course.code}${props.course.incompatibleCourses[0]}`)}>
                <th className='table-header-info'> incompatible courses </th>
                {props.course.incompatibleCourses[0] ?
                    <>
                        <td colSpan={1} align='center'>
                            {props.course.incompatibleCourses[0]}
                        </td>
                        <td colSpan={3} align='left'>
                            {props.courses.find((c) => c.code === props.course.incompatibleCourses[0]).name}
                        </td>
                    </>
                    : <></>
                }
            </tr>
            {props.course.incompatibleCourses.map((ic, idx) => {
                const incompatibleCourse = props.courses.find((c) => c.code === ic)
                if (idx === 0) {
                    return (<></>);
                } else {
                    return (
                        <tr className='table-row-info' key={`${props.course.code}${incompatibleCourse.code}`}>
                            <td></td>
                            <td colSpan={1} align='center'>
                                {incompatibleCourse.code}
                            </td>
                            <td colSpan={3} align='left'>
                                {incompatibleCourse.name}
                            </td>
                        </tr>
                    );
                }
            })}
            <tr className='bordered-table-row'></tr>
        </>
    );
}

export { CourseTable };