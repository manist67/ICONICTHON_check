import dayjs from "dayjs";
import { useMemo } from "react"

// eslint-disable-next-line react/prop-types
export default function Calendar({ year, month }) {
    const calenderLines = useMemo(()=>{
        const lastDate = dayjs(`${year}-${month+1}-1`).endOf("month").date();
        const lastDay = dayjs(`${year}-${month+1}-1`).endOf("month").day();
        const firstDay = dayjs(`${year}-${month+1}-1`).startOf("month").day();
        const previousLastDate = dayjs(`${year}-${month}-1`).endOf("month").date();
        console.log(lastDate, firstDay, lastDay)

        const result = [];
        let startDay = -firstDay;
        let week = [];
        for(let i = startDay, j = 0; i < lastDate; i++, j++) {
            if(j == 7) {
                result.push(<div className="div-line" key={`cal-line-${i}`}>{week}</div>);
                week = [];
                j = 0;
            }
            week.push(<div className="div-date item" key={`cal-date-${i}`}>
                {i < 0 ? <p className="previous">{previousLastDate + i + 1}</p> : <p>{i + 1}</p>}
                
            </div>)
        }

        for(let i = 0 ; i < (6-lastDay); i++) {
            week.push(<div className="div-date item" key={`cal-date-padding-${i}`}>
                <p className="next">{i + 1}</p>
            </div>)
        }

        result.push(<div className="div-line" key={`cal-last-line`}>{week}</div>);

        return result
    }, [year, month]);

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