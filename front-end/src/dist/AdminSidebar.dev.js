"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

require("./css/AdminCSS.css");

require("bootstrap/dist/css/bootstrap.min.css");

var _eka_lgoRemovebgPreview = _interopRequireDefault(require("../src/images/eka_lgo-removebg-preview.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var AdminSidebar = function AdminSidebar() {
  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      activeSubMenu = _useState2[0],
      setActiveSubMenu = _useState2[1];

  var handleSubMenuClick = function handleSubMenuClick(index) {
    setActiveSubMenu(activeSubMenu === index ? null : index);
    /* const newActiveSubMenus = [...activeSubMenu];
    newActiveSubMenus[index] = !newActiveSubMenus[index];
    setActiveSubMenu(newActiveSubMenus); */
  };

  var handleSubMenuItemClick = function handleSubMenuItemClick(event) {
    event.stopPropagation(); // Prevents the click event from reaching the parent elements
  };

  var sidebarData = [{
    title: 'Dashboard',
    icon: 'fas fa-home',
    subItems: [],
    id: 0
  }, {
    title: 'Time Tracking',
    icon: 'fas fa-clock',
    subItems: [{
      label: 'My Times',
      icon: 'far fa-clock'
    }, {
      label: 'Weekly Hours',
      icon: 'far fa-clock'
    }, {
      label: 'Calendar',
      icon: 'far fa-calendar'
    }, {
      label: 'Export',
      icon: 'far fa-file-export'
    }, {
      label: 'All Times',
      icon: 'far fa-clock'
    }],
    id: 1
  }, {
    title: 'Employment Contract',
    icon: 'fas fa-user',
    subItems: [{
      label: 'Working Times',
      icon: 'far fa-clock'
    }],
    id: 2
  }, {
    title: 'Reporting',
    icon: 'fas fa-list-alt',
    subItems: [],
    id: 3
  }, {
    title: 'Invoices',
    icon: 'fas fa-file-invoice',
    subItems: [{
      label: 'Create Invoice',
      icon: 'far fa-clock'
    }, {
      label: 'Invoice History',
      icon: 'far fa-clock'
    }, {
      label: 'Invoice Template',
      icon: 'far fa-calendar'
    }],
    id: 4
  }, {
    title: 'Administration',
    icon: 'fas fa-user',
    subItems: [{
      label: 'Customers',
      icon: 'far fa-clock'
    }, {
      label: 'Projects',
      icon: 'far fa-clock'
    }, {
      label: 'Activities',
      icon: 'far fa-calendar'
    }, {
      label: 'Tags',
      icon: 'far fa-calendar'
    }],
    id: 5
  }, {
    title: 'System',
    icon: 'fas fa-cog',
    subItems: [{
      label: 'Users',
      icon: 'far fa-clock'
    }, {
      label: 'Roles',
      icon: 'far fa-clock'
    }, {
      label: 'Teams',
      icon: 'far fa-calendar'
    }, {
      label: 'Plugins',
      icon: 'far fa-calendar'
    }, {
      label: 'Settings',
      icon: 'far fa-calendar'
    }],
    id: 6
  }];
  return {
    /* <div className="sidebar">
       <div className="sidebar-header">
           <img src={Logo} alt="Ekaggata" title="Ekaggata" className="sidebar-header-image" />
       </div>
       <ul className="sidebar-menu">
           {sidebarData.map((menuItem) => 
               (
                   <li className="sidebar-menu-item" key={menuItem.id}>
                       <a 
                           //href="#"
                           //href={`/${menuItem.title.toLowerCase().replace(/\s/g, '-')}`} 
                           //href={`/${menuItem.title.toLowerCase().replace(/\s/g, '-')}`}
                           //onClick={()=>handleSubMenuClick(menuItem.id)}
                           //onClick={()=>!menuItem.subItems.length && handleSubMenuClick(menuItem.id)}
                           href={`/${menuItem.title.toLowerCase().replace(/\s/g, '-')}`}
                           onClick={() => handleSubMenuClick(menuItem.id)}
                       >
                           <i className={menuItem.icon}></i>&nbsp;&nbsp;{menuItem.title}{' '}
                           {menuItem.subItems.length > 0 && 
                           (
                               <i className={`fas fa-chevron-${activeSubMenu === menuItem.id ? 'up' : 'down'}`}></i>
                           )}
                       </a>
                       {menuItem.subItems.length > 0 && activeSubMenu === menuItem.id && (
                       <ul className="submenu-items">
                           {menuItem.subItems.map((subItem, subIndex) => (
                           <li key={subIndex}>
                               <a href={`/${subItem.label.toLowerCase().replace(/\s/g, '-')}`} onClick={handleSubMenuItemClick}>
                               <i className={subItem.icon}></i>&nbsp;{subItem.label}
                               </a>
                           </li>
                           ))}
                       </ul>
                       )}
                   </li>
               ))}
       </ul>
    </div> */
  };
};

var _default = AdminSidebar;
exports["default"] = _default;