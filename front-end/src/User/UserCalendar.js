import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/UserCalendar.css';

function MonthView({ date }) 
{
  const getDaysInMonth = (date) => 
  {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };
  const daysInMonth = getDaysInMonth(date);
  const startingDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const generateDates = () => 
  {
    const dates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(i);
    }
    return dates;
  };
  const getDayName = (index) => 
  {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[index];
  };
  const isToday = (day) => 
  {
    const today = new Date();
    return (
      day === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  return (
    <>
      <div className='calendar'>
            {Array.from({ length: 7 }, (_, index) => (
              <div key={`day-${index}`} className="day-name">
                {getDayName(index)}
              </div>
            ))}
            {[...Array(startingDay).keys()].map((_, index) => (
              <div key={`empty-${index}`} className="empty-cell" />
            ))}
            {generateDates().map((day) => (
              <div key={day} className={`date-cell ${isToday(day) ? 'today' : ''}`}>
                {day}
              </div>
            ))}
      </div>
    </>
  );
}

function WeekView() 
{
  const [startDate, setStartDate] = useState(new Date());
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDate = new Date(startDate);
  const weekDates = [];
  for (let i = 0; i < 7; i++) 
  {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + i);
    weekDates.push(newDate);
  }
  const renderTimeSlots = () => 
  {
    const timeSlots = [];
    for (let i = 0; i < 24; i++) 
    {
      for (let j = 0; j < 2; j++) 
      {
        let hour = i % 12 === 0 ? 12 : i % 12;
        const time = `${hour}:${j === 0 ? '00' : '30'} ${i < 12 ? 'AM' : 'PM'}`;
        timeSlots.push(
          <td key={time} className="time-slot-one">{time}</td>
        );
      }
    }
    return timeSlots;
  };
  const prevWeek = () => 
  {
    const prevWeekStartDate = new Date(startDate);
    prevWeekStartDate.setDate(startDate.getDate() - 7);
    setStartDate(prevWeekStartDate);
  };
  const nextWeek = () => 
  {
    const nextWeekStartDate = new Date(startDate);
    nextWeekStartDate.setDate(startDate.getDate() + 7);
    setStartDate(nextWeekStartDate);
  };
  return (
    <>
      <div className='week_calendar'>
        <div className="week-view-calendar">
          <div className="calendar-nav">
            <button onClick={prevWeek} className='btn btn-primary'>Previous Week</button>
            <button onClick={nextWeek} className='btn btn-primary' style={{ marginLeft: '10px', marginRight: '0px' }}>Next Week</button>
          </div>
          <table className="week-table">
            <thead>
              <tr>
                <th className="time-column" style={{ backgroundColor: "#f9f9f9", border: '1px solid #cccc' }}>Time</th>
                {weekDates.map((date, index) => (
                  <th key={index} style={{ backgroundColor: '#f9f9f9', border: '1px solid #cccc' }}>
                    <div className="day-header" style={{  }}>
                      <div className="day-name">{days[date.getDay()]}</div>
                      <div className="new-date" style={{ textAlign: 'center' }}>{date.toLocaleDateString('en-GB')}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
               {renderTimeSlots().map((slot, index) => (
                <tr key={index}>
                  <td className="time-column" style={{ border: '1px solid #cccc', backgroundColor: 'rgb(249, 249, 249)' }}>{slot}</td>
                  {weekDates.map((_, index) => (
                    <td key={index} className="record-cell"></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function DayView({ date }) 
{
  const [currentDate, setCurrentDate] = useState(date);
  const renderTimeSlots = () => 
  {
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i % 12 === 0 ? 12 : i % 12;
        const minute = j === 0 ? '00' : '30';
        const period = i < 12 ? 'AM' : 'PM';
        const time = `${hour}:${minute} ${period}`;
        timeSlots.push(
          <div key={time} className="time-slot-three">{time}</div>
        );
      }
    }
    return timeSlots;
  };
  const renderDayEvents = () => 
  {
    const events = [];
    const dayEvents = {};
    events.forEach(event => {
      const time = event.time;
      if (!dayEvents[time]) {
        dayEvents[time] = [];
      }
      dayEvents[time].push(event);
    });
    const timeSlots = Array.from({ length: 48 }, (_, index) =>
    {
      const hour = Math.floor(index / 2);
      const minute = index % 2 === 0 ? '00' : '30';
      const time = `${hour < 10 ? '0' + hour : hour}:${minute}`;
      return (
        <div key={index} className="time-slot-two">
          {dayEvents[time] && dayEvents[time].map((event, i) => (
            <div key={i} className="event">{event.title}</div>
          ))}
        </div>
      );
    });
    return timeSlots;
  };
  const goToPreviousDay = () => 
  {
    const previousDay = new Date(currentDate);
    previousDay.setDate(currentDate.getDate() - 1);
    setCurrentDate(previousDay);
  };
  const goToNextDay = () => 
  {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDay);
  };
  return (
    <div className='day_calendar'>
      <div style={{ textAlign: 'right', marginTop: '10px', marginBottom: '10px' }}>
        <button onClick={goToPreviousDay} className="btn btn-primary">Previous Day</button>
        <button onClick={goToNextDay} className="btn btn-primary" style={{ marginLeft: '10px' }}>Next Day</button>
      </div>
      <div className="day-view-calendar">
        <div className="time-column-one">
          <div className="time-heading" style={{ border: '1px solid #ccc' }}>Time</div>
          {renderTimeSlots()}
        </div>
        <div className="day-events-column">
          <div className="time-heading">{currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          {renderDayEvents()}
        </div>
      </div>
    </div>
  );
}

function UserCalendar() 
{
  const [date, setDate] = useState(new Date());

  const prevMonth = () => {
    setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const prevYear = () => {
    setDate(prevDate => new Date(prevDate.getFullYear() - 1, prevDate.getMonth(), 1));
  };

  const nextYear = () => {
    setDate(prevDate => new Date(prevDate.getFullYear() + 1, prevDate.getMonth(), 1));
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [view, setView] = useState('month');

  const handleViewChange = (newView) => 
  {
    setView(newView);
  };

  return (
    <>
      <div className='container' style={{ overflowX: 'hidden', overflowY: 'auto' }}>
          <div className='row mt-5 mb-5'>
            <div className="col d-flex justify-content-left" style={{ marginLeft: '130px', marginRight: 'auto', textAlign: 'center', alignItems: 'center', verticalAlign: 'middle' }}>
              <h6 style={{ textAlign: 'center', alignItems: 'center', verticalAlign: 'middle' }}>{monthNames[date.getMonth()]}, {date.getFullYear()}</h6>
            </div>
            <div className="col view-buttons">
              <button onClick={goToToday} className='btn btn-primary' style={{ width: 'auto', height: '37px' }} disabled={view === 'week' || view === 'day'}>Today</button>
              <button onClick={prevMonth} className='btn btn-primary' style={{ marginLeft: '5px', width: '110px', height: '37px' }} disabled={view === 'week' || view === 'day'}>Prev Month</button>
              <button onClick={nextMonth} className='btn btn-primary' style={{ marginLeft: '5px',  width: '120px', height: '37px' }} disabled={view === 'week' || view === 'day'}>Next Month</button>
              <button onClick={prevYear} className='btn btn-primary' style={{ marginLeft: '5px',  width: '100px', height: '37px' }} disabled={view === 'week' || view === 'day'}>Prev Year</button>
              <button onClick={nextYear} className='btn btn-primary' style={{ marginLeft: '5px',  width: '100px', height: '37px' }} disabled={view === 'week' || view === 'day'}>Next Year</button>
              <button onClick={() => handleViewChange('month')} className='btn btn-primary' style={{ marginLeft: '5px', width: '120px', height: '37px' }}>Month View</button>
              <button onClick={() => handleViewChange('week')} className='btn btn-primary' style={{ marginLeft: '5px', width: '110px', height: '37px' }}>Week View</button>
              <button onClick={() => handleViewChange('day')} className='btn btn-primary' style={{ marginLeft: '5px', width: '110px', height: '37px' }}>Day View</button>
            </div>
          </div>
          <div className="row mt-0 mb-5">
            {view === 'month' && <MonthView date={date} />}
            {view === 'week' && <WeekView date={date} />}
            {view === 'day' && <DayView date={date} />}
          </div>
      </div>
    </>
  );
}

export default UserCalendar;
