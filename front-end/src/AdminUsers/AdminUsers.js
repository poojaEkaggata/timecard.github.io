import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import axios from 'axios';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEye, faEdit } from '@fortawesome/free-solid-svg-icons';

const language = 
[
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Arabic',
  'Russian',
  'Japanese',
  'Portuguese',
  'Hindi',
  'Marathi',
  'Bengali',
  'Urdu',
  'Punjabi',
  'Indonesian',
  'Turkish',
  'Italian',
  'Dutch',
  'Vietnamese',
  'Polish',
  'Ukrainian',
  'Persian',
  'Thai',
  'Korean',
  'Romanian',
  'Greek',
  'Swedish',
  'Czech',
  'Hungarian',
  'Danish',
  'Finnish',
  'Norwegian',
  'Hebrew',
  'Slovak',
  'Malay',
  'Croatian',
  'Lithuanian',
  'Slovenian',
  'Latvian',
  'Estonian',
  'Bulgarian',
  'Albanian',
  'Serbian',
  'Macedonian',
  'Georgian',
  'Belarusian',
  'Vietnamese',
  'Tagalog',
  'Swahili',
  'Kurdish',
  'Haitian Creole',
  'Luxembourgish',
  'Maltese',
  'Icelandic',
  'Welsh',
  'Fijian',
  'Samoan',
  'Hawaiian',
  'Tahitian',
  'Maori',
  'Tongan',
  'Klingon'
];

const timezone = 
[
  'UTC',
  'GMT',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Australia/Sydney',
  'Pacific/Honolulu',
  'Africa/Cairo',
  'Africa/Nairobi',
  'America/Chicago',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Melbourne',
  'Europe/Berlin',
  'Europe/Moscow',
  'Pacific/Auckland',
  'Pacific/Fiji',
  'Etc/GMT-12',
  'Etc/GMT+12'
];

