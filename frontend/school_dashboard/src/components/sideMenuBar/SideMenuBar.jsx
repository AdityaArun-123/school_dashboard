import React, { useState } from 'react';
import './sideMenuBar.css';
import { useNavigate } from 'react-router-dom'
import { LogOutModal } from '../logOutModal/LogOutModal';

export const SideMenuBar = () => {
  const [showStudentDropDown, setShowStudentDropDown] = useState(false);
  const [showTeacherDropDown, setShowTeacherDropDown] = useState(false);
  const [showBookDropDown, setShowBookDropDown] = useState(false);
  const [showTransportDropDown, setShowTransportDropDown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  const toggleStudentDropDown = () => {
    setShowStudentDropDown(!showStudentDropDown);
  };

  const toggleTeacherDropDown = () => {
    setShowTeacherDropDown(!showTeacherDropDown);
  };

  const toggleBookDropDown = () => {
    setShowBookDropDown(!showBookDropDown);
  };

  const toggleTransportDropDown = () => {
    setShowTransportDropDown(!showTransportDropDown);
  };

  return (
    <>
      {
        showLogoutModal && <LogOutModal onclose={() => { setShowLogoutModal(false) }} />
      }
      <div className="sidenav">
        <div className="sidenav-profile">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNcpAPf42amlwAEM-JybpV6AhT6Hpuhc07LAXA0xHy0w2bvErp4MFoMq7NWe2zU7SDyH4&usqp=CAU"
            alt=""
          />
          <h2>A.G.D.A.V School</h2>
        </div>
        <div className="icon_items">
          <ul>
            <li onClick={() => { navigate('/') }}>
              <span>
                <img src="Gallery/home_icon.png" alt="" />
                Home
              </span>
            </li>
            <li className={showStudentDropDown ? "user-item active" : "user-item"} onClick={toggleStudentDropDown}>
              <span>
                <img src="Gallery/student_icon.png" alt="" />
                <span className='drop-down-li'>Students</span>
                <img src="Gallery/drop-down-icon.png" alt="" className={showStudentDropDown ? "dropdown-icon active" : "dropdown-icon"} />
              </span>
              <ul className={showStudentDropDown ? "submenu active" : "submenu"}>
                <li onClick={() => { navigate('/add-student') }}>
                  Add Student
                </li>
                <li onClick={() => { navigate('/view-all-students') }}>
                  View All Students
                </li>
                <li onClick={() => { navigate('/mark-student-attendence') }}>
                  Mark Student Attendence
                </li>
                <li onClick={() => { navigate('/get-student-attendence') }}>
                  Get Student Attendence
                </li>
              </ul>
            </li>

            <li className={showTeacherDropDown ? "user-item active" : "user-item"} onClick={toggleTeacherDropDown}>
              <span>
                <img src="Gallery/teacher_icon.png" alt="" />
                <span className='drop-down-li'>Teachers</span>
                <img src="Gallery/drop-down-icon.png" alt="" className={showTeacherDropDown ? "dropdown-icon active" : "dropdown-icon"} />
              </span>
              <ul className={showTeacherDropDown ? "submenu active" : "submenu"}>
                <li onClick={() => { navigate('/add-teacher') }}>
                  Add Teacher
                </li>
                <li onClick={() => { navigate('/view-all-teachers') }}>
                  View All Teachers
                </li>
                <li onClick={() => { navigate('/mark-teacher-attendence') }}>
                  Mark Teacher Attendence
                </li>
                <li onClick={() => { navigate('/get-teacher-attendence') }}>
                  Get Teacher Attendence
                </li>
              </ul>
            </li>

            <li className={showBookDropDown ? "user-item active" : "user-item"} onClick={toggleBookDropDown}>
              <span>
                <img src="Gallery/book_icon.png" alt="" />
                <span className='drop-down-li'>Books</span>
                <img src="Gallery/drop-down-icon.png" alt="" className={showBookDropDown ? "dropdown-icon active" : "dropdown-icon"} />
              </span>
              <ul className={showBookDropDown ? "submenu active" : "submenu"}>
                <li onClick={() => { navigate('/add-books') }}>
                  Add Book
                </li>
                <li onClick={() => { navigate('/view-all-books') }}>
                  View All Books
                </li>
              </ul>
            </li>

            <li className={showTransportDropDown ? "user-item active" : "user-item"} onClick={toggleTransportDropDown}>
              <span>
                <img src="Gallery/transport_icon.png" alt="" />
                <span className='drop-down-li'>Transport</span>
                <img src="Gallery/drop-down-icon.png" alt="" className={showTransportDropDown ? "dropdown-icon active" : "dropdown-icon"} />
              </span>
              <ul className={showTransportDropDown ? "submenu active" : "submenu"}>
                <li onClick={() => { navigate('/add-transport') }}>
                  Add Transport
                </li>
                <li onClick={() => { navigate('/view-all-transport') }}>
                  View All transports
                </li>
              </ul>
            </li>
            
            <li onClick={() => { navigate('/admin-info') }}>
              <span>
                <img src="Gallery/profile_icon.png" alt="" />
                Profile
              </span>
            </li>
            <li onClick={() => { navigate('/settings') }}>
              <span>
                <img src="Gallery/settings_icon.png" alt="" />
                Settings
              </span>
            </li>
            <li onClick={() => { setShowLogoutModal(true); }}>
              <span>
                <img src="Gallery/logout_icon.png" alt="" />
                Log Out
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
