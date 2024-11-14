import Title from "../components/Title";
import "../assets/StudentCalendar.css";
import Calendar from "../components/Calendar";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from 'dayjs'
import intToMonth from "../utils/intToMonth";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from 'axios';
import { useParams } from "react-router-dom";

export default function StudentCalendar() {
    const params = useParams();
    const [ today, ] = useState(dayjs());
    const [ year, setYear ] = useState(today.year());
    const [ month, setMonth ] = useState(today.month());

    const [ studentName, setStudentName ] = useState();
    const [ attendances, setAttendances ] = useState({});

    useEffect(()=>{
        async function fetchStudent() {
            const { data } = await axios.get(`/students`);
            const student = data.find(e=>e.id == params.id);
            
            setStudentName(student.name)
        }
        async function fetchData() {
            const { data } = await axios.get(`/attendances/${params.id}`);
            const attendances = {};
            for(let att of data) {
                const d = dayjs.unix(att.time/1000);
                const key = d.format("YYYY-MM-DD")
                attendances[key] = att.attendanceStatus;
            }
            setAttendances(attendances);
        }
        fetchStudent();
        fetchData();
    }, [params])
    

    const monthEng = useMemo(() => {
        return intToMonth(month);
    }, [month]);

    const decreaseMonth = useCallback(()=>{
        if (month - 1 < 0) {
            setYear(year=>year-1);
            setMonth(11)
            return;
        }

        setMonth((prev)=>prev-1);
    }, [month])

    const increaseMonth = useCallback(()=>{
        if (month + 1 > 11) {
            setYear(year=>year+1);
            setMonth(0)
            return;
        }

        setMonth((prev)=>prev+1);
    }, [month])

    return (
        <div className="student-calendar-wrapper">
            <Title iconName="solar:calendar-outline">개인 학생 출결 현황</Title>
            <h2>
                <span className="span-name">{studentName}</span>
                <span className="span-subtitle">학생</span>
            </h2>
            <div className="calendar-wrapper">
                <div className="calendar-indicator">
                    <h1>
                        {monthEng}
                        <i>{year}</i>
                    </h1>
                    <div className="calendar-controller">
                        <button onClick={decreaseMonth}> 
                            <Icon icon="uil:angle-left-b" fontSize={36}></Icon>
                        </button>
                        <button onClick={increaseMonth}> 
                            <Icon icon="uil:angle-right-b" fontSize={36}></Icon>
                         </button>
                    </div>
                </div>
                <Calendar attendances={attendances} year={year} month={month}></Calendar>
            </div>
        </div>
    )
}