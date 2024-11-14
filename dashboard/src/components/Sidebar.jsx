import { Link, useLocation, useMatch } from "react-router-dom";

import '../assets/Sidebar.css'
import classNames from "classnames";
import { useMemo } from "react";

export default function Sidebar() {
	const location = useLocation();
	const detail = useMatch("/:id/detail", location);
	const calendar = useMatch("/:id/calendar", location);
	const id = useMemo(()=>{
		if(!detail && !calendar) return null;
		return {
			...detail?.params, ...calendar?.params
		}['id']
	}, [ detail, calendar ]);

	return (
		<aside>
			<Link to="/" className={classNames({"active": location.pathname == "/" })}>전체 학생 상태</Link>
			{ location.pathname != "/" ? <Link to={`/${id}/detail`} className={classNames({"active": detail })}>학생 현재 상태</Link> : <a className="disable">학생 현재 상태</a>}
			{ location.pathname != "/" ? <Link to={`/${id}/calendar`} className={classNames({"active": calendar })}>개인 학생 출결 현황</Link> : <a className="disable">개인 학생 출결 현황</a>}
		</aside>
	)
}