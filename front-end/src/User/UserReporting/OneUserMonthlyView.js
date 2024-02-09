import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/AdminCSS.css';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';

function OneUserMonthlyView({ goBackToUserReporting })
{
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchUserId = async () => 
  {
      try 
      {
        const response = await fetch('http://localhost:8081/login/user_home/userid',{method: 'GET',credentials: 'include'});
        if(response.ok) 
        {
          const data = await response.json();
          setUserId(data.userId);
        } 
        else 
        {
          throw new Error('Failed to fetch user ID');
        }
      } 
      catch(error) 
      {
        console.error('Error fetching user ID:', error);
      }
  };

  useEffect(() => 
  {
    const fetchUserData = async () => 
    {
      try 
      {
        await fetchUserId();
        setLoading(false);
      } 
      catch (error) 
      {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    fetchUserData();
  },[]);

const handleExportToExcel  = async () =>
{
  if(!selectedYear || !selectedMonth) 
  {
    alert("Please select a year, month before exporting to Excel.");
    return;
  } 
  else 
  {
    if(!userId) 
    {
      return;
    } 
    else 
    {
      try 
      {
        await fetchUserId();
        const response = await axios.get(`http://localhost:8081/user_home/user/${userId}/one_user_monthly_records`, 
        {
          params: 
          {
            year: selectedYear,
            month: selectedMonth
          },
          responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob,`user_${userId}_timesheet_records_${selectedYear}_${selectedMonth}.xlsx`);
      } 
      catch (error) 
      {
        console.error('Error fetching or processing user records:', error);
        console.log(error.response);
      }
      finally 
      {
        setLoading(false);
      }
    }
  }
};
  
const handleGoBack = () => 
{
  goBackToUserReporting();
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, index) => currentYear - index);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  
return (
  <>
    <Container>
    {
      loading 
      ? 
      (
        <>
          <Row className="mt-5"><p style={{ textAlign: 'center' }}>Loading...</p></Row>
        </>
      ) 
      : 
      (
        <>
          <Row>
          <Col className='col col-12 col-lg-12 col-xl-12 col-xxl-12 col-md-12 col-sm-12 col-xs-12'>
            <Row className="mt-5 mb-4 d-flex justify-content-center ml-auto mr-auto">
              <select
                className="form-select form-select-md rounded-0"
                style={{ width: '300px', marginLeft: '20px' }}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Select Year</option>
                  {years.map((year) => 
                  (
                    <option key={year}>{year}</option>
                  ))}
              </select>
              <select className="form-select form-select-md rounded-0" style={{ width: '300px', marginLeft: '20px' }} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {new Date(selectedYear, month - 1, 1).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            </Row>
            <Row className="mt-0 mb-4 d-flex justify-content-center ml-auto mr-auto">
              <Col className='col col-12 col-lg-12 col-xl-12 col-xxl-12 col-md-12 col-sm-12 col-xs-12 d-flex justify-content-center ml-auto mr-auto'>
                <button className="btn btn-primary w-20 fw-bold text-center align-items-center mb-0" variant="primary" style={{ width: '140px' }} onClick={()=>handleExportToExcel(userId,selectedYear,selectedMonth)}>Export to Excel</button>
                <button className="btn btn-danger w-20 fw-bold text-center align-items-center mb-0" variant="danger" style={{ width: '140px', marginLeft: '10px' }} onClick={handleGoBack}>Cancel</button>
              </Col>
            </Row>
          </Col>
          </Row>
        </>
      )
    }
    </Container>
  </>
  );
};

export default OneUserMonthlyView;
