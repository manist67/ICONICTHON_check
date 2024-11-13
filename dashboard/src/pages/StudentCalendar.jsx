import Title from "../components/Title";
import "../assets/StudentCalendar.css";
import Calendar from "../components/Calendar";
import { useCallback, useMemo, useState } from "react";
import dayjs from 'dayjs'
import intToMonth from "../utils/intToMonth";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function StudentCalendar() {
    const [ today, ] = useState(dayjs());
    const [ year, setYear ] = useState(today.year());
    const [ month, setMonth ] = useState(today.month());

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
                <span className="span-name">김유민</span>
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
                <Calendar year={year} month={month}></Calendar>
            </div>
        </div>
    )
}