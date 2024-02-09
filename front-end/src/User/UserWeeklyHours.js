import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import axios from 'axios'; 

const UserWeeklyHours = () => 
{
  // Month Name Data
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentWeek = Math.ceil((currentDate.getDate() + new Date(currentYear, currentMonth, 1).getDay()) / 7);

  // State variables
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  //const [rows, setRows] = useState([{ projects: '', activity: '', durations: Array(7).fill('00:00'), totalDuration: '00:00' }]);

  const [rows, setRows] = useState([
    { projects: '', activity: '', durations: Array(7).fill('00:00'), totalDuration: '00:00' }
  ]);  

  const [projects, setProjects] = useState([]);

  const [activity, setActivity] = useState([]);

  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);

  // Function to fetch logged in user data
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

  //Function to fetch logged in user's id
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

  // Fetch assigned projects for the logged-in user
  useEffect(() => 
  {
    if(!userId) 
    {
      return;
    }
    else
    {
      axios.get(`http://localhost:8081/user_home/user/${userId}/project_records`).then(response => 
      {
        const projectNames = response.data.map(project => project.projects);
        const uniqueProjectNames = new Set(projectNames);
        setProjects(Array.from(uniqueProjectNames));
      })
      .catch(error => 
      {
        console.error('Error fetching projects:', error);
      });
    }
  },[userId]);

  // Fetch assigned activity for the logged-in user
  useEffect(() => 
  {
    if(!userId) 
    {
      return;
    }
    else
    {
      axios.get(`http://localhost:8081/user_home/user/${userId}/activity_records`).then(response => 
      {
        const activityNames = response.data.map(activity => activity.activity);
        const uniqueActivityNames = new Set(activityNames);
        setActivity(Array.from(uniqueActivityNames));
      })
      .catch(error => 
      {
        console.error('Error fetching activity:', error);
      });
    }
  },[userId]);

  // Function to handle changing month, year, and week
  const handlePrev = () => 
  {
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
    const totalWeeksInPrevMonth = Math.ceil((daysInPrevMonth - 1) / 7) + 1;
    if (selectedWeek === 1 && selectedMonth === 0) 
    {
      setSelectedWeek(totalWeeksInPrevMonth);
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } 
    else if (selectedWeek === 1) 
    {
      setSelectedWeek(totalWeeksInPrevMonth);
      setSelectedMonth(prevMonth);
    } 
    else 
    {
      setSelectedWeek(selectedWeek - 1);
    }
  };

  const handleNext = () => 
  {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const totalWeeksInMonth = Math.ceil((daysInMonth - 1) / 7) + 1;
    if (selectedWeek === totalWeeksInMonth) 
    {
      setSelectedWeek(1);
      if (selectedMonth === 11) 
      {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } 
      else 
      {
        setSelectedMonth(selectedMonth + 1);
      }
    } 
    else 
    {
      setSelectedWeek(selectedWeek + 1);
    }
  };

  // Function to handle changing duration
  const handleChangeDuration = (index, dayIndex, event) => 
  {
    const { value } = event.target;
    const newRows = [...rows];
    const timeValue = String(value);
    newRows[index].durations[dayIndex] = timeValue;
    const totalMinutes = newRows[index].durations.reduce((total, duration) => 
    {
      if (typeof duration === 'string') 
      {
        const [hours, minutes] = duration.split(':').map(Number);
        return total + (hours * 60) + minutes;
      }
      return total;
    }, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    newRows[index].totalDuration = `${formattedHours}:${formattedMinutes}`;
    setRows(newRows);
  };

  // Function to add new row
  const handleAddRow = () => 
  {
    setRows([...rows, { projects: '', activity: '', durations: Array(7).fill(0) }]);
  };

  // Function to delete last added row
  const handleDeleteRow = () => 
  {
    if (rows.length > 1) 
    {
      const updatedRows = rows.slice(0, -1);
      setRows(updatedRows);
    } 
    else 
    {
      alert("Cannot delete all rows. At least one row is required.");
    }
  };  

  // Function to convert time format as HH:MM
  function convertToHHMM(totalMinutes) 
  {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  }

  // Function to calculate total working hours for a row
  const calculateTotalHours = (durations) => 
  {
    const totalMinutes = durations.reduce((acc, curr) => 
    {
      if (typeof curr === 'string') 
      {
        const [hours, minutes] = curr.split(':').map(Number);
        return acc + (hours * 60 + minutes);
      } 
      else
      {
        return acc;
      }
    }, 0);
    return totalMinutes;
  };

  // Function to get the name of the day
 const getDayName = (dayIndex) => 
 {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayIndex];
 };


  return (
    <>
      <div className="container mt-3" style={{ maxHeight: '680px', overflowY: 'auto' }}>
      {
        loading
        ? 
        (
          <>
            <div className="row mt-5"><p style={{ textAlign: 'center' }}>Loading...</p></div>
          </>
        ) 
        : 
        (
          <>
            <div className="row mt-3 mb-3">
              <div className="col d-flex justify-content-start" style={{ marginLeft: '90px' }}>
                <button className="btn btn-primary fw-b" onClick={handlePrev}>{"<"}</button>
                <input type="text" className="form-control" value={`${selectedYear}, ${monthNames[selectedMonth]}, Week: ${selectedWeek}`} readOnly style={{ marginLeft: '10px', marginRight: '10px', width: '300px', textAlign: 'center', fontWeight: 'bold' }} />
                <button className="btn btn-primary fw-b" onClick={handleNext}>{">"}</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-success btn-md mr-2">Save</button>
              </div>
              <div className="col-auto">
                <button className="btn btn-primary btn-md mr-2" onClick={handleAddRow}>Add Row</button>
              </div>
              <div className="col-auto" style={{ marginRight: '90px' }}>
                <button className="btn btn-danger btn-md" onClick={handleDeleteRow}>Delete Row</button>
              </div>
            </div>
            <div className="row mb-3 justify-content-center">
              <div className="col-auto">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th style={{ background: '#f2f2f2' }}>Project</th>
                      <th style={{ background: '#f2f2f2' }}>Activity</th>
                      {[...Array(7)].map((_, index) => (
                        <th key={index} style={{ background: '#f2f2f2' }}>{getDayName(index)}</th>
                      ))}
                      <th style={{ background: '#f2f2f2' }}>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <select
                            className="form-control"
                            value={row.projects}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? { ...r, projects: e.target.value } : r
                                )
                              )
                            }
                            style={{ width: '200px' }}
                          >
                            <option value="">Project</option>
                            {projects.map(project => 
                            (
                              <option key={project} value={project}>
                                {project}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-control"
                            value={row.activity}
                            onChange={(e) =>
                              setRows(
                                rows.map((r, i) =>
                                  i === index ? { ...r, activity: e.target.value } : r
                                )
                              )
                            }
                            style={{ width: '200px' }}
                          >
                            <option value="">Activity</option>
                            {activity.map(activity => 
                            (
                              <option key={activity} value={activity}>
                                {activity}
                              </option>
                            ))}
                          </select>
                        </td>
                        {row.durations.map((duration, dayIndex) => (
                          <td key={dayIndex}>
                            <select className="form-control" value={duration} onChange={(e) => handleChangeDuration(index, dayIndex, e)}>
                              {[...Array(25 * 4)].map((_, index) => {
                                const hour = Math.floor(index / 4);
                                const minute = index % 4 * 15;
                                const formattedHour = hour.toString().padStart(2, '0');
                                const formattedMinute = minute.toString().padStart(2, '0');
                                return (
                                  <option key={index} value={`${formattedHour}:${formattedMinute}`}>{`${formattedHour}:${formattedMinute}`}</option>
                                );
                              })}
                            </select>
                          </td>
                        ))}
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{row.totalDuration}</td>
                      </tr>
                      ))}
                    <tr>
                      <td colSpan={2} style={{ fontWeight: 'bold', textAlign: 'left', background: '#00A36C', color: '#ffffff' }}>Total Working Hours</td>
                      {[...Array(7)].map((_, index) => (
                        <td key={index} style={{ textAlign: 'left', background: '#00A36C', color: '#ffffff' }}></td>
                      ))}
                      <td style={{ textAlign: 'center', fontWeight: 'bold', background: '#00A36C', color: '#ffffff' }}>
                        {convertToHHMM(
                          rows.reduce((total, row) => total + calculateTotalHours(row.durations), 0)
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      }
      </div>
    </>
  );
};

export default UserWeeklyHours;
