import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from 'classnames';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
export default function StudentCard({ studentId, studentName, studentStatus }) {
    const studentStatusKorean = useMemo(()=>{
      switch(studentStatus) {
        case "ATTEND": return "출 석";
        case "ABSENT": return "결 석";
        case "LEAVE": return "출 튀";
        case "FAKE": return "대리 출석";
      }
    }, [ studentStatus ]);
  
    const studentStatusLabel = useMemo(()=>{
      switch(studentStatus) {
        case "ATTEND": return "";
        case "ABSENT": return "disappear";
        case "LEAVE": case "FAKE": return "run";
      }
    }, [ studentStatus ]);

    const navigate = useNavigate();
    const onClickStudent = useCallback(()=>{
      navigate(`/${studentId}/detail`);
    }, [ navigate, studentId ])
    

    const onClickCalendar = useCallback((e)=>{
      navigate(`/${studentId}/calendar`);
      e.stopPropagation();
    }, [ navigate, studentId ])

    const [ attitudes, setAttitudes ] = useState([]);
    useEffect(()=>{
      async function fetchData() {
        const { data } = await axios.get(`/attitudes/${studentId}`);
        setAttitudes(data.filter((_,i) => (i < 100)).reverse());
      }
      fetchData();
    }, [ studentId ])

    return (
      <div className='student-card' onClick={onClickStudent}>
          <div className="div-name">
              {studentName}
          </div>
          <div className={classNames('attendance-label', studentStatusLabel)} onClick={onClickCalendar}>
              {studentStatusKorean}
          </div>
          <div className="student-graph">
            {attitudes.map((e, i)=>{
              const per = Math.floor(Math.random() * 20 - 10) + (!e.attitude ? 30 : 90)
              return <div key={`${studentId}-bar-${i}`} 
                style={{height: `${per}%`}}
                className={classNames("bar", !e.attitude ? 'bar-bottom': 'bar-top')}/>
            })}
          </div>
      </div>
    )
}