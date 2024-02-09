import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';

function AllUserYearlyView({ goBackToAdminReporting })
{
  const [usersData, setUsersData] = useState([]);
  useEffect(() => 
  {
    const fetchUsers = async () => 
    {
      try 
      {
        const response = await axios.post('http://localhost:8081/home/get_all_users');
        if(response.data.Result) 
        {
          setUsersData(response.data.Result);
        } 
        else 
        {
          console.error('No user data found');
          setUsersData([]);
        }
      } 
      catch (error) 
      {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  },[]);

const handleExportToExcel = async () => 
{
  if(!selectedYear) 
  {
    alert("Please select a year before exporting to Excel.");
    return;
  }
  else
  {
    try 
    {
      const response = await axios.get(`http://localhost:8081/home/user/all_user_yearly_records`, 
      {
        params: 
        {
          year: selectedYear
        },
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `timesheet_records_${selectedYear}.xlsx`);
    } 
    catch(error) 
    {
      console.error('Error fetching or processing user records:', error);
      console.log(error.response);
    }
  }
};
  
const handleGoBack = () => 
{
  goBackToAdminReporting();
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 80 }, (_, index) => currentYear - index);
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
return (
  <>
    <Container>
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
          </Row>
          <Row className="mt-0 mb-4 d-flex justify-content-center ml-auto mr-auto">
            <Col className='col col-12 col-lg-12 col-xl-12 col-xxl-12 col-md-12 col-sm-12 col-xs-12 d-flex justify-content-center ml-auto mr-auto'>
              <button className="btn btn-primary w-20 fw-bold text-center align-items-center mb-0" variant="primary" style={{ width: '140px' }} onClick={()=>handleExportToExcel(selectedYear)}>Export to Excel</button>
              <button className="btn btn-danger w-20 fw-bold text-center align-items-center mb-0" variant="danger" style={{ width: '140px', marginLeft: '10px' }} onClick={handleGoBack}>Cancel</button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </>
  );
};

export default AllUserYearlyView;
