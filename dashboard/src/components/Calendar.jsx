import classNames from "classnames";
import dayjs from "dayjs";
import { useMemo } from "react"
import getKoreanEnum from "../utils/getKoreanEnum";

// eslint-disable-next-line react/prop-types
export default function Calendar({ attendances, year, month }) {
    const calenderLines = useMemo(()=>{
        const lastDate = dayjs(`${year}-${month+1}-1`).endOf("month").date();
        const lastDay = dayjs(`${year}-${month+1}-1`).endOf("month").day();
        const firstDay = dayjs(`${year}-${month+1}-1`).startOf("month").day();
        const previousLastDate = dayjs(`${year}-${month}-1`).endOf("month").date();

        const result = [];
        let startDay = -firstDay;
        let week = [];
        for(let i = startDay, j = 0; i < lastDate + (6-lastDay); i++, j++) {
            const currentDate = dayjs(`${year}-${month+1}-1`).add(i, 'days').format("YYYY-MM-DD");

            if(j == 7) {
                result.push(<div className="div-line" key={`cal-line-${i}`}>{week}</div>);
                week = [];
                j = 0;
            }
            if(i < 0) {
                week.push(<div className="div-date item" key={`cal-date-${i}`}>
                    <p className="date-indicator previous">{previousLastDate + i + 1}</p> 
                    { attendances[currentDate] && <p className={classNames("attendance", attendances[currentDate])}>{getKoreanEnum(attendances[currentDate])}</p> }
                </div>)
            } else if( i >= lastDate) {
                week.push(<div className="div-date item" key={`cal-date-${i}`}>
                    <p className="date-indicator previous">{i - lastDate + 1}</p> 
                    { attendances[currentDate] && <p className={classNames("attendance", attendances[currentDate])}>{getKoreanEnum(attendances[currentDate])}</p> }
                </div>)
            } else {
                week.push(<div className="div-date item" key={`cal-date-${i}`}>
                    <p className="date-indicator">{i + 1}</p>
                    { attendances[currentDate] && <p className={classNames("attendance", attendances[currentDate])}>{getKoreanEnum(attendances[currentDate])}</p> }
                </div>)
            }
        }

        result.push(<div className="div-line" key={`cal-last-line`}>{week}</div>);

        return result
    }, [year, month, attendances]);

    return (<div className="calendar">
        <div className="div-line">
            <div className="div-date">Sun</div>
            <div className="div-date">Mon</div>
            <div className="div-date">Tue</div>
            <div className="div-date">Wed</div>
            <div className="div-date">Thu</div>
            <div className="div-date">Fri</div>
            <div className="div-date">Sat</div>
        </div>
        <div>
            {calenderLines}
        </div>
    </div>)
}