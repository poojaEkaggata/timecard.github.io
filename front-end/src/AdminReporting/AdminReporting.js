import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import { Row, Col } from 'react-bootstrap';
import OneUserWeeklyView from './OneUserWeeklyView.js';
import OneUserMonthlyView from './OneUserMonthlyView.js';
import OneUserYearlyView from './OneUserYearlyView.js';
import AllUserWeeklyView from './AllUserWeeklyView.js';
import AllUserMonthlyView from './AllUserMonthlyView.js';
import AllUserYearlyView from './AllUserYearlyView.js';
import ProjectDetails from './ProjectDetails.js';
import ProjectOverview from './ProjectOverview.js';
import MonthlyReport from './MonthlyReport.js';
import InactiveProjects from './InactiveProjects.js';
import ProjectsByMonthActivityUser from './ProjectsByMonthActivityUser.js';

const reportingTypeData = 
[
    {
        id: 0,
        icon: 'box_icon fas fa-user',
        name: 'Weekly View For One User'
    },
    {
        id: 1,
        icon: 'box_icon fas fa-user',
        name: 'Monthly View For One User'
    },
    {
        id: 2,
        icon: 'box_icon fas fa-user',
        name: 'Yearly View For One User'
    },
    {
        id: 3,
        icon: 'box_icon_one fas fa-user-friends',
        name: 'Weekly View For All User'
    },
    {
        id: 4,
        icon: 'box_icon_one fas fa-user-friends',
        name: 'Monthly View For All User'
    },
    {
        id: 5,
        icon: 'box_icon_one fas fa-user-friends',
        name: 'Yearly View For All User'
    },
    {
        id: 6,
        icon: 'box_icon_two fas fa-briefcase',
        name: 'Project Details'
    },
    {
        id: 7,
        icon: 'box_icon_two fas fa-briefcase',
        name: 'Project Overview'
    },
    {
        id: 8,
        icon: 'box_icon_two fas fa-briefcase',
        name: 'Monthly Report'
    },
    {
        id: 9,
        icon: 'box_icon_two fas fa-briefcase',
        name: 'Inactive Projects'
    },
    {
        id: 10,
        icon: 'box_icon_two fas fa-briefcase',
        name: 'Projects By Month, Activity, User'
    }
];

function AdminReporting() 
{
  const [selectedComponent, setSelectedComponent] = useState(null);

  const loadRelatedComponent = (index) => 
  {
    setSelectedComponent(index);
  };

  const goBackToAdminReporting = () => 
  {
    setSelectedComponent(null);
  };

  return (
    <>
        {selectedComponent === null ? (
            <Row className='d-flex justify-content-center ml-auto mr-auto mt-5 horizontal-container'>
                {reportingTypeData.map((item,index)=> 
                (
                    <Col className='col col-2 col-lg-2 col-xl-2 col-xxl-2 col-md-2 col-sm-2 col-xs-2 horizontal-box mb-2' key={index} id={index} onClick={()=>loadRelatedComponent(index)}>
                        <Row>
                        <Col className='col col-12 col-lg-12 col-xl-12 col-xxl-12 col-md-12 col-sm-12 col-xs-12'>
                        <Row>
                            <Col className='col col-3 col-lg-3 col-xl-3 col-xxl-3 col-md-3 col-sm-3 col-xs-3'>
                                <i className={item.icon}></i>
                            </Col>
                            <Col className='col col-7 col-lg-7 col-xl-7 col-xxl-7 col-md-7 col-sm-7 col-xs-7'>
                                <p className='text-align-center align-items-center'>{item.name}</p>
                            </Col>
                        </Row>
                        </Col>
                        </Row>
                    </Col>
                ))}
            </Row>
        ) : null }
        {selectedComponent === 0 && (<OneUserWeeklyView data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 1 && (<OneUserMonthlyView data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 2 && (<OneUserYearlyView data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 3 && (<AllUserWeeklyView data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 4 && (<AllUserMonthlyView data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 5 && (<AllUserYearlyView data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 6 && (<ProjectDetails data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 7 && (<ProjectOverview data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 8 && (<MonthlyReport data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 9 && (<InactiveProjects data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
        {selectedComponent === 10 && (<ProjectsByMonthActivityUser data={reportingTypeData[selectedComponent]} goBackToAdminReporting={goBackToAdminReporting} />) }
    </>
  );
};

export default AdminReporting;
