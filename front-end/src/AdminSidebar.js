import React, { useState } from 'react';
import './css/AdminCSS.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../src/images/logo-ekaggata.jpg';

const AdminSidebar = ({ handleMenuClick, handleNewSubMenuClick }) => 
{
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleSubMenuClick = (index) => 
  {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const sidebarData = 
  [
    {
        label: 'Dashboard',
        icon: 'fas fa-home',
        subItems: [],
        id: 0
    },
    {
        label: 'Time Tracking',
        icon: 'fas fa-clock',
        subItems: 
        [
            { id: 1, label: 'My Times', icon: 'far fa-clock' },
            { id: 2, label: 'Weekly Hours', icon: 'far fa-clock' },
            { id: 3, label: 'Calendar', icon: 'far fa-calendar' },
            { id: 4, label: 'Export', icon: 'far fa-file-export' },
            { id: 5, label: 'All Times', icon: 'far fa-clock' }
        ],
        id: 1
    },
    {
        label: 'Employment Contract',
        icon: 'fas fa-user',
        subItems: 
        [
            { label: 'Working Times', icon: 'far fa-clock' }
        ],
        id: 2
    },
    {
        label: 'Reporting',
        icon: 'fas fa-list-alt',
        subItems: [],
        id: 3
    },
    {
        label: 'Invoices',
        icon: 'fas fa-file-invoice',
        subItems: 
        [
            { label: 'Create Invoice', icon: 'far fa-clock' },
            { label: 'Invoice History', icon: 'far fa-clock' },
            { label: 'Invoice Template', icon: 'far fa-calendar' }
        ],
        id: 4
    },
    {
        label: 'Administration',
        icon: 'fas fa-user',
        subItems: 
        [
            { label: 'Customers', icon: 'far fa-clock' },
            { label: 'Projects', icon: 'far fa-clock' },
            { label: 'Activities', icon: 'far fa-calendar' },
            { label: 'Tags', icon: 'far fa-calendar' }
        ],
        id: 5
    },
    {
        label: 'System',
        icon: 'fas fa-cog',
        subItems: 
        [
            { label: 'Users', icon: 'far fa-clock' },
            { label: 'Roles', icon: 'far fa-clock' },
            { label: 'Teams', icon: 'far fa-calendar' },
            { label: 'Plugins', icon: 'far fa-calendar' },
            { label: 'Settings', icon: 'far fa-calendar' }
        ],
        id: 6
    }
  ];

  const handleClick = (label, event) => 
  {
    event.preventDefault()
    handleMenuClick(label);
  };

  const newHandleClick = (label, event) =>
  {
    event.preventDefault()
    handleNewSubMenuClick(label);
  }

  return (
    <>
        <div className="sidebar">
            <div className="sidebar-header">
                <img src={Logo} alt="Ekaggata" title="Ekaggata" className="sidebar-header-image" />
            </div>
            <ul className="sidebar-menu">
                {sidebarData.map((menuItem)=> 
                    (
                        <li className="sidebar-menu-item" 
                            key={menuItem.id}
                            onClick={(e) => handleClick(menuItem.label, e)}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <a 
                                href={menuItem.subItems.length > 0 ? '#' : `/${menuItem.label.toLowerCase().replace(/\s/g, '-')}`} 
                                onClick={()=>handleSubMenuClick(menuItem.id)}
                            >
                                <i className={menuItem.icon}></i>&nbsp;&nbsp;{menuItem.label}{' '}
                                {
                                    menuItem.subItems.length > 0 && 
                                    (
                                        <i className={`margin-left-for-arrow fas fa-chevron-${activeSubMenu === menuItem.id ? 'up' : 'down'}`}></i>
                                    )
                                }
                            </a>
                            {
                                menuItem.subItems.length > 0 && activeSubMenu === menuItem.id &&
                                <ul className="submenu-items">
                                    {menuItem.subItems.map((subItem, subIndex) => 
                                    (
                                        <li 
                                            className="sidebar-menu-item" 
                                            key={subIndex} 
                                            onClick={(e) => newHandleClick(subItem.label, e)}
                                            onContextMenu={(e) => e.preventDefault()}
                                        >
                                            <a href={`/${subItem.label.toLowerCase().replace(/\s/g, '-')}`}>
                                                <i className={subItem.icon}></i>&nbsp;{subItem.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </li>
                    )
                )}
            </ul>
        </div>
    </>
  );
}

export default AdminSidebar;
