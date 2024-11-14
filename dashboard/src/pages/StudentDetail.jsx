import { useParams } from "react-router-dom";
import Title from "../components/Title";
import "../assets/StudentDetail.css";

export default function StudentDetail() {
    const params = useParams();
    console.log(params);

    return (
        <div className="student-detail-wrapper">
            <Title iconName="fluent:person-16-regular">학생 현재 상태</Title>
            <h2>
                <span className="span-name">김유민</span>
                <span className="span-subtitle">학생</span>
            </h2>
            <div className="status-wrapper attendance-status-wrapper">
                <h3>출결 현황</h3>
                <p>
                    현재 김유민 학생은 <i>출석</i> 했습니다.
                </p>
            </div>
            <div className="status-wrapper focus-status-wrapper">
                <h3>집중도 현황</h3>
                <p>
                    현재 김유민 학생은 <i>집중</i>하고 있어요.
                </p>
            </div>
        </div>
    )
}