import React, { useState } from 'react';
import './css/Custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from '../src/images/logo-ekaggata.jpg';

const Sidebar = ({ handleMenuClick, handleNewSubMenuClick }) => 
{
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleSubMenuClick = (index) => 
  {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  /* const handleSubMenuItemClick = (event) => 
  {
    event.stopPropagation();
  }; */

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
            { label: 'My Times', icon: 'far fa-clock' },
            { label: 'Weekly Hours', icon: 'far fa-clock' },
            { label: 'Calendar', icon: 'far fa-calendar' }
        ],
        id: 1
    },
    {
        label: 'Reporting',
        icon: 'fas fa-list-alt',
        subItems: [],
        id: 2
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
                        <li className="sidebar-menu-item" key={menuItem.id} onClick={(e) => handleClick(menuItem.label, e)} onContextMenu={(e) => e.preventDefault()}>
                            <a href={menuItem.subItems.length > 0 ? '#' : `/${menuItem.label.toLowerCase().replace(/\s/g, '-')}`} onClick={()=>handleSubMenuClick(menuItem.id)}>
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
                                        <li key={subIndex} onClick={(e) => newHandleClick(subItem.label, e)} onContextMenu={(e) => e.preventDefault()}>
                                            <a 
                                                href={`/${subItem.label.toLowerCase().replace(/\s/g, '-')}`} 
                                                //onClick={handleSubMenuItemClick}
                                            >
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

export default Sidebar;
