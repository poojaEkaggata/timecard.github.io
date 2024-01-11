import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminCSS.css';

function MainEmployee({ selectedMenuItem, selectedSubMenuItem }) 
{
  const [currentMenu, setCurrentMenu] = useState(selectedMenuItem);

  const [menuKey, setMenuKey] = useState(0);

  useEffect(() => 
  {
    //console.log('Selected Menu Item in Main Employee:', selectedMenuItem);
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
    //console.log('Selected Sub Menu Item in Main Employee:', selectedSubMenuItem);
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
          return <div style={{ textAlign: 'center' }}>User Dashboard Content</div>;
        case 'Dashboard':
          return <div style={{ textAlign: 'center' }}>User Dashboard Content</div>;
        case 'Reporting':
          return <div style={{ textAlign: 'center' }}>User Reporting Content</div>;
        default:
          return getContentBySubMenu(selectedSubMenuItem);
      }
  };

  const getContentBySubMenu = () =>
  {
    switch (selectedSubMenuItem) 
    {
      case 'My Times':
        return <div style={{ textAlign: 'center' }}>User My Times Content</div>;
      case 'Weekly Hours':
        return <div style={{ textAlign: 'center' }}>User Weekly Hours Content</div>;
      case 'Calendar':
        return <div style={{ textAlign: 'center' }}>User Calendar Content</div>;
      default:
        return <div style={{ textAlign: 'center' }}>User Dashboard Content</div>;
    }
  }

  return (
    <div key={menuKey} className="main-content">
      {renderContent()}
    </div>
  );
};

export default MainEmployee;

