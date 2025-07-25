import React from 'react';
import './homeDashBoard.css';
import { TotalBannerSection } from '../totalBannerSection/TotalBannerSection';
import { AttendenceChart } from '../attendenceChart/AttendenceChart';

export const HomeDashBoard = () => {
  return (
    <>
      <div className="home-dashboard-container">
        <TotalBannerSection />
        <AttendenceChart />
      </div>
    </>
  )
}
