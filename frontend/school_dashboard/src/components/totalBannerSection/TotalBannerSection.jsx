import React, { useContext, useEffect, useState } from 'react';
import './totalBannerSection.css';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

export const TotalBannerSection = () => {
    const [totalCounts, setTotalCounts] = useState({
        totalTeachers: "",
        totalStudents: "",
        totalBooks: "",
    });
    const { backendUrl, api } = useContext(AppContext);

    useEffect(() => {
        const getDashboardTotalCounts = async () => {
            try {
                const response = await api.get(`${backendUrl}/dashboard/dashboard-counts`);
                if(response.status === 200) {
                    setTotalCounts(response.data.data);
                }
            } catch (error) {
                toast.error(error.response?.data?.data?.message || "Something went wrong! Try again later.");
            }
        }
        getDashboardTotalCounts();
    }, []);
    return (
        <div className="dashboard">
            <div className="card">
                <img src="Gallery/total_teachers_icon.png" className="image" />
                <h2>Total Teachers</h2>
                <p>{totalCounts.totalTeachers}</p>
            </div>
            <div className="card">
                <img src="Gallery/total_students_icon.png" className="image" />
                <h2>Total Students</h2>
                <p>{totalCounts.totalStudents}</p>
            </div>
            <div className="card">
                <img src="Gallery/total_courses_icon.png" className="image" />
                <h2>Total Books</h2>
                <p>{totalCounts.totalBooks}</p>
            </div>
        </div>
    )
}
