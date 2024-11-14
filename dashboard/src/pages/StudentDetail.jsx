import { useParams } from "react-router-dom";
import Title from "../components/Title";
import "../assets/StudentDetail.css";
import { useEffect, useState } from "react";
import axios from 'axios';
import getKoreanEnum from "../utils/getKoreanEnum.js";
import classNames from "classnames";

export default function StudentDetail() {
    const params = useParams();

    const [ studentAttitude, setStudentAttitude ] = useState();
    const [ studentName, setStudentName ] = useState();
    const [ studentStatus, setStudentStatus ] = useState();
    
    useEffect(()=>{
        async function fetchStudent() {
            const { data } = await axios.get(`/students`);
            const student = data.find(e=>e.id == params.id);
            
            setStudentName(student.name)
        }

        async function fetchAttendance() {
            const { data } = await axios.get(`/attendances/${params.id}`);
            if(data.length >= 1) setStudentStatus(data[data.length - 1].attendanceStatus);
        }

        async function fetchAttitude() {
            const { data } = await axios.get(`/attitudes/${params.id}/latest`);
            if(Number.isInteger(data?.result)) setStudentAttitude(data.result ? "집중" : "집중 못 ");
        }

        fetchStudent();
        fetchAttendance();
        fetchAttitude();
    }, [ params ])

    return (
        <div className="student-detail-wrapper">
            <Title iconName="fluent:person-16-regular">학생 현재 상태</Title>
            <h2>
                <span className="span-name">{studentName}</span>
                <span className="span-subtitle">학생</span>
            </h2>
            {studentStatus && <div className="status-wrapper attendance-status-wrapper">
                <h3>출결 현황</h3>
                <p>
                    현재 {studentName} 학생은 <i className={classNames(studentStatus)}>{getKoreanEnum(studentStatus)}</i> 했습니다.
                </p>
            </div>}
            {studentAttitude && <div className="status-wrapper focus-status-wrapper">
                <h3>집중도 현황</h3>
                <p>
                    현재 {studentName} 학생은 <i className={classNames(studentAttitude == "집중" ? "BLUE": "RED")}>{studentAttitude}</i>하고 있어요.
                </p>
            </div>}
        </div>
    )
}