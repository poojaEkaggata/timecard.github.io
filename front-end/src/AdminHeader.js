import React from 'react';
import './css/AdminCSS.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import CreateUser from './CreateUser';

function AdminHeader({ selectedMenuItem, selectedSubMenuItem }) 
{
    return (
        <>
            <CreateUser selectedMenuItem={selectedMenuItem} selectedSubMenuItem={selectedSubMenuItem} />
        </>
    );
}

export default AdminHeader;
