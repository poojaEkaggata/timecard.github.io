import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import axios from 'axios';
import { Row, Button, Modal } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function AdminCustomers()
{
  const [tableData, setTableData] = useState([]);

  useEffect(()=> 
  {
    const fetchCustomers=async()=> 
    {
      try 
      {
        const response=await axios.post('http://localhost:8081/home/customer');
        if(response.data.Result) 
        {
          setTableData(response.data.Result);
        } 
        else 
        {
          console.error('No customer data found');
          setTableData([]);
        }
      } 
      catch(error) 
      {
        console.error('Error fetching customer:', error);
      }
    };
    fetchCustomers();
  },[]);

  //Open & Close Create New Customer Modal UI Functionality
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
        axios.post('http://localhost:8081/home/customer/add_new_customer',values).then(res => 
        {
            if(res.data.message === "Customer created successfully.") 
            {
              alert("Your Customer has been created successfully.");
              //props.onHide();
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
              <FontAwesomeIcon icon={faPlus} /> Create New Customer
            </button>
        </Row>
        <Row className='d-flex justify-content-center ml-auto mr-auto mb-2'>
            <h2 style={{ textAlign: 'center' }}>List of Customers</h2>
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
        <Modal 
        //{...props} show={showOpen} cancel={props.close}
        show={showOpen} 
        onHide={handleCreateNewCustomersShowClose} 
        className="d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit}> 
              <Modal.Header closeButton>
                <Modal.Title><center>Create New Customer</center></Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div className="container">
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="fromdate" className="form-label w-100 me-2" style={{ width: '100vw' }}>
                        Customer Name <span style={{ color: 'red' }}>*</span>
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
        /* border: '1px solid #ddd' */
        /* borderCollapse: 'collapse', */
        /* tableLayout: 'fixed' */
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

export default AdminCustomers;
