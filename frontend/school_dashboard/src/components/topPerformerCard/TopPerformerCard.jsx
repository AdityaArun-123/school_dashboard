import React, { useState } from 'react';
import './topPerformerCard.css';

export const TopPerformerCard = () => {

    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    return (
        <div className="top-performer-card-container">
            <h2>Top Performer</h2>

            <div className="filter-container">
                <select>
                    <option value="">Select Class</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                </select>

                <select>
                    <option value="">Select Section</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                </select>

                <select>
                    <option value="">Select Year</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Roll No.</th>
                        <th>Year</th>
                        <th>Marks</th>
                        <th>Rank</th>
                    </tr>
                </thead>
                <tbody id="dataTable">
                    <tr>
                        <td>
                            <img className="profile-img" src="Gallery/avatar_img.avif" alt="profile" />
                        </td>
                        <td>Aryan Sharma</td>
                        <td>005114</td>
                        <td>2019</td>
                        <td>1440</td>
                        <td className="rank">
                            <span>98.95%</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img className="profile-img" src="Gallery/avatar_img.avif" alt="profile" />
                        </td>
                        <td>Priya Verma</td>
                        <td>245690</td>
                        <td>2020</td>
                        <td>1225</td>
                        <td className="rank">
                            <span>97.85%</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img className="profile-img" src="Gallery/avatar_img.avif" alt="profile" />
                        </td>
                        <td>Rohan Mehta</td>
                        <td>874512</td>
                        <td>2018</td>
                        <td>875</td>
                        <td className="rank">
                            <span>95.65%</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img className="profile-img" src="Gallery/avatar_img.avif" alt="profile" />
                        </td>
                        <td>Ananya Iyer</td>
                        <td>369852</td>
                        <td>2021</td>
                        <td>1350</td>
                        <td className="rank">
                            <span>99.10%</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img className="profile-img" src="Gallery/avatar_img.avif" alt="profile" />
                        </td>
                        <td>Dev Patel</td>
                        <td>741025</td>
                        <td>2017</td>
                        <td>920</td>
                        <td className="rank">
                            <span>96.25%</span>
                        </td>
                    </tr>
                </tbody>

            </table>

            <div className="pagination">
                <button>« Prev</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>Next »</button>
            </div>
        </div>
    );
};
