import React from 'react';
import './studentDueFeeCard.css';

export const StudentDueFeeCard = () => {
    return (
        <div className="student-due-card-container">
            <h2>Student Fees Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        <th>Name</th>
                        <th>Course</th>
                        <th>Fees</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>101</td>
                        <td className="due-card-profile">
                            <img src="Gallery/avatar_img.avif" alt="" /> Rajesh Kumar
                        </td>
                        <td>B.Com</td>
                        <td>₹35,000</td>
                        <td className="due-date">
                            <span className="due" /> 15/03/2024
                        </td>
                    </tr>
                    <tr>
                        <td>102</td>
                        <td className="due-card-profile">
                            <img src="Gallery/avatar_img.avif" alt="" /> Priya Sharma
                        </td>
                        <td>B.Sc</td>
                        <td>₹42,500</td>
                        <td className="due-date">
                            <span className="due" /> 20/03/2024
                        </td>
                    </tr>
                    <tr>
                        <td>103</td>
                        <td className="due-card-profile">
                            <img src="Gallery/avatar_img.avif" alt="" /> Anil Mehta
                        </td>
                        <td>B.Tech</td>
                        <td>₹1,20,000</td>
                        <td className="due-date">
                            <span className="paid" /> 10/04/2024
                        </td>
                    </tr>
                    <tr>
                        <td>104</td>
                        <td className="due-card-profile">
                            <img src="Gallery/avatar_img.avif" alt="" /> Sunita Reddy
                        </td>
                        <td>MBA</td>
                        <td>₹2,50,000</td>
                        <td className="due-date">
                            <span className="paid" /> 25/04/2024
                        </td>
                    </tr>
                    <tr>
                        <td>105</td>
                        <td className="due-card-profile">
                            <img src="Gallery/avatar_img.avif" alt="" /> Vikram Singh
                        </td>
                        <td>B.A</td>
                        <td>₹28,000</td>
                        <td className="due-date">
                            <span className="paid" /> 30/04/2024
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="pagination">
                <button>« Prev</button>
                <button className='active'>1</button>
                <button>2</button>
                <button>3</button>
                <button>Next »</button>
            </div>
        </div>
    )
}
