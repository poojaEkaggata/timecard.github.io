import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/AdminCSS.css';
import { Container, Row } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; 

function UserDashboard()
{
  const [userId, setUserId] = useState(null);
  const [durationData, setDurationData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => 
  {
    fetchUserId();
  },[]);
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
  useEffect(() => 
  {
    if(!userId) 
    {
      return;
    }
    const fetchData = async () => 
    {
      try 
      {
        const response = await fetch("http://localhost:8081/user_home/timesheet_data",{method: 'GET',credentials: 'include'});
        const data = await response.json();
        if(Array.isArray(data)) 
        {
          setDurationData(data);
        } 
        else 
        {
          console.error("Invalid data format:", data);
        }
      } 
      catch(error) 
      {
        console.error("Error fetching duration data:", error);
      } 
      finally 
      {
        setLoading(false);
      }
    };
    fetchData();
  },[userId]);
  const totalSeconds = durationData.reduce((total,entry) => 
  {
    const durationString = entry.duration;
    if (typeof durationString === "string") 
    {
      const timeComponents = durationString.split(":");
      if (timeComponents.length === 3) 
      {
        const [hours, minutes, seconds] = timeComponents.map(Number);
        return total + hours * 3600 + minutes * 60 + seconds;
      } 
      else 
      {
        console.error("Invalid duration format:", durationString);
        return total;
      }
    } 
    else 
    {
      console.error("Invalid duration format:", durationString);
      return total;
    }
  },0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const formattedTotal = `${hours.toString().padStart(2, "0")} Hours : ${minutes.toString().padStart(2, "0")} Minutes : ${seconds.toString().padStart(2, "0")} Seconds`;
  const renderCustomTooltip = (props) => 
  {
    const { payload } = props;
  
    if (payload && payload.length > 0) 
    {
      const duration = payload[0].value;
      return (
        <div className="custom-tooltip">
          <p>{`Duration: ${duration}`}</p>
        </div>
      );
    }
    return null;
  };
  return (
   <>
    <Container>
    {
    loading 
    ? 
    (
      <>
        <Row className="mt-5"><p style={{ textAlign: 'center' }}>Loading...</p></Row>
      </>
    ) 
    : 
    (
      <>
        <Row style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: '26px', marginTop: '30px' }}><h6><b>Your Working Hours</b></h6></Row>
        <Row>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} backgroundColor="#329DD3">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fromdate" />
              <YAxis dataKey="duration" />
              <Tooltip content={(props) => renderCustomTooltip(props)} />
              <Legend />
              <Bar dataKey="duration" fill="#329DD3">
                {durationData.map((entry, index) => (
                  <Bar key={`bar-${index}`} dataKey="duration" fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Row>
        <Row style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: '26px', marginTop: '20px', marginBottom: '0px' }}><p>Your Total Working Hours</p></Row>
        <Row style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: '26px' }}><p>{formattedTotal}</p></Row>
      </>
    )
    }
    </Container>
   </>
  );
}

export default UserDashboard;
