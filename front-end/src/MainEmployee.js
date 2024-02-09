import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminCSS.css';
import UserDashboard from './User/UserDashboard.js';
import UserReporting from './User/UserReporting/UserReporting.js';
import UserMyTimes from './User/UserMyTimes.js';
import UserWeeklyHours from './User/UserWeeklyHours.js';
import UserCalendar from './User/UserCalendar.js';

function MainEmployee({ selectedMenuItem, selectedSubMenuItem }) 
{
  const [currentMenu, setCurrentMenu] = useState(selectedMenuItem);

  const [menuKey, setMenuKey] = useState(0);

  useEffect(() => 
  {
    if (selectedMenuItem === currentMenu) 
    {
      setMenuKey(prevKey => prevKey + 1); 
    } 
    else 
    {
      setCurrentMenu(selectedMenuItem);
    }
  }, [selectedMenuItem, currentMenu]);

  useEffect(() => 
  {
    if (selectedSubMenuItem) 
    {
      setCurrentMenu(null);
    }
  }, [selectedSubMenuItem]);

  const renderContent = () => 
  {
      switch (selectedMenuItem) 
      {
        case '':
          return <UserDashboard />;
        case 'Dashboard':
          return <UserDashboard />;
        case 'Reporting':
          return <UserReporting />;
        default:
          return getContentBySubMenu(selectedSubMenuItem);
      }
  };

  const getContentBySubMenu = () =>
  {
    switch (selectedSubMenuItem) 
    {
      case 'My Times':
        return <UserMyTimes />;
      case 'Weekly Hours':
        return <UserWeeklyHours />;
      case 'Calendar':
        return <UserCalendar />;
      default:
        return <UserDashboard />;
    }
  }

  return (
    <div key={menuKey} className="main-content">
      {renderContent()}
    </div>
  );
};

export default MainEmployee;

