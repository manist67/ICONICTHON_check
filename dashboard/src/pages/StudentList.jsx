import Title from "../components/Title";
import '../assets/StudentList.css'
import StudentCard from "../components/StudentCard";
import { useState } from "react";

export default function StudentList() {
    const [ studentList,  ] = useState([
        { id: 1, name: "김철각", status: "appear" },
        { id: 1, name: "도철각", status: "run" },
        { id: 1, name: "박국각", status: "disappear" },
    ]);

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