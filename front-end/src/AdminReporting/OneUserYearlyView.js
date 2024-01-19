import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';

function OneUserYearlyView({ data, goBackToAdminReporting })
{
  /* const [selectedMonthWeek, setSelectedMonthWeek] = useState(''); */

  /* const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState('');

  useEffect(() => 
  {
    axios.post('http://localhost:8081/home/get_all_users').then(response => 
    {
      setUsers(response.data);
    })
    .catch(error => 
    {
      console.error('Error fetching users:', error);
    });
  },[]);

  const [usersData, setUsersData] = useState([]);

  useEffect(()=> 
  {
    const fetchUsers=async()=> 
    {
      try 
      {
        const response=await axios.post('http://localhost:8081/home/get_all_users');
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
      catch(error) 
      {
        console.error('Error fetching user:', error);
      }
    };
    fetchUsers();
  },[]); */

  const [selectedUser, setSelectedUser] = useState('');
  const [usersData, setUsersData] = useState([]);

  useEffect(() => 
  {
    const fetchUsers = async () => 
    {
      try 
      {
        const response = await axios.post('http://localhost:8081/home/get_all_users');
        if (response.data.Result) 
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

  const handleExportToExcel = async (selectedUser) => 
  {
    if(!selectedUser) 
    {
      alert("Please select a user before exporting to Excel.");
      return;
    }
    else
    {
      try 
      {
        const response = await axios.get(`http://localhost:8081/home/user/${selectedUser}/records`, 
        {
          responseType: 'blob',
        });
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `user_${selectedUser}_timesheet_records.xlsx`);
      } 
      catch(error) 
      {
        console.error('Error fetching or processing user records:', error);
        console.log(error.response);
      }
    }
  };  
  
  //const [selectedMetric, setSelectedMetric] = useState('Working Hours Total');

  const handleGoBack = () => 
  {
    goBackToAdminReporting();
  };
  
  return (
  <>
    <Container>
      <Row>
        <Col className='col col-12 col-lg-12 col-xl-12 col-xxl-12 col-md-12 col-sm-12 col-xs-12'>
          <Row className="mt-4 mb-4 d-flex justify-content-center ml-auto mr-auto">
            <select 
              className="form-select form-select-md rounded-0" 
              style={{ width: '300px' }}
              //value={selectedUser} 
              //onChange={(e) => setSelectedUser(e.target.value)} 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}>
              <option value="">Select User</option>
                {usersData.map((user) => 
                (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
            </select>
          </Row>
          {/* <Row className="mt-0 mb-4 d-flex justify-content-center ml-auto mr-auto">
            <div className="d-flex justify-content-center ml-auto mr-auto">
              <label>
                <input
                  type="radio"
                  value="Working Hours Total"
                  checked={selectedMetric === 'Working Hours Total'}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                />
                Working Hours Total
              </label>
              <label>
                <input
                  type="radio"
                  value="Total Revenue"
                  checked={selectedMetric === 'Total Revenue'}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                />
                Total Revenue
              </label>
              <label>
                <input
                  type="radio"
                  value="Internal Price"
                  checked={selectedMetric === 'Internal Price'}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                />
                Internal Price
              </label>
            </div>
          </Row> */}
          <Row className="mt-0 mb-4 d-flex justify-content-center ml-auto mr-auto">
            <Col className='col col-12 col-lg-12 col-xl-12 col-xxl-12 col-md-12 col-sm-12 col-xs-12 d-flex justify-content-center ml-auto mr-auto'>
              <button className="btn btn-primary w-20 fw-bold text-center align-items-center mb-0" variant="primary" style={{ width: '140px' }} onClick={()=>handleExportToExcel(selectedUser)}>Export to Excel</button>
              <button className="btn btn-danger w-20 fw-bold text-center align-items-center mb-0" variant="danger" style={{ width: '140px', marginLeft: '10px' }} onClick={handleGoBack}>Cancel</button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  </>
  );
};

export default OneUserYearlyView;
