import React from "react";
import { useNavigate } from "react-router-dom";

function Main()
{
  let navigate = useNavigate(); 
  function NavigateToAdminLogin()
  { 
    let path=`/login`; 
    navigate(path);
  }
  function NavigateToEmployeeLogin()
  {
    let path=`/login`; 
    navigate(path);
  }
  return (
   <>
   <div className="d-flex justify-content-center align-items-center bg-black vh-100" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
        <div className="bg-white p-5 rounded w-30 h-auto">
            <p className="text-align-center d-flex justify-content-center ml-auto mr-auto fw-bold mb-3 mt-0">Ekaggata Timesheet Management System</p>
            <button className="btn btn-success w-100 d-flex justify-content-center ml-3 mr-3 mb-3 bg-black" onClick={NavigateToAdminLogin}>
                <strong>ADMIN</strong>
            </button>
            <button className="btn btn-default btn-success border w-100 d-flex justify-content-center ml-3 mr-3 mb-3 bg-black" onClick={NavigateToEmployeeLogin}>
                <strong>EMPLOYEE</strong>
            </button>
        </div>
    </div>
   </>
  )
};

export default Main;
