import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminCSS.css';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Validation from './LoginValidation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';

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

function MyVerticallyCenteredModal(props) 
{
  let navigate = useNavigate();
  const[loading, setLoading]=useState(true);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    language: '',
    timezone: '',
    staff_number: '',
    supervisor: '',
    team: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  function handleInput(event)
  {
    if(selectedLanguage && selectedTimezone && selectedSupervisor && selectedTeam && selectedRole) 
    {
      setSelectedLanguage(event.target.value);
      setSelectedTimezone(event.target.value);
      setSelectedSupervisor(event.target.value);
      setSelectedTeam(event.target.value);
      setSelectedRole(event.target.value);
    }
    setValues(prev=>({...prev,[event.target.name]:[event.target.value]}))
  }
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');

  const handleKeyPress = (event) => 
  {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    const isNumber = /^[0-9]+$/.test(keyValue);
    if (!isNumber) 
    {
      event.preventDefault();
    }
  };

  //const moment = require('moment-timezone');
  //const allTimeZones = moment.tz.names();

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
            setLoading(false);
          } 
          else 
          {
            console.error('No Supervisor data found');
            setSupervisor([]);
            setLoading(false);
          }
        } 
        catch(error) 
        {
          console.error('Error fetching supervisor:', error);
          setLoading(false);
        }
      };
      fetchSupervisor();
  },[]);

  const[selectedSupervisor, setSelectedSupervisor] = useState('');

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
            setLoading(false);
          } 
          else 
          {
            console.error('No Team data found');
            setTeam([]);
            setLoading(false);
          }
        } 
        catch(error) 
        {
          console.error('Error fetching team:', error);
          setLoading(false);
        }
      };
      fetchTeam();
  },[]);
  
  const[selectedTeam, setSelectedTeam] = useState('');

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
            setLoading(false);
          } 
          else 
          {
            console.error('No Team data found');
            setRole([]);
            setLoading(false);
          }
        } 
        catch(error) 
        {
          console.error('Error fetching team:', error);
          setLoading(false);
        }
      };
      fetchRole();
  },[]);

  const[selectedRole, setSelectedRole] = useState('');

  function handleEmployeeSubmit(event)
  {
    event.preventDefault();
    try 
    {
      const newErrors = Validation(values);
      if(newErrors.name === "" && newErrors.email === "" && newErrors.password === "") 
      {
        axios.post('http://localhost:8081/home', values).then(res => 
        {
            if(res.data.message === "User created successfully.") 
            {
              alert("Your User has been created successfully.");
              props.onHide();
              navigate('/home');
            } 
            else 
            {
              alert("Something went wrong!");
              navigate('/home');
            }
        }).catch(err => console.log(err));
      } 
      else 
      {
        setErrors(newErrors);
      }
    } 
    catch (error) 
    {
      alert("Error Occurred!");
      navigate('/home');
    }
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      cancel={props.close}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="text-center d-flex justify-content-center ml-auto mr-auto">
          <p className="text-center d-flex justify-content-center ml-auto mr-auto">Create New User</p>
        </Modal.Title>
      </Modal.Header>
      <form action="" onSubmit={handleEmployeeSubmit}>
      <Modal.Body>
          <Row className="mb-3 mt-0 d-flex justify-content-center ml-auto mr-auto p-0">
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              {/* <label htmlFor="name" className="mb-2"><strong>Name</strong></label> */}
              <input type="text" className="form-control rounded-0" placeholder="Enter Name" name="name" onChange={handleInput} required />
              {errors.name && <span className="text-danger">{errors.name}</span>}
            </Col>
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <input type="email" className="form-control rounded-0" placeholder="Enter E-Mail ID" name="email" onChange={handleInput} required />
              {errors.email && <span className="text-danger">{errors.email}</span>}
            </Col>
          </Row>
          <Row className="mb-3 d-flex justify-content-center ml-auto mr-auto p-0">
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <input type="password" className="form-control rounded-0" placeholder="Enter Password" name="password" onChange={handleInput} required />
              {errors.password && <span className="text-danger">{errors.password}</span>}
            </Col>
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <input type="text" className="form-control rounded-0" placeholder="Enter Title" name="title" onChange={handleInput} />
            </Col>
          </Row>
          <Row className="mb-3 d-flex justify-content-center ml-auto mr-auto p-0">
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <select className="form-select form-select-md rounded-0" aria-label="Default select example" id="language" name="language" onChange={handleInput} required >
                <option value="">Select Language</option>
                {language.map((language,index) => 
                (
                  <option key={index} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </Col>
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <select className="form-select form-select-md rounded-0" aria-label="Default select example" id="timezone" name="timezone" onChange={handleInput} required >
                <option value="">Select Timezone</option>
                {timezone.map((timezone,index) => 
                (
                  <option key={index} value={timezone}>
                    {/* allTimeZones */}
                    { timezone }
                  </option>
                ))}
              </select>
            </Col>
          </Row>
          <Row className="mb-3 d-flex justify-content-center ml-auto mr-auto p-0">
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <input type="text" className="form-control rounded-0" placeholder="Enter Employee Number" name="staff_number" onChange={handleInput} maxLength={7} pattern="\d{0,9}" onKeyPress={handleKeyPress} />
            </Col>
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <select className="form-select form-select-md rounded-0" aria-label="Default select example" id="supervisor" name="supervisor" onChange={handleInput}>
                <option value="">Select Supervisor</option>
                {
                  loading 
                  ? 
                  ( 
                    <option value="">No Supervisor Available</option>
                  ) 
                  : 
                  (
                    supervisor.map((supervisor,id)=>(<option key={id} id={id} value={supervisor.id}>{supervisor.name}</option>))
                  )
                }
              </select>
            </Col>
          </Row>
          <Row className="mb-0 d-flex justify-content-center ml-auto mr-auto p-0">
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <select className="form-select form-select-md rounded-0" aria-label="Default select example" id="team" name="team" onChange={handleInput}>
                <option value="">Select Team</option>
                {
                  loading 
                  ? 
                  ( 
                    <option value="">No Team Available</option>
                  ) 
                  : 
                  (
                    team.map((team,id)=>(<option key={id} id={id} value={team.id}>{team.name}</option>))
                  )
                }
              </select>
            </Col>
            <Col className="col-6 col-lg-6 col-xl-6 col-xxl-6 col-md-6 col-sm-6 col-xs-6">
              <select className="form-select form-select-md rounded-0" aria-label="Default select example" id="role" name="role" onChange={handleInput}>
                <option value="">Select Role</option>
                {
                  loading 
                  ? 
                  ( 
                    <option value="">No Role Available</option>
                  ) 
                  : 
                  (
                    role.map((role,id)=>(<option key={id} id={id} value={role.id}>{role.name}</option>))
                  )
                }
              </select>
            </Col>
          </Row>
      </Modal.Body>
      <Modal.Footer>
        <button type="submit" className="btn btn-primary"><strong>Save</strong></button> 
        <Button className="btn btn-danger" onClick={props.onHide}><strong>Close</strong></Button>
      </Modal.Footer>
      </form>
    </Modal>
  );
}

function CreateUser({ selectedMenuItem, selectedSubMenuItem })
{
    let navigate=useNavigate(); 
    function NavigateBackToLogin()
    { 
      let path=`/`; 
      navigate(path);
    }
    const [modalShow, setModalShow] = useState(false);

    /* const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(''); */

    /* useEffect(() => 
    {
      axios.get('http://localhost:8081/home/userinfo').then((response) => 
        {
          if(response.data.loggedIn) 
          {
            setLoggedIn(true);
            setUserData(response.data.user[0].name);
            //setUserId(response.data.user[0].user_id)
          } 
          else 
          {
            setLoggedIn(false);
            setUserData('');
            //setUserId('');
          }
        })
        .catch((error) => 
        {
          console.error('Error fetching user data:', error);
          setLoggedIn(false);
          setUserData('');
          //setUserId();
        });
    },[]); */

    /* localStorage.setItem('loggedInUsername', userData.name);
    useEffect(() => 
    {
      const storedUsername = localStorage.getItem('loggedInUsername');
      if (storedUsername) 
      {
        setUserData(storedUsername);
        setLoggedIn(true);
      } 
      else 
      {
        setUserData('');
        setLoggedIn(false);
      }
    }, []); */

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

  /* const[errorMessage,setErrorMessage]=useState(''); */

  function handleEndTimeSelection(e)
  {
    setSelectedEndTime(e.target.value);
    calculateDuration(e.target.value,selectedStartTime);
    /* //to check whether user enter appropriate end time or no
    if(selectedEndTime<selectedStartTime) 
    {
      setErrorMessage('End time cannot be less than start time!');
    } 
    else 
    {
      setErrorMessage('');
      calculateDuration(e.target.value, selectedStartTime);
    } */
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
    /* if (selectedStartTime && selectedEndTime) 
    {
      const startRegex = /(\d+):(\d+) ([AaPp][Mm])/;
      const [, startHours, startMinutes] = selectedStartTime.match(startRegex);
      const [, endHours, endMinutes, endPeriod] = selectedEndTime.match(startRegex);
      const startHoursInt = parseInt(startHours, 10);
      const startMinutesInt = parseInt(startMinutes, 10);
      const endHoursInt = parseInt(endHours, 10);
      const endMinutesInt = parseInt(endMinutes, 10);
      const startTotalMinutes = startHoursInt * 60 + startMinutesInt;
      let endTotalMinutes = endHoursInt * 60 + endMinutesInt;
      if (endPeriod.toUpperCase() === 'AM' && startTotalMinutes > endTotalMinutes) 
      {
        endTotalMinutes += 24 * 60;
      }
      const durationInMinutes = endTotalMinutes - startTotalMinutes;
      const hours = Math.floor(Math.abs(durationInMinutes) / 60).toString().padStart(2, '0');
      const minutes = Math.abs(durationInMinutes) % 60;
      const formattedDuration = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setDuration(formattedDuration);
    } 
    else 
    {
      setDuration('');
    } */
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
        const response=await axios.post('http://localhost:8081/home/customer');
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

    const customerValue=e.target.value;
    if(customerValue!==0) 
    {
      setShowProjectSelect(true);
      setShowActivitySelect(true);
      axios.post('http://localhost:8081/home/project',{customerId:customerValue}).then(res=> 
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
        const response=await axios.post('http://localhost:8081/home/activity');
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
        const response=await axios.post('http://localhost:8081/home/tag');
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

  const handleSubmit = async (e) =>
  {
    e.preventDefault();
    try 
    {
      const userId = '1';

      const stringifiedProjects=JSON.stringify(selectedProjectsValue);

      axios.post('http://localhost:8081/home/timesheet',{userId,selectedFromDate,selectedStartTime,duration,selectedEndTime,newSelectedCustomerNameValue,stringifiedProjects,selectedActivityValue,description,selectedTagValue});
      handleClose();
      alert("Your Time Sheet has been created successfully.");
      navigate('/home');
    } 
    catch(error) 
    {
      console.error('Error:',error);
      alert("Something went wrong!");
      navigate('/home');
    }
  }

  const isSubMenuItem = selectedSubMenuItem && selectedMenuItem && selectedSubMenuItem !== selectedMenuItem;

  return (
      <>
        <div className="header">
          <div className="row">
            <div className="col col-4 col-lg-4 col-md-4 col-sm-4 col-xl-4 col-xxl-4 col-xs-4" style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: 'auto' }}>
              {/* {(selectedMenuItem && !isSubMenuItem) || (!isSubMenuItem && !selectedSubMenuItem) && (
              <div className="row mb-2">
                <p style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center', alignContent: 'center' }}>{selectedMenuItem}</p>
              </div>
              )} */}
              {selectedMenuItem && (
              <div className="row mb-2">
                <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center', alignContent: 'center' }}>{selectedMenuItem}</p>
              </div>
              )}
              {(isSubMenuItem && !selectedMenuItem) && (
              <div className="row">
                <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center', alignContent: 'center' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{selectedSubMenuItem}</p>
              </div>
              )}
              {!selectedMenuItem && !selectedSubMenuItem && (
                <div className="row">
                  <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center', alignContent: 'center' }}>Dashboard</p>
                </div>
              )}
            </div>
            <div className="col col-6 col-lg-6 col-md-6 col-sm-6 col-xl-6 col-xxl-6 col-xs-6" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {/* {loggedIn ? 
                (
                  <> */}
                    {/* <p> className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center' }}Welcome, {userData}</p> */}
                    <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center' }}>Welcome, Admin</p>
                  {/* </>
                ) 
                : 
                (
                  <> */}
                    {/* <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center' }}>Welcome, {userData}</p> */}
                    {/* <p className="mt-2" style={{ padding: '0px 0px 0px 0px', fontWeight: 'bold', alignItems: 'center' }}>Welcome, Admin</p>
                  </>
                )} */}
                <button className="btn btn-primary w-20 fw-bold text-center align-items-center mb-0" style={{ marginLeft: '20px', marginRight: '20px' }} onClick={handleShow} title='Click Here to Create Time Card'>
                  <FontAwesomeIcon icon={faPlus} /> Create Time Card
                </button>
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
                                className="form-select form-select-md rounded-0 me-0"
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
                                className="form-select form-select-md rounded-0 me-0"
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
                              <select className='form-select form-select-md rounded-0 me-0' id="customer" name="customer" style={{ width: '100vw' }} value={selectedCustomerId} onChange={handleFirstSelectChange}> 
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
                              <select className="form-select form-select-md rounded-0 me-0" id="projects" name="projects" style={{ width: '100vw' }} required
                              //onChange={handleSecondSelectChange} 
                              >
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
                              <select className='form-select form-select-md rounded-0 me-0' id="activities" name="activities" style={{ width: '100vw' }} required onChange={handleThirdSelectChange}>
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
                              <select className="form-select form-select-md rounded-0 me-0" id="tag" name="tag" style={{ width: '100vw' }} onChange={handleFourthSelectChange}>
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
                <button className="btn btn-primary w-20 fw-bold text-center align-items-center mb-0" style={{ marginRight: '20px' }} onClick={()=>setModalShow(true)} title='Click Here to Create New User'>
                  <FontAwesomeIcon icon={faPlus} /> Create User
                </button>
                <MyVerticallyCenteredModal show={modalShow} onHide={()=>setModalShow(false)} />
                <button className="btn btn-danger w-20 fw-bold text-center align-items-center mb-0" onClick={NavigateBackToLogin} title='Click Here to Log Out'>
                  <FontAwesomeIcon icon={faSignOut} /> Log Out
                </button>
            </div>
        </div>
      </div>
      </>
  );
};

export default CreateUser;
