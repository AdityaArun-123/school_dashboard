import React, { useContext, useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import './attendenceChart.css';
import { AppContext } from '../../context/AppContext';

export const AttendenceChart = () => {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [attendanceData, setAttendanceData] = useState([]);
    const [showPresent, setShowPresent] = useState(true);

    const { backendUrl, api } = useContext(AppContext);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await api.get(`${backendUrl}/attendance/get-student-teacher-attendance-percent?year=${year}`);
                if (response.status === 200) {
                    setAttendanceData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch attendance data:", error);
            }
        };

        fetchAttendanceData();
    }, [year]);

    const chartXAxisNames = attendanceData.map(data =>
        new Date(year, data.month - 1).toLocaleString('default', { month: 'short' })
    );

    const studentData = attendanceData.map(data =>
        showPresent ? data.studentPresentPercent : data.studentAbsentPercent
    );

    const teacherData = attendanceData.map(data =>
        showPresent ? data.teacherPresentPercent : data.teacherAbsentPercent
    );

    const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

    return (
        <div className="attendence-container">
            <div className="header">
                <h2>Attendance Chart</h2>

                <div className="year-selector">
                    <label htmlFor="year-select">Select Year :- </label>
                    <select id="year-select" value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="toggle-buttons">
                <button className={showPresent ? "active show-present-btn" : "show-present-btn"} onClick={() => setShowPresent(true)} >Show Present %</button>
                <button className={!showPresent ? "active show-absent-btn" : "show-absent-btn"} onClick={() => setShowPresent(false)} >Show Absent %</button>
            </div>

            <Chart
                type="bar"
                width={1180}
                height={500}
                series={[
                    {
                        name: "Teachers",
                        data: teacherData,
                    },
                    {
                        name: "Students",
                        data: studentData,
                    },
                ]}
                options={{
                    xaxis: {
                        tickPlacement: "off",
                        categories: chartXAxisNames,
                        labels: {
                            style: { fontSize: 11, fontFamily: "Roboto_Font", fontWeight: 600 },
                        }
                    },

                    yaxis: {
                        min: 0,             
                        max: 100,              
                        tickAmount: 10,
                        labels: {
                            formatter: (val) => {
                                return `${val}%`;
                            },
                            style: { fontSize: 11, fontFamily: "Roboto_Font", fontWeight: 600 },
                        },
                        title: {
                            text: showPresent ? "Present (%)" : "Absent (%)",
                            style: { fontSize: 13, fontFamily: "Roboto_Font", fontWeight: 900 },
                        },
                    },

                    legend: {
                        show: true,
                        position: "bottom",
                    },
                }}
            ></Chart>
        </div>
    );
};