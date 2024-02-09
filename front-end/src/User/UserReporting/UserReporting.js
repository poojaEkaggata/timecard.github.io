import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/AdminCSS.css';
import { Row, Col } from 'react-bootstrap';
import OneUserWeeklyView from './OneUserWeeklyView.js';
import OneUserMonthlyView from './OneUserMonthlyView.js';
import OneUserYearlyView from './OneUserYearlyView.js';

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
    }
];

function UserReporting() 
{
  const [selectedComponent, setSelectedComponent] = useState(null);

  const loadRelatedComponent = (index) => 
  {
    setSelectedComponent(index);
  };

  const goBackToUserReporting = () => 
  {
    setSelectedComponent(null);
  };

  return (
    <>
        {
          selectedComponent === null 
          ? 
          (
              <Row className='d-flex justify-content-center ml-auto mr-auto mt-5 horizontal-container'>
                  {reportingTypeData.map((item,index)=> 
                  (
                      <Col className='col col-3 col-lg-3 col-xl-3 col-xxl-3 col-md-3 col-sm-3 col-xs-3 horizontal-box mb-2' key={index} id={index} onClick={()=>loadRelatedComponent(index)}>
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
          ) 
          : 
          null 
        }
        {selectedComponent === 0 && (<OneUserWeeklyView data={reportingTypeData[selectedComponent]} goBackToUserReporting={goBackToUserReporting} />) }
        {selectedComponent === 1 && (<OneUserMonthlyView data={reportingTypeData[selectedComponent]} goBackToUserReporting={goBackToUserReporting} />) }
        {selectedComponent === 2 && (<OneUserYearlyView data={reportingTypeData[selectedComponent]} goBackToUserReporting={goBackToUserReporting} />) }
    </>
  );
};

export default UserReporting;
