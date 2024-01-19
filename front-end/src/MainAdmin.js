import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminCSS.css';
import AdminDashboard from './AdminDashboard.js';
import AdminReporting from './AdminReporting/AdminReporting.js';
import AdminCustomers from './AdminCustomers/AdminCustomers.js';
import AdminProjects from './AdminProjects/AdminProjects.js';
import AdminActivities from './AdminActivities/AdminActivities.js';
import AdminTags from './AdminTags/AdminTags.js';
import AdminUsers from './AdminUsers/AdminUsers.js';
import AdminRoles from './AdminRoles/AdminRoles.js';
import AdminTeams from './AdminTeams/AdminTeams.js';
import AdminPlugins from './AdminPlugins/AdminPlugins.js';
import AdminSettings from './AdminSettings/AdminSettings.js';
import AdminMyTimes from './AdminMyTimes/AdminMyTimes.js';
import AdminWeeklyHours from './AdminWeeklyHours/AdminWeeklyHours.js';
import AdminCalendar from './AdminCalendar/AdminCalendar.js';
import AdminExports from './AdminExports/AdminExports.js';
import AdminAllTimes from './AdminAllTimes/AdminAllTimes.js';
import AdminWorkingTimes from './AdminWorkingTimes/AdminWorkingTimes.js';
import AdminCreateInvoice from './AdminCreateInvoice/AdminCreateInvoice.js';
import AdminInvoiceHistory from './AdminInvoiceHistory/AdminInvoiceHistory.js';
import AdminInvoiceTemplate from './AdminInvoiceTemplate/AdminInvoiceTemplate.js';

function MainAdmin({ selectedMenuItem, selectedSubMenuItem }) 
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
        return <AdminMyTimes />;
      case 'Weekly Hours':
        return <AdminWeeklyHours />;
      case 'Calendar':
        return <AdminCalendar />;
      case 'Export':
        return <AdminExports />;
      case 'All Times':
        return <AdminAllTimes />;
      case 'Working Times':
        return <AdminWorkingTimes />;
      case 'Create Invoice':
        return <AdminCreateInvoice />;
      case 'Invoice History':
        return <AdminInvoiceHistory />;
      case 'Invoice Template':
        return <AdminInvoiceTemplate />;
      case 'Customers':
        return <AdminCustomers />;
      case 'Projects':
        return <AdminProjects />;
      case 'Activities':
        return <AdminActivities />;
      case 'Tags':
        return <AdminTags />;
      case 'Users':
        return <AdminUsers />;
      case 'Roles':
        return <AdminRoles />;
      case 'Teams':
        return <AdminTeams />;
      case 'Plugins':
        return <AdminPlugins />;
      case 'Settings':
        return <AdminSettings />;
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
