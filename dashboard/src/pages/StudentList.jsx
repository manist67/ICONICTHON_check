import Title from "../components/Title";
import '../assets/StudentList.css'
import StudentCard from "../components/StudentCard";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function StudentList() {
    const [ studentList, setStudentList ] = useState([]);

    useEffect(()=>{
        async function fetchData() {
            const { data } = await axios.get("/students");
            setStudentList(await Promise.all(data.map(async e=>{
                const { data: attendance } = await axios.get(`/attendances/${e.id}`);
                console.log(attendance)
                if(attendance.length >= 1) e['status'] = attendance[attendance.length - 1].attendanceStatus;
                return e;
            })));
        }

        fetchData();
    }, [])

    return (
        <>
            <Title iconName="fluent:people-32-regular">전체 학생 상태</Title>
            <div className="student-list-wrapper">
                {studentList.map((student, idx)=>{
                    return (<StudentCard key={`card-${idx}`} 
                        studentId={student.id}
                        studentName={student.name} 
                        studentStatus={student.status}/>)
                })}
            </div>
        </>
    )
}