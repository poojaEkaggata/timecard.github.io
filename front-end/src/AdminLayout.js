import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import MainAdmin from './MainAdmin';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/AdminCSS.css';

const AdminLayout = () => 
{
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [selectedSubMenuItem, setSelectedSubMenuItem] = useState(null);

  useEffect(() => 
  {
    //console.log('Selected Menu Item:', selectedMenuItem);
  }, [selectedMenuItem]);

  useEffect(() => 
  {
    //console.log('Selected Sub Menu Item:', selectedSubMenuItem);
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
          <AdminHeader selectedMenuItem={selectedMenuItem} selectedSubMenuItem={selectedSubMenuItem} />
          <AdminSidebar handleMenuClick={handleItemClick} handleNewSubMenuClick={handleSubItemClick} />
          <div className="content">
            <MainAdmin selectedMenuItem={selectedMenuItem} selectedSubMenuItem={selectedSubMenuItem} />
          </div>
          <Footer />
        </div>
    </>
  );
};

export default AdminLayout;