function AdminUsers()
{
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
        console.error('Error fetching tag:', error);
      }
    };
    fetchUsers();
  },[]);

  const boxColors = ['#ff7f50', '#40e0d0', '#ff69b4', '#6495ed', '#98fb98'];

  const [selectedUser, setSelectedUser] = useState(null);

  const handleViewDetails = (user) => 
  {
    setSelectedUser(user);
  };

  const handleCloseModal = () => 
  {
    setSelectedUser(null);
  };

  const [editingUser, setEditingUser] = useState(null);

  const handleEditDetails = (user) => 
  {
    setEditingUser(user);
  };

  const handleEditCloseModal = () => 
  {
    setEditingUser(null);
  };

  const[supervisor,setSupervisor]=useState([]);
  useEffect(()=> 
  {
      const fetchSupervisor=async()=> 
      {
        try 
        {
          const response=await axios.post('http://localhost:8081/home/user');
          if(response.data.Result) 
          {
            setSupervisor(response.data.Result);
          } 
          else 
          {
            console.error('No Supervisor data found');
            setSupervisor([]);
          }
        } 
        catch(error) 
        {
          console.error('Error fetching supervisor:', error);
        }
      };
      fetchSupervisor();
  },[]);

  const[team,setTeam]=useState([]);
  useEffect(()=> 
  {
      const fetchTeam=async()=> 
      {
        try 
        {
          const response=await axios.post('http://localhost:8081/home/team');
          if(response.data.Result) 
          {
            setTeam(response.data.Result);
          } 
          else 
          {
            console.error('No Team data found');
            setTeam([]);
          }
        } 
        catch(error) 
        {
          console.error('Error fetching team:', error);
        }
      };
      fetchTeam();
  },[]);

  const[role,setRole]=useState([]);
  useEffect(()=> 
  {
      const fetchRole=async()=> 
      {
        try 
        {
          const response=await axios.post('http://localhost:8081/home/role');
          if(response.data.Result) 
          {
            setRole(response.data.Result);
          } 
          else 
          {
            console.error('No Team data found');
            setRole([]);
          }
        } 
        catch(error) 
        {
          console.error('Error fetching team:', error);
        }
      };
      fetchRole();
  },[]);

  const handleSaveEdit = async () => 
  {
    try 
    {
        await axios.post('http://localhost:8081/home/update_user',editingUser);
        console.log('User updated successfully.');
        handleEditCloseModal();
        alert("Your user updated successfully.");
    } 
    catch (error) 
    {
        console.log('Error updating user details:', error);
        handleEditCloseModal();
        alert("Something Went Wrong!");
    }
  };
  
  return (
    <>
        <Container style={{ overflowY: 'auto' }}>
            <Row className='d-flex justify-content-center ml-auto mr-auto mt-4 mb-4'>
                <h2 style={{ textAlign: 'center' }}>List of All Users</h2>
            </Row>
            <Row className='d-flex justify-content-center ml-auto mr-auto mb-2'>
                <div className="user-list-container d-flex justify-content-center ml-auto mr-auto">
                    <div className="user-list">
                        {usersData.map((user,index) => 
                        (
                            <div className="user-box mb-2" key={index} style={{ backgroundColor: boxColors[index % boxColors.length] }}> 
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faUser} style={{ float: 'left', color: '#FFFFFF', alignItems: 'center', marginLeft: '20px' }} /> <p style={{ float: 'left', color: '#FFFFFF', marginLeft: '80px', alignItems: 'center', paddingTop: '15px', fontWeight: 'bold' }}>{user.name}</p> 
                                </div>
                                <div>
                                    <button className="btn btn-primary w-20 fw-bold text-center align-items-center" title='Click Here to View User Details' onClick={() => handleViewDetails(user)}><FontAwesomeIcon icon={faEye} /> View</button>
                                    <button className="btn btn-primary w-20 fw-bold text-center align-items-center" title='Click Here to View User Details' onClick={() => handleEditDetails(user)} style={{ marginLeft: '20px' }}><FontAwesomeIcon icon={faEdit} /> Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Modal show={selectedUser !== null} onHide={handleCloseModal} className="d-flex justify-content-center align-items-center vh-100 modal-lg" dialogClassName="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedUser && (
                            <div>
                                <Row className="mb-2">
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>User ID: {selectedUser.id}</p>
                                    </Col>
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>User Name: {selectedUser.name}</p>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>User E-Mail ID: {selectedUser.email}</p>
                                    </Col>
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>User Title: {selectedUser.title}</p>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>User Langauge: {selectedUser.language}</p>
                                    </Col>
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>User Timezone: {selectedUser.timezone}</p>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>Staff Number: {selectedUser.staff_number}</p>
                                    </Col>
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>Supervisor: {selectedUser.supervisor}</p>
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>Team: {selectedUser.team}</p>
                                    </Col>
                                    <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
                                        <p>Role: {selectedUser.role}</p>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={editingUser !== null} onHide={handleEditCloseModal} className="d-flex justify-content-center align-items-center vh-100 modal-lg" dialogClassName="modal-lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {editingUser ? 
                        (
                            <div>
                                <Row className="mb-3 mt-0 d-flex justify-content-center ml-auto mr-auto p-0">
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='name'>Name</label>
                                        <input type="text" className="form-control rounded-0" value={editingUser.name} name="name" onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                                    </Col>
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='email'>E-Mail ID</label>
                                        <input type="text" className="form-control rounded-0" value={editingUser.email} name="email" onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                                    </Col>
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='title'>Title</label>
                                        <input type="text" className="form-control rounded-0" value={editingUser.title} name="title" onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })} />
                                    </Col>
                                </Row>
                                <Row className="mb-3 mt-0 d-flex justify-content-center ml-auto mr-auto p-0">
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='language'>Langauge</label>
                                        <select className="form-select form-select-md rounded-0" aria-label="Default select example" name="language" onChange={(e) => setEditingUser({ ...editingUser, language: e.target.value })}>
                                            <option value={editingUser.language}>{editingUser.language}</option>
                                            {language.map((language,index) => 
                                            (
                                                <option key={index} value={language.name}>
                                                    {language}
                                                </option>
                                            ))}
                                        </select>
                                    </Col>
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='timezone'>Timezone</label>
                                        <select className="form-select form-select-md rounded-0" aria-label="Default select example" name="timezone" onChange={(e) => setEditingUser({ ...editingUser, timezone: e.target.value })}>
                                            <option value={editingUser.timezone}>{editingUser.timezone}</option>
                                            {timezone.map((timezone,index) => 
                                            (
                                                <option key={index} value={timezone.name}>
                                                    { timezone }
                                                </option>
                                            ))}
                                        </select>
                                    </Col>
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='staff_number'>Staff Number</label>
                                        <input type="text" className="form-control rounded-0" value={editingUser.staff_number} name="staff_number" onChange={(e) => setEditingUser({ ...editingUser, staff_number: e.target.value })} />
                                    </Col>
                                </Row>
                                <Row className="mb-3 mt-0 d-flex justify-content-center ml-auto mr-auto p-0">
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='supervisor'>Supervisor</label>
                                        <select className="form-select form-select-md rounded-0" aria-label="Default select example" name="supervisor" onChange={(e) => setEditingUser({ ...editingUser, supervisor: e.target.value })}>
                                            <option value={editingUser.supervisor}>{editingUser.supervisor}</option>
                                            {supervisor.map((supervisor,id)=>(<option key={id} id={id} value={supervisor.name}>{supervisor.name}</option>))}
                                        </select>
                                    </Col>
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='team'>Team</label>
                                        <select className="form-select form-select-md rounded-0" aria-label="Default select example" name="team" onChange={(e) => setEditingUser({ ...editingUser, team: e.target.value })}>
                                            <option value={editingUser.team}>{editingUser.team}</option>
                                            {team.map((team,id)=>(<option key={id} id={id} value={team.name}>{team.name}</option>))}
                                        </select>
                                    </Col>
                                    <Col className="col-4 col-lg-4 col-xl-4 col-xxl-4 col-md-4 col-sm-4 col-xs-4">
                                        <label htmlFor='role'>Role</label>
                                        <select className="form-select form-select-md rounded-0" aria-label="Default select example" name="role" onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                                            <option value={editingUser.role}>{editingUser.role}</option>
                                            {role.map((role,id)=>(<option key={id} id={id} value={role.name}>{role.name}</option>))}
                                        </select>
                                    </Col>
                                </Row>
                            </div>
                        ) 
                        : 
                        (
                            <div>
                                {/* <p>User Name: {editingUser.name}</p> */}
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleEditCloseModal}>
                        Close
                        </Button>
                        {
                            editingUser 
                            ? 
                            (
                            <Button variant="primary" onClick={handleSaveEdit}>
                                Save Changes
                            </Button>
                            ) 
                            : 
                            null
                        }
                    </Modal.Footer>
                </Modal>
            </Row>
        </Container>
    </>
  );
};

export default AdminUsers;
