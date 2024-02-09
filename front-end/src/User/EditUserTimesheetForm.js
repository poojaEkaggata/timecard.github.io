import React, { useState, useEffect, useCallback  } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios'; 
import { BsPlus } from 'react-icons/bs';

const EditUserTimesheetForm = ({ editData, userId, recordId, onClose, fetchData }) => 
{
  //fromdate formatting
   const formatDate = (dateString) => 
   {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const fromDateString = editData.fromdate ? formatDate(editData.fromdate) : '';

  //fromtime formatting
  const formatTime = (timeString) => 
  {
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    if(period === 'PM' && hours !== '12') 
    {
        hours = String(Number(hours) + 12);
    } 
    else if(period === 'AM' && hours === '12') 
    {
        hours = '00';
    }
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };
  const fromTimeString = editData.fromtime ? formatTime(editData.fromtime) : '';
  const fromTimeInput = document.getElementsByName('fromtime');
  fromTimeInput.value = fromTimeString;

  //endtime formatting
  const endTimeString = editData.endtime ? formatTime(editData.endtime) : '';
  const endTimeInput = document.getElementsByName('endtime');
  endTimeInput.value = endTimeString;
  
  const initialEditedData = { ...editData,fromdate:fromDateString,fromtime:fromTimeString,endtime:endTimeString};

  const [editedData, setEditedData] = useState(initialEditedData);

  const[customers,setCustomers]=useState([]);

  //Display Customer List UI Functionality
  useEffect(() => 
  {
    const fetchCustomers = async () => 
    {
        try 
        {
            const response = await axios.post('http://localhost:8081/user_home/customer');
            if(response.data.Result) 
            {
                if(!editedData.customer) 
                {
                    setEditedData(prevData => ({
                        ...prevData,
                        customer: response.data.Result.length > 0 ? '' : response.data.Result[0].name
                    }));
                }
                else
                {
                    setCustomers(response.data.Result);
                }
            } 
            else 
            {
                console.error('No customer data found');
                setCustomers([]);
            }
        } 
        catch (error) 
        {
            console.error('Error fetching customer:', error);
        }
    };
    fetchCustomers();
  });

  // Initial state for projects
  const[projects,setProjects]=useState([]);

  const customerData = 
  [
    { id: 1, name: 'Dassault' },
    { id: 2, name: 'Digital Marketing' },
    { id: 3, name: 'Ekaggata Internal Delivery' },
    { id: 4, name: 'Mate4Tech' },
    { id: 5, name: 'Milkvilla' },
    { id: 6, name: 'Joolkart' },
    { id: 7, name: 'MGD' },
    { id: 8, name: 'new' },
    { id: 9, name: 'new cust' },
    { id: 10, name: 'Priya' },
    { id: 11, name: 'newly' }
  ];

  //Display Projects List UI Functionality
  const handleCustomerChange = async (e) => 
  {
    const customerId = e.target.value;
    setEditedData((prevData) => ({
        ...prevData,
        customer: customerId
    }));
    try 
    {
        const response = await axios.post('http://localhost:8081/user_home/projectlist', { customerId: customerId });
        if(response.data.projects) 
        {
            //Assign customer name to the selected customer id
            const customerId = parseInt(e.target.value);
            const customer = customerData.find(customer => customer.id === customerId);
            if(customer) 
            {
              setEditedData(prevData => ({
                ...prevData,
                customer: customer.name
              }));
            } 
            else 
            {
              console.error('Customer not found');
            }
            //Assign project name after selecting customer accordingly
            setProjects(response.data.projects);
            const selectedProjectName = response.data.projects;
            setEditedData(prevState => ({
                ...prevState,
                projects: selectedProjectName
            }));
        } 
        else 
        {
            console.error('No project data found');
            setProjects([]);
        }
    } 
    catch (error) 
    {
        console.error('Error fetching projects:', error);
    }
  };

  const handleEndTimeChange = (event) => 
  {
    const newEndTime = event.target.value;
    const newEndTimeDate = new Date(`2000-01-01T${newEndTime}`);
    const currentStartTimeDate = new Date(`2000-01-01T${editedData.fromtime}`);
    if (newEndTimeDate > currentStartTimeDate) 
    {
        setEditedData(prevData => ({
            ...prevData,
            endtime: newEndTime
        }));
    } 
    else 
    {
        alert("End time should be greater than start time.");
    }
};

  //calculate duration base on the fromtime and entime values
  const calculateDuration = useCallback(() => 
  {
    const { fromtime, endtime, duration: currentDuration } = editedData;
    if(fromtime && endtime) 
    {
        const from = new Date(`2000-01-01T${fromtime}`);
        const to = new Date(`2000-01-01T${endtime}`);
        const diffMs = to.getTime() - from.getTime();
        const seconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const duration = `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        if(duration!==currentDuration) 
        {
            setEditedData((prevData) => ({ ...prevData, duration }));
        }
    }
  },[editedData]);

  useEffect(()=>{calculateDuration();},[calculateDuration]);

  //Fetch activity db record

  const [activity, setActivity] = useState([]);

  useEffect(() => 
  {
    const fetchActivity = async () => 
    {
        try 
        {
            const response = await axios.post('http://localhost:8081/user_home/activity');
            if (response.data.Result) 
            {
                if (!editedData.activity) 
                {
                    setEditedData(prevData => ({
                        ...prevData,
                        activity: response.data.Result.length > 0 ? '' : response.data.Result[0].name
                    }));
                }
                else
                {
                    setActivity(response.data.Result);
                }
            } 
            else 
            {
                console.error('No activity data found');
                setActivity([]);
            }
        } 
        catch (error) 
        {
            console.error('Error fetching activity:', error);
        }
    };
    fetchActivity();
  });

  // Fetch tag db record

  const [tag, setTag] = useState([]);

  useEffect(() => 
  {
    const fetchTag = async () => 
    {
        try 
        {
            const response = await axios.post('http://localhost:8081/user_home/tag');
            if (response.data.Result) 
            {
                if (!editedData.tag) 
                {
                    setEditedData(prevData => ({
                        ...prevData,
                        tag: response.data.Result.length > 0 ? '' : response.data.Result[0].name
                    }));
                }
                else
                {
                    setTag(response.data.Result);
                }
            } 
            else 
            {
                console.error('No tag data found');
                setTag([]);
            }
        } 
        catch (error) 
        {
            console.error('Error fetching tag:', error);
        }
    };
    fetchTag();
  });

  // Add & Display New Tag Modal & UI Functionality 
  const [showTagModal, setTagShowModal] = useState(false);

  const handleTagOpenModal = () => 
  {
    setTagShowModal(true);
  };

  const handleTagCloseModal = () => 
  {
    setTagShowModal(false);
  };

  const [name, setName] = useState('');

  const handleTagInputChange = (event) => 
  {
    setName(event.target.value);
  };

  const handleTagSaveTag = () => 
  {
    fetch('http://localhost:8081/user_home/save_tag', 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => 
    {
        if (response.ok) 
        {
            alert('Tag Saved Successfully.');
            setTagShowModal(false);
        } 
        else 
        {
            console.error('Failed to save tag');
        }
    })
    .catch(error => 
    {
        console.error('Error Saving Tag', error);
    });
  };

  //Get & Edit selected user's timesheet records

  const handleInputChange = (e) => 
  {
    const { name, value } = e.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value}));
  };

  const handleSave = async () => 
  {
    if(!userId || !recordId) 
    {
      return;
    }
    else 
    {
        try 
        {
            // Update dataToSave with all form fields
            const dataToSave = 
            {
                user_id: userId,
                id: recordId,
                fromdate: editedData.fromdate,
                fromtime: editedData.fromtime,
                endtime: editedData.endtime,
                duration: editedData.duration,
                customer: editedData.customer,
                projects: editedData.projects,
                activity: editedData.activity,
                description: editedData.description,
                tag: editedData.tag
            };

            const response = await axios.post(`http://localhost:8081/user_home/update_timesheet/${userId}/${recordId}`,dataToSave);

            if(response.data.success) 
            {
                alert('Timesheet updated successfully.');
                await fetchData();
                onClose();
            } 
            else 
            {
                alert('Failed to update timesheet.');
                onClose();
            }
        } 
        catch (error) 
        {
            alert('An error occurred while updating the timesheet.');
        }
    }
  };

  return (
    <>
        <Modal show={true} onHide={onClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: 'bold' }}>Edit Your Times</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col>
                            <Form.Group controlId="fromdate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fromdate"
                                    value={editedData.fromdate}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="fromtime">
                                <Form.Label>Begin</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="fromtime"
                                    value={editedData.fromtime}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="endtime">
                                <Form.Label>End</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="endtime"
                                    value={editedData.endtime}
                                    onChange={handleEndTimeChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col>
                            <Form.Group controlId="duration">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="duration"
                                    value={editedData.duration}
                                    onChange={handleInputChange}
                                    disabled={true}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="customer">
                                <Form.Label>Customer</Form.Label>
                                <Form.Select
                                    name="customer"
                                    value={editedData.customer}
                                    onChange={handleCustomerChange}
                                >
                                    {customers.map((customer) => 
                                    (
                                        <option key={customer.customer_id} value={customer.customer_id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                    {editedData.customer && !customers.find((customer) => customer.customer_id === editedData.customer) && (
                                        <option value={editedData.customer}>{editedData.customer}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="projects">
                                <Form.Label>Project</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="projects"
                                        value={editedData.projects}
                                        onChange={handleInputChange}
                                        disabled={true}
                                    >
                                        {projects.map((projectName, id) => 
                                        (
                                            <option key={id} value={projectName}>{projectName}</option>
                                        ))}
                                        {editedData.projects && !projects.find(project => project.customer_id === editedData.project) && 
                                        (
                                            <option value={editedData.projects}>{editedData.projects}</option>
                                        )}
                                    </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '10px' }}>
                        <Col>
                            <Form.Group controlId="activity">
                                <Form.Label>Activity</Form.Label>
                                <Form.Select
                                    name="activity"
                                    value={editedData.activity}
                                    onChange={handleInputChange}
                                >
                                    {activity.map((activity) => 
                                    (
                                        <option key={activity.id} value={activity.name}>
                                            {activity.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={editedData.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="tag">
                                <Form.Label className="me-1">Tag</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Select
                                        name="tag"
                                        value={editedData.tag}
                                        onChange={handleInputChange}
                                        className="me-1 d-flex"
                                        style={{ maxWidth: '200px' }}
                                    >
                                        {tag.map((tag) => 
                                        (
                                            <option key={tag.id} value={tag.name}>
                                                {tag.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Button onClick={handleTagOpenModal} title='Add New Tag' style={{ marginLeft: '10px' }}><BsPlus /></Button>
                                </div>
                            </Form.Group>
                            <Modal show={showTagModal} onHide={handleTagCloseModal} centered>
                                <Modal.Header closeButton>
                                    <Modal.Title>Add New Tag</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="name">
                                            <Form.Label>Tag Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter tag name" name="name" onChange={handleTagInputChange}/>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="success" onClick={handleTagSaveTag}>
                                        Save Tag
                                    </Button>
                                    <Button variant="danger" onClick={() => setTagShowModal(false)}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleSave}>Save</Button>
                <Button variant="danger" onClick={onClose}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>
  );
}

export default EditUserTimesheetForm;
