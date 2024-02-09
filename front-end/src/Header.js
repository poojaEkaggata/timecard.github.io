import React, { useState, useEffect } from 'react';
import './css/Custom.css';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button, Modal, Image } from 'react-bootstrap';
import CreateTimeCardImage from '../src/images/document.png';
import LogOut from '../src/images/logout.png';
import axios from 'axios'; 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';

function Header({ selectedMenuItem, selectedSubMenuItem }) 
{
  //Back To Login Page Navigation UI Functionality
  let navigate=useNavigate(); 
  function NavigateBackToLogin()
  { 
    let path=`/`; 
    navigate(path);
  }

  //Open & Close Create Time Sheet Modal UI Functionality
  const[show,setShow]=useState(false);
  function handleClose()
  {
    setShow(false);
  }
  function handleShow()
  {
    setShow(true);
  }

  //From Date UI Functionality
  const today=new Date().toISOString().substr(0, 10);
  const[selectedFromDate,setFromSelectedDate]=useState(today);

  const handleFromDateChange=(e)=> 
  {
    setFromSelectedDate(e.target.value);
  }

  //From Time UI Functionality
  const[startTimeSlots,setStartTimeSlots]=useState([]);
  const[selectedStartTime,setSelectedStartTime]=useState('');
  useEffect(() => 
  {
    const generateStartTimeSlots = () => 
    {
      const ISTOffset = 5.5;
      const currentDate = new Date();
      const currentUTC = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
      const ISTTime = new Date(currentUTC + (ISTOffset * 3600000));
      const timeSlotsArray = [];
      for (let i = ISTTime.getHours(); i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
          const hours = (i === 0 ? 12 : (i > 12 ? i - 12 : i)).toString().padStart(2, '0');
          const minutes = String(j).padStart(2, '0');
          const ampm = i < 12 ? 'AM' : 'PM';
          const time = `${hours}:${minutes} ${ampm}`;
          timeSlotsArray.push({ label: time, value: time });
        }
      }
      setStartTimeSlots(timeSlotsArray);
    };
    generateStartTimeSlots();
  },[]);
  function handleStartTimeSelection(e)
  {
    setSelectedStartTime(e.target.value);
    calculateDuration(e.target.value,selectedEndTime);
  };

  //End Time UI Functionality
  const [endTimeSlots, setEndTimeSlots] = useState([]);
  const [selectedEndTime, setSelectedEndTime] = useState('');
  useEffect(() => 
  {
    const generateEndTimeSlots = () => 
    {
      const ISTOffset = 5.5;
      const currentDate = new Date();
      const currentUTC = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
      const ISTTime = new Date(currentUTC + (ISTOffset * 3600000));
      const timeSlotsArray = [];
      for (let i = ISTTime.getHours(); i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
          const hours = (i === 0 ? 12 : (i > 12 ? i - 12 : i)).toString().padStart(2, '0');
          const minutes = String(j).padStart(2, '0');
          const ampm = i < 12 ? 'AM' : 'PM';
          const time = `${hours}:${minutes} ${ampm}`;
          timeSlotsArray.push({ label: time, value: time });
        }
      }
      setEndTimeSlots(timeSlotsArray);
    };
    generateEndTimeSlots();
  },[]);

  function handleEndTimeSelection(e)
  {
    setSelectedEndTime(e.target.value);
    calculateDuration(e.target.value,selectedStartTime);
  };

  //Calculate Duration Time Period UI Functionality
  const[duration,setDuration]=useState('');
  const calculateDuration = (selectedStartTime, selectedEndTime) => 
  {
    if(selectedStartTime && selectedEndTime) 
    {
      const [startHours, startMinutes, startPeriod] = selectedStartTime.match(/(\d+):(\d+) ([AaPp][Mm])/).slice(1);
      const [endHours, endMinutes, endPeriod] = selectedEndTime.match(/(\d+):(\d+) ([AaPp][Mm])/).slice(1);
      const startHoursInt = parseInt(startHours, 10);
      const startMinutesInt = parseInt(startMinutes, 10);
      const endHoursInt = parseInt(endHours, 10);
      const endMinutesInt = parseInt(endMinutes, 10);
      if(startPeriod.toUpperCase() === endPeriod.toUpperCase()) 
      {
        let startTotalMinutes = startHoursInt * 60 + startMinutesInt;
        let endTotalMinutes = endHoursInt * 60 + endMinutesInt;
        if (startPeriod.toUpperCase() === 'PM' && startHoursInt !== 12) startTotalMinutes += 12 * 60;
        if (endPeriod.toUpperCase() === 'PM' && endHoursInt !== 12) endTotalMinutes += 12 * 60;
        const durationInMinutes = endTotalMinutes - startTotalMinutes;
        const hours = Math.floor(Math.abs(durationInMinutes) / 60).toString().padStart(2, '0');
        const minutes = Math.abs(durationInMinutes) % 60;
        const formattedDuration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        setDuration(formattedDuration);
      } 
      else 
      {
        setDuration('');
      }
    } 
    else 
    {
      setDuration('');
    }
  };

  const[loading,setLoading]=useState(true);

  const [selectedCustomerId,setSelectedCustomerId]=useState('');
  const [selectedCustomerName,setSelectedCustomerName]=useState('');
  const[customers,setCustomers]=useState([]);

  const[activities,setActivities]=useState([]);
  const[selectedActivityValue,setSelectedActivityValue]=useState('');

  const[projects,setProjects]=useState([]);
  const[selectedProjectsValue,setSelectedProjectsValue]=useState('');

  const[description,setDescription]=useState("");

  function descriptionChangeHandler(event)
  {
    event.preventDefault();
    setDescription(event.target.value);
  }

  const[tag,setTag]=useState([]);
  const[selectedTagValue,setSelectedTagValue]=useState('');

  const[showProjectSelect,setShowProjectSelect]=useState(false);

  const[showActivitySelect,setShowActivitySelect]=useState(false);

  const[showTagSelect,setShowTagSelect]=useState(false);

  //Display Customer List UI Functionality
  useEffect(()=> 
  {
    const fetchCustomers=async()=> 
    {
      try 
      {
        const response=await axios.post('http://localhost:8081/user_home/customer');
        if(response.data.Result) 
        {
          setCustomers(response.data.Result);
          setLoading(false);
        } 
        else 
        {
          console.error('No customer data found');
          setCustomers([]);
          setLoading(false);
        }
      } 
      catch(error) 
      {
        console.error('Error fetching customer:', error);
        setLoading(false);
      }
    };
    fetchCustomers();
  },[]);

  //Display Customer Related Project List UI Functionality
  function handleFirstSelectChange(e)
  {
    e.preventDefault();

    const selectedCustomerId=e.target.value;
    setSelectedCustomerId(selectedCustomerId);
    if(selectedCustomerId==='1')
    {
      setSelectedCustomerName("Dassault");
    }
    if(selectedCustomerId==='2')
    {
      setSelectedCustomerName("Digital Marketing Project");
    }
    if(selectedCustomerId==='3')
    {
      setSelectedCustomerName("Ekaggata Internal Delivery");
    }
    if(selectedCustomerId==='4')
    {
      setSelectedCustomerName("Mate4Tech");
    }
    if(selectedCustomerId==='5')
    {
      setSelectedCustomerName("Milkvilla");
    }
    if(selectedCustomerId==='6')
    {
      setSelectedCustomerName("Joolkart");
    }
    if(selectedCustomerId==='7')
    {
      setSelectedCustomerName("MGD");
    }
    if(selectedCustomerId==='8')
    {
      setSelectedCustomerName("new");
    }
    if(selectedCustomerId==='9')
    {
      setSelectedCustomerName("new cust");
    }
    if(selectedCustomerId==='10')
    {
      setSelectedCustomerName("Priya");
    }
    if(selectedCustomerId==='11')
    {
      setSelectedCustomerName("newly");
    }
    const customerValue=e.target.value;
    if(customerValue!==0) 
    {
      setShowProjectSelect(true);
      setShowActivitySelect(true);
      axios.post('http://localhost:8081/user_home/project',{customerId:customerValue}).then(res=> 
      {
          if(res.data && res.data.projects && Array.isArray(res.data.projects)) 
          {
            const projectNames=res.data.projects.map(project=>project.name);
            setProjects(res.data.projects);
            setSelectedProjectsValue(projectNames);
          } 
          else 
          {
            setProjects([]);
            setSelectedProjectsValue('');
            console.error('No project found!');
          }
      })
      .catch(err=> 
      {
          setProjects([]);
          setSelectedProjectsValue('');
          console.error('Error fetching project:',err);
      }); 
    } 
    else 
    {
      setShowProjectSelect(false);
      setShowActivitySelect(false);
      setProjects([]);
      setSelectedCustomerName("");
    }
  }

  useEffect(()=> 
  {
    setSelectedCustomerId('');
    setSelectedCustomerName('');
  },[]);

  const newSelectedCustomerNameValue = selectedCustomerName ? selectedCustomerName : '';

  //Display Activity List UI Functionality
  useEffect(()=> 
  {
    const fetchActivities=async()=> 
    {
      try 
      {
        const response=await axios.post('http://localhost:8081/user_home/activity');
        if(response.data.Result) 
        {
          setActivities(response.data.Result);
        } 
        else 
        {
          console.error('No activity data found');
          setActivities([]);
        }
      } 
      catch(error) 
      {
        console.error('Error fetching activity:',error);
      }
    };
    fetchActivities();
  },[]);

  function handleThirdSelectChange(e) 
  {
    e.preventDefault();
    const selectedActivityValue=e.target.value;
    setSelectedActivityValue(selectedActivityValue);
  }

  //Display Tag List UI Functionality
  useEffect(()=> 
  {
    const fetchTags=async()=> 
    {
      try 
      {
        const response=await axios.post('http://localhost:8081/user_home/tag');
        if(response.data.Result) 
        {
          setShowTagSelect(true);
          setTag(response.data.Result);
          setLoading(false);
        } 
        else 
        {
          setShowTagSelect(false);
          console.error('No tag data found');
          setTag([]);
          setLoading(false);
        }
      } 
      catch(error) 
      {
        setShowTagSelect(false);
        console.error('Error fetching tag:',error);
        setTag([]);
        setLoading(false);
      }
    };
    fetchTags();
  },[]);

  function handleFourthSelectChange(e) 
  {
    e.preventDefault();
    const selectedTagValue=e.target.value;
    setSelectedTagValue(selectedTagValue);
  }

  /* const[userInfo,setUserInfo]=useState(null);
  useEffect(()=> 
  {
    axios.post('http://localhost:8081/user_home/userinfo').then((response) => 
      {
        setUserInfo(response.data);
      })
      .catch((error) => 
      {
        console.error('Error fetching user info:', error);
      });
  },[]); */

  
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState('');

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    console.log('Stored UserData:', storedUserData);
    if (storedUserData) {
      setUserData(storedUserData);
    } else {
      setUserData('');
    }
    console.log('LoggedIn Status:', loggedIn);
  }, [loggedIn, userData]);
  
  console.log('Rendering UserData:', userData);
  
  useEffect(() => 
  {
    axios.get('http://localhost:8081/user_home/userinfo')
      .then((response) => {
        if (response.data.loggedIn) {
          setLoggedIn(true);
          setUserData(response.data.user[0].name);
          localStorage.setItem('userData', response.data.user[0].name);
        } else {
          setLoggedIn(false);
          setUserData('');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setLoggedIn(false);
        setUserData('');
      });
  }, []);

  const [userId, setUserId] = useState(null);

  useEffect(() => 
  {
    fetchUserId();
  }, []);

  const fetchUserId = async () => 
  {
    try {
      const response = await fetch('http://localhost:8081/user_home/userid', 
      {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) 
      {
        const data = await response.json();
        setUserId(data.userId);
      } 
      else 
      {
        throw new Error('Failed to fetch user ID');
      }
    } 
    catch (error) 
    {
      console.error(error);
    }
  };

  // Define a state variable to track timesheet changes
  const [timesheetUpdated, setTimesheetUpdated] = useState(false);

  // Add useEffect hook to reload data when timesheet is updated
  useEffect(() => 
  {
    if(timesheetUpdated) 
    {
      console.log('Reloading data after timesheet update');
      setTimesheetUpdated(false);
      window.location.reload();
    }
  },[timesheetUpdated]);

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    if(!userId) 
    {
      return;
    }
    else
    {
      try 
      {
        //const stringifiedProjects=JSON.stringify(selectedProjectsValue);
        const stringifiedProjects=selectedProjectsValue.join(', '); // Join selected projects with a comma
        axios.post('http://localhost:8081/user_home/timesheet',{userId,selectedFromDate,selectedStartTime,duration,selectedEndTime,newSelectedCustomerNameValue,stringifiedProjects,selectedActivityValue,description,selectedTagValue});
        handleClose();
        setTimesheetUpdated(true);
        alert("Your Time Sheet has been created successfully.");
        navigate('/user_home');
      } 
      catch(error) 
      {
        setTimesheetUpdated(false);
        alert("Something went wrong!");
        navigate('/user_home');
      }
    }
  }

  const isSubMenuItem = selectedSubMenuItem && selectedMenuItem && selectedSubMenuItem !== selectedMenuItem;

  return (
    <>
    <div className="header">
      <div className="row">
            <div className="col col-4 col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xxl-4 col-xs-4" style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 'auto' }}>
              {selectedMenuItem && (
              <div className="row mb-2">
                <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center', alignContent: 'center' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedMenuItem}</p>
              </div>
              )}
              {(isSubMenuItem && !selectedMenuItem) && (
              <div className="row">
                <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center', alignContent: 'center' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedSubMenuItem}</p>
              </div>
              )}
              {!selectedMenuItem && !selectedSubMenuItem && (
                <div className="row">
                  <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center', alignContent: 'center' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dashboard</p>
                </div>
              )}
            </div>
            <div className="col col-6 col-lg-6 col-md-6 col-sm-6 col-xl-6 col-xxl-6 col-xs-6" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {loggedIn ? 
                (
                  <>
                    <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center' }}>Welcome, {userData || 'Loading ....'}</p>
                  </>
                ) 
                : 
                (
                  <>
                    <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center' }}>Welcome, {userData || 'Loading ....'}</p>
                  </>
              )}
            <button className="btn btn-primary w-20 fw-bold text-center align-items-center p-1" style={{ marginLeft: '20px', marginRight: '20px', backgroundColor: 'transparent', border: '0px' }} onClick={handleShow} title='Click Here to Create Time Card'>
              <Image src={CreateTimeCardImage} alt="Create Time Card" title="Create Time Card" style={{ width: '40px', height: '40px' }}></Image>
            </button>
            <button className="btn btn-danger w-20 fw-bold text-center align-items-center p-1" onClick={NavigateBackToLogin} title='Click Here to Log Out' style={{ backgroundColor: 'transparent', border: '0px' }}>
              <Image src={LogOut} alt="Log Out" title="Log Out" style={{ width: '40px', height: '40px' }}></Image>
            </button>
          </div>
          <Modal show={show} onHide={handleClose} className="d-flex justify-content-center align-items-center vh-100">
            <form onSubmit={handleSubmit}> 
              <Modal.Header closeButton>
                <Modal.Title><center>Create Time Card</center></Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div className="container">
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="fromdate" className="form-label w-100 me-2" style={{ width: '100vw' }}>
                        From <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control me-4"
                        id="fromdate"
                        name="fromdate"
                        style={{ width: '100%' }}
                        value={selectedFromDate}
                        onChange={handleFromDateChange}
                        required
                      />
                      <select 
                        className="form-control me-0"
                        style={{ width: '100%' }}
                        id="fromtime"
                        name="fromtime"
                        value={selectedStartTime} 
                        onChange={handleStartTimeSelection}
                        required
                      >
                        <option value="">Start Time</option>
                        {startTimeSlots.map((slot,index)=> 
                        (
                          <option key={index} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="email" className="form-label w-100 me-2" style={{ width: '100vw' }}>
                        Duration / End
                      </label>
                      <input
                        type="text"
                        className="form-control me-4"
                        id="duration"
                        name="duration"
                        style={{ width: '100%' }}
                        readOnly
                        disabled
                        value={duration}
                        onChange={(e)=>setDuration(e.target.value)}
                      />
                      <select 
                        className="form-control me-0"
                        style={{ width: '100%' }}
                        id="endtime"
                        name="endtime"
                        value={selectedEndTime} 
                        onChange={handleEndTimeSelection}
                      >
                        <option value="">End Time</option>
                        {endTimeSlots.map((slot,index) => 
                        (
                          <option key={index} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="message" className="form-label me-2" style={{ width: '100%' }}>
                        Customer
                      </label>
                      <select type="dropdown" className='form-control me-0' id="customer" name="customer" style={{ width: '100vw' }} value={selectedCustomerId} onChange={handleFirstSelectChange}> 
                        <option value="">Please Select Customer</option>
                        {
                          loading 
                          ? 
                          ( 
                            <option value="">No Customer Available</option>
                          ) 
                          : 
                          (
                            customers.map((customer,id)=>(<option key={id} id={id} value={customer.id}>{customer.name}</option>))
                          )
                        }
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="projects" className="form-label me-2" style={{ width: '100%' }}>
                        Project <span style={{ color: 'red' }}>*</span>
                      </label>
                      <select type="dropdown" className="form-control me-0" id="projects" name="projects" style={{ width: '100vw' }} required>
                        {
                          showProjectSelect 
                          ?
                          loading 
                          ? 
                          (
                            <option value="">No Project Available!</option>
                          ) 
                          : 
                          (
                            projects.map((project,id)=>(<option key={id} id={id} value={project.name}>{project.name}</option>))
                          )
                          :
                          (
                            <option value="">Please Select Project</option> 
                          )
                        }
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="activities" className="form-label me-2" style={{ width: '100%' }}>
                        Activity <span style={{ color: 'red' }}>*</span>
                      </label>
                      <select className='form-control me-0' id="activities" name="activities" style={{ width: '100vw' }} required onChange={handleThirdSelectChange}>
                        <option value="">Please Select Activity</option>
                        {
                          showActivitySelect 
                          ?
                          loading 
                          ? 
                          ( 
                            <option value="">No Activity Available</option> 
                          ) 
                          : 
                          (
                            activities.map((activity)=>(<option key={activity.id} id={activity.id} value={activity.name}>{activity.name}</option>))
                          )
                          :
                          ( 
                            <option value="">Please Select Customer & Project First!</option> 
                          )
                        }
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="description" className="form-label me-2" style={{ width: '100%' }}>
                        Description
                      </label>
                      <textarea className="form-control me-0" id="description" name="description" rows="2" style={{ width: '100vw' }} onChange={descriptionChangeHandler}></textarea>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex">
                      <label htmlFor="tag" className="form-label me-2" style={{ width: '100%' }}>
                        Tags
                      </label>
                      <select type="dropdown" className="form-control me-0" id="tag" name="tag" style={{ width: '100vw' }} onChange={handleFourthSelectChange}>
                        <option value="">Please Select Tag</option>
                        {
                          showTagSelect 
                          ?
                          loading 
                          ? 
                          ( 
                            <option value="">No Tag Available</option> 
                          ) 
                          : 
                          (
                            tag.map((tag,id)=>(<option key={id} id={id} value={tag.name}>{tag.name}</option>))
                          )
                          :
                          ( 
                            <option value="">Please Select Tag</option> 
                          )
                        }
                      </select>
                    </div>
                  </div>
              </div>
              </Modal.Body>
              <Modal.Footer>
                <button type="submit" className="btn btn-primary">Save</button> 
                <Button className="btn btn-danger" variant="secondary" onClick={handleClose}>Close</Button>
              </Modal.Footer>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Header;
