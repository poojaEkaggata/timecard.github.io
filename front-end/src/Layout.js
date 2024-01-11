import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainEmployee from './MainEmployee';
import Footer from './Footer';

const Layout = () => 
{
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [selectedSubMenuItem, setSelectedSubMenuItem] = useState(null);

  useEffect(() => 
  {
    //console.log('Selected Menu Item in User Layout:', selectedMenuItem);
  }, [selectedMenuItem]);

  useEffect(() => 
  {
    //console.log('Selected Sub Menu Item in User Layout:', selectedSubMenuItem);
  }, [selectedSubMenuItem]);

  const handleItemClick = (label) => 
  {
    setSelectedMenuItem(label);
  };

  const handleSubItemClick = (label) => 
  {
    setSelectedSubMenuItem(label);
  };

  return (
    <>
        <div className="layout">
          <Header selectedMenuItem={selectedMenuItem} selectedSubMenuItem={selectedSubMenuItem} />
          <Sidebar handleMenuClick={handleItemClick} handleNewSubMenuClick={handleSubItemClick} />
          <div className="content">
            <MainEmployee selectedMenuItem={selectedMenuItem} selectedSubMenuItem={selectedSubMenuItem} />
          </div>
          <Footer />
        </div>
    </>
  );
};

export default Layout;
