import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import axios from 'axios';
import { Row } from 'react-bootstrap';

function OneUserWeeklyView()
{

  const [selectedMonthWeek, setSelectedMonthWeek] = useState('');

  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState('');

  const [selectedMetric, setSelectedMetric] = useState('Working Hours Total');

  useEffect(() => 
  {
    axios.get('your-backend-url/users')
      .then(response => 
      {
        setUsers(response.data);
      })
      .catch(error => 
      {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleExportToExcel = () => 
  {

  };

  return (
  <>
    <Row>

      <div>
        <button 
        //onClick={() =>  }
        >{'< Previous'}</button>
        <span>{selectedMonthWeek}</span>
        <button 
        //onClick={() => }
        >{'Next >'}</button>
      </div>

      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>

      <div>
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

      <button onClick={handleExportToExcel}>Export to Excel</button>

    </Row>
  </>
  );
};

export default OneUserWeeklyView;

