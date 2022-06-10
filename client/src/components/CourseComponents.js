import { Container, Table } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { PlusSquareFill, CheckLg } from 'react-bootstrap-icons'

function CourseTable(props) {
    return (
        <Container>
            <Table responsive="sm" className='course-table'>
                <thead>
                    <tr>
                        {props.studyPlan ? <th></th> : <></>}
                        <th className='col-2'>code</th>
                        <th className='col-5'>name</th>
                        <th className='col-1'>credits</th>
                        <th className='col-2'>maxStudents</th>
                        <th className='col-2'>enrolledStudents</th>
                    </tr>
                </thead>
                <tbody>
                    {props.courses.map((course) => <CourseRow courses={props.courses} course={course} key={course.code}
                        addColumn={props.studyPlan ? true : false} handleAddCourse={props.handleAddCourse}
                        courseInStudyplan={props.studyPlan && props.studyPlan.find(c => c === course.code) ? true : false}
                        showErr={props.studyPlan && !props.studyPlan.find(courseCode => courseCode === course.code) && !props.checkAddCourse(course).isValid} />)}
                </tbody>
            </Table>
        </Container>
    )
};


function CourseRow(props) {
    const [showInfo, setShowInfo] = useState(false);

    const changeInfoState = () => { setShowInfo(!showInfo); }

    let rowStyle = '';
    if (showInfo) {
        rowStyle = 'active-table-row';
    }
    if (props.showErr) {
        rowStyle += ' error-table-row';
    }

    return (
        <>
            <tr className={rowStyle} onClick={changeInfoState}>
                {props.addColumn ?
                    <td>
                        {props.courseInStudyplan ?
                            <CheckLg className='table-icon' size={22} />
                            :
                            <PlusSquareFill className='table-icon table-icon-hover' size={22} onClick={(event) => { event.stopPropagation(); props.handleAddCourse(props.course); }} />
                        }
                    </td>
                    : <></>
                }
                <CourseData course={props.course} />
            </tr>
            {showInfo ? <CourseInfo courses={props.courses} course={props.course} addColumn={props.addColumn} /> : <></>}
        </>
    )
};


function CourseData(props) {
    return (
        <>
            <td align='center'> {props.course.code} </td>
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
                {props.addColumn ? <td></td> : <></>}
                <td className='table-header-info' colSpan={1}>preparatory course </td>
                {props.course.preparatoryCourse ?
                    <>
                        <td align='center' colSpan={1}>
                            {props.course.preparatoryCourse}</td>
                        <td align='left' colSpan={3}>
                            {props.courses.find(c => c.code === props.course.preparatoryCourse).name}</td>
                    </>
                    :
                    <></>
                }
            </tr>

            <tr className='table-row-info' align='center'>
                {props.addColumn ? <td></td> : <></>}
                <td className='table-header-info'> incompatible courses </td>
                {props.course.incompatibleCourses[0] ?
                    <IncompatibleCourseData first={true} course={props.courses.find((c) => c.code === props.course.incompatibleCourses[0])} />
                    :
                    <></>
                }
            </tr>

            {props.course.incompatibleCourses.map((ic, idx) =>
                <IncompatibleCourseData course={props.courses.find((c) => c.code === ic)} idx={idx} addColumn={props.addColumn} key={idx} />
            )}

            <tr className='bordered-table-row' key={`border${props.course.code}`}></tr>
        </>
    );
}


function IncompatibleCourseData(props) {
    if (props.first)
        return (
            <>
                <td colSpan={1} align='center'> {props.course.code} </td>
                <td colSpan={3} align='left'>{props.course.name} </td>
            </>
        );
    else
        return (
            <>
                {props.idx === 0 ?
                    <></>
                    :
                    <tr className='table-row-info'>
                        <td colSpan={props.addColumn ? 2 : 1}></td>
                        <td colSpan={1} align='center'> {props.course.code} </td>
                        <td colSpan={3} align='left'> {props.course.name} </td>
                    </tr>
                }
            </>
        );
}



export { CourseTable };