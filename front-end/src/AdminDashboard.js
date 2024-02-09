import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminCSS.css';
import { Container, Row } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
//import { Rect, Svg } from 'react-native-svg';

function AdminDashboard()
{
  const [durationData, setDurationData] = useState([]);
  useEffect(() => 
  {
    const fetchData = async () => 
    {
      try 
      {
        const response = await fetch("http://localhost:8081/home/timesheet_data");
        const data = await response.json();
        if (Array.isArray(data)) 
        {
          setDurationData(data);
        } 
        else 
        {
          console.error("Invalid data format:", data);
        }
      } 
      catch (error) 
      {
        console.error("Error fetching duration data:", error);
      }
    };
    fetchData();
  },[]);
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
  //const totalWorkingHours = durationData.reduce((total, entry) => total + entry.duration, 0);
  //const totalWorkingHours = durationData.reduce((total, entry) => total + entry.hours, 0);

  const renderCustomTooltip = (props) => 
  {
    const { payload } = props;
  
    if (payload && payload.length > 0) {
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
      <Row style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: '26px', marginTop: '30px' }}><h6><b>Admin Working Hours</b></h6></Row>
      <Row>
        {/* <ResponsiveContainer width="100%" height={400}>
          <BarChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="duration" fill="rgba(33, 150, 243, 1)" />
          </BarChart>
        </ResponsiveContainer> */}
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={durationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} backgroundColor="#329DD3">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fromdate" />
            <YAxis dataKey="duration" />
            <Tooltip content={(props) => renderCustomTooltip(props)} />
            <Legend />
            {/* <Bar dataKey="duration" fill="rgba(33, 150, 243, 1)" /> */}
            <Bar dataKey="duration" fill="#329DD3">
              {durationData.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="duration" fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Row>
      <Row style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: '26px', marginTop: '20px', marginBottom: '0px' }}><p>Total Working Hours</p></Row>
      <Row style={{ textAlign: 'center', fontWeight: 'bold', marginLeft: '26px' }}><p>{formattedTotal}</p></Row>
    </Container>
   </>
  );
}

export default AdminDashboard;
