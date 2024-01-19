import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import axios from 'axios';
import { Row, Button, Modal } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function AdminActivities()
{
  const [tableData, setTableData] = useState([]);

  useEffect(()=> 
  {
    const fetchActivities=async()=> 
    {
      try 
      {
        const response=await axios.post('http://localhost:8081/home/get_activity');
        if(response.data.Result) 
        {
          setTableData(response.data.Result);
        } 
        else 
        {
          console.error('No activity data found');
          setTableData([]);
        }
      } 
      catch(error) 
      {
        console.error('Error fetching activity:', error);
      }
    };
    fetchActivities();
  },[]);

  const[showOpen,setShowOpen]=useState(false);
  function handleCreateNewCustomersShowClose()
  {
    setShowOpen(false);
  }
  function handleCreateNewCustomersShow()
  {
    setShowOpen(true);
  }

  let navigate=useNavigate();

  const [values, setValues] = useState({ name: '' });

  function handleInput(event)
  {
    setValues(prev=>({...prev,[event.target.name]:[event.target.value]}))
  }

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    try 
    {
        axios.post('http://localhost:8081/home/activity/add_new_activity',values).then(res => 
        {
            if(res.data.message === "Activity created successfully.") 
            {
              alert("Your Activity has been created successfully.");
              handleCreateNewCustomersShowClose();
              navigate('/home');
            } 
            else 
            {
              alert("Something went wrong!");
              navigate('/home');
            }
        }).catch(err => console.log(err));
    } 
    catch(error) 
    {
      alert("Error Occurred!");
      navigate('/home');
    }
  }
  
  return (
    <div>
        <Row className='d-flex justify-content-center ml-auto mr-auto mt-5 mb-2'>
            <button className="btn btn-primary w-20 fw-bold text-center align-items-center" title='Click Here to Create New Customer' onClick={handleCreateNewCustomersShow}>
              <FontAwesomeIcon icon={faPlus} /> Create New Activity
            </button>
        </Row>
        <Row className='d-flex justify-content-center ml-auto mr-auto mb-2'>
            <h2 style={{ textAlign: 'center' }}>List of Activities</h2>
        </Row>
        <Row className='d-flex justify-content-center ml-auto mr-auto'>
                <table style={styles.table}>
                    <tbody style={styles.tbody}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Sr. No.</th>
                                <th style={styles.th}>NAME</th>
                            </tr>
                        </thead>
                        {tableData.map((row, index) => 
                        (
                            <tr key={index}>
                            <td style={styles.td}>{row.id}</td>
                            <td style={styles.name_td}>{row.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </Row>
        <Modal show={showOpen} onHide={handleCreateNewCustomersShowClose} className="d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit}> 
              <Modal.Header closeButton>
                <Modal.Title><center>Create New Activity</center></Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div className="container">
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="fromdate" className="form-label w-100 me-2" style={{ width: '100vw' }}>
                        Activity Name <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        style={{ width: '100%' }}
                        onChange={handleInput}
                        required
                      />
                    </div>
                  </div>
              </div>
              </Modal.Body>
              <Modal.Footer>
                <button type="submit" className="btn btn-primary">Save</button> 
                <Button className="btn btn-danger" variant="secondary" onClick={handleCreateNewCustomersShowClose}>Close</Button>
              </Modal.Footer>
            </form>
          </Modal>
    </div>
  );
};

const styles = 
{
    table: 
    {
        width: '100%',
        height: '500px'
    },
    tbody: 
    {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        display: 'block'
    },
    th: 
    {
        background: '#f2f2f2',
        padding: '10px',
        textAlign: 'center',
        border: '1px solid #ddd'
    },
    td: 
    {
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'center'
    },
    name_td:
    {
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'left'
    }
}

export default AdminActivities;
