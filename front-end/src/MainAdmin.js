import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminCSS.css';
import AdminDashboard from './AdminDashboard.js';
import AdminReporting from './AdminReporting/AdminReporting.js';
import AdminCustomers from './AdminCustomers/AdminCustomers.js';

function MainAdmin({ selectedMenuItem, selectedSubMenuItem }) 
{
  const [currentMenu, setCurrentMenu] = useState(selectedMenuItem);

  const [menuKey, setMenuKey] = useState(0);

  useEffect(() => 
  {
    //console.log('Selected Menu Item in MainAdmin:', selectedMenuItem);
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
    //console.log('Selected Sub Menu Item in MainAdmin:', selectedSubMenuItem);
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
          return <AdminDashboard />;
        case 'Dashboard':
          return <AdminDashboard />;
        case 'Reporting':
          return <AdminReporting />;
        default:
          return getContentBySubMenu(selectedSubMenuItem);
      }
  };

  const getContentBySubMenu = () =>
  {
    switch (selectedSubMenuItem) 
    {
      case 'My Times':
        return <div style={{ textAlign: 'center' }}>My Times Content</div>;
      case 'Weekly Hours':
        return <div style={{ textAlign: 'center' }}>Weekly Hours Content</div>;
      case 'Calendar':
        return <div style={{ textAlign: 'center' }}>Calendar Content</div>;
      case 'Export':
        return <div style={{ textAlign: 'center' }}>Export Content</div>;
      case 'All Times':
        return <div style={{ textAlign: 'center' }}>All Times Content</div>;
      case 'Working Times':
        return <div style={{ textAlign: 'center' }}>Working Times Content</div>;
      case 'Create Invoice':
        return <div style={{ textAlign: 'center' }}>Create Invoice Content</div>;
      case 'Invoice History':
        return <div style={{ textAlign: 'center' }}>Invoice History Content</div>;
      case 'Invoice Template':
        return <div style={{ textAlign: 'center' }}>Invoice Template Content</div>;
      case 'Customers':
        return <AdminCustomers />;
      case 'Projects':
        return <div style={{ textAlign: 'center' }}>Projects Content</div>;
      case 'Activities':
        return <div style={{ textAlign: 'center' }}>Activities Content</div>;
      case 'Tags':
        return <div style={{ textAlign: 'center' }}>Tags Content</div>;
      case 'Users':
        return <div style={{ textAlign: 'center' }}>Users Content</div>;
      case 'Roles':
        return <div style={{ textAlign: 'center' }}>Roles Content</div>;
      case 'Teams':
        return <div style={{ textAlign: 'center' }}>Teams Content</div>;
      case 'Plugins':
        return <div style={{ textAlign: 'center' }}>Plugins Content</div>;
      case 'Settings':
        return <div style={{ textAlign: 'center' }}>Settings Content</div>;
      default:
        return <AdminDashboard />;
    }
  }

  return (
    <div key={menuKey} className="main-content" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
      {renderContent()}
    </div>
  );
};

export default MainAdmin;
