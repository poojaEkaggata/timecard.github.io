import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Validation from './LoginValidation';
import axios from 'axios';
import Swal from 'sweetalert2';

function EmployeeLogin()
{
  axios.defaults.withCredentials=true;
  const[passwordType,setPasswordType]=useState("password");
  function togglePassword(e)
  {
    e.preventDefault();
    if(passwordType==="password")
    {
      setPasswordType("text");
      return;
    }
    else
    {
      setPasswordType("password");
    }
  }

  const initialFormValues={email:'',password:''};
  const[values,setValues]=useState(initialFormValues);
  const[errors,setErrors]=useState({});
  function handleInput(event)
  {
    event.preventDefault();
    const {name,value}=event.target;
    setValues((prev)=>({...prev,[name]:value}));
  }
  function handleClearFieldValues()
  {
    setValues(initialFormValues);
    if(emailInputRef.current) 
    {
      emailInputRef.current.value = '';
    }
    if(passwordInputRef.current) 
    {
      passwordInputRef.current.value = '';
    }
  }

  const[loggedInStatus,setLoggedInStatus]=useState("");

  function handleSubmit(event)
  {
      event.preventDefault();
      try 
      {
        setErrors(Validation(values));
        axios.post('http://localhost:8081/login',values).then(res => 
        {
          if(res.status === 200 && res.data.message === "Login successful") 
          {
            const userEmail = res.data.user.email;
            if(userEmail === "admin@admin.com") 
            {
              navigate('/home');
            } 
            else 
            {
              navigate('/user_home');
            }
            Swal.fire("You have logged in successfully.");
        } 
        else if (res.status === 401 && res.data.message === "Incorrect password") 
        {
          Swal.fire("Please type correct Password.");
          handleClearFieldValues();
        } 
        else 
        {
          Swal.fire("Please type right credentials.");
          handleClearFieldValues();
        }
      })
      .catch(err => 
      {
        navigate('/user_login');
        Swal.fire("Please Type All Credentials.");
        handleClearFieldValues();
      });
    } 
    catch(error) 
    {
      navigate('/user_login');
      Swal.fire("Please type correct credentials!");
      handleClearFieldValues();
    }
  }
  
  useEffect(()=>
  {
    axios.get('http://localhost:8081/login').then((response)=>
    {
      if(response.data.loggedIn===true)
      {
        setLoggedInStatus(response.data.user[0].username);
      }
      else
      {
        setLoggedInStatus();
      }
    })
  },[loggedInStatus]);

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  let navigate = useNavigate(); 

  function NavigateToMain(event)
  { 
    event.preventDefault();
    let path=`/`; 
    navigate(path);
    if(emailInputRef.current) 
    {
      emailInputRef.current.value = '';
    }
    if(passwordInputRef.current) 
    {
      passwordInputRef.current.value = '';
    }
  }

  return (
   <div>
   <div className="d-flex align-items-center vh-100 bg-payroll" style={{ /* backgroundColor: 'rgb(37, 150, 190)' */ }}>
   <div className="align-items-center ml-0 mr-0 bg-white p-5 rounded w-30 h-auto m-5">
        <form action="" onSubmit={handleSubmit}>
            <div className="row">
              <p className="text-align-center d-flex justify-content-center ml-auto mr-auto fw-bold mb-4 mt-0">Ekaggata Timesheet Management System</p>
            </div>
            <div className="row">
              <p className="text-align-center d-flex justify-content-center ml-auto mr-auto fw-bold mb-3 mt-0">LOG IN</p>
            </div>
            <div className="row mb-4 ml-3 mr-3">
                {/* <label htmlFor="email" className="mb-2"><strong>User Name</strong></label> */}
                <input type="email" placeholder="Enter User Name" className="form-control rounded-0" name="email" onChange={handleInput} ref={emailInputRef} />
                {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>
            <div className="row mb-5 ml-3 mr-3">
                <input type={passwordType} placeholder="Enter Password" className="form-control rounded-0" name="password" onChange={handleInput} ref={passwordInputRef} />
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', left: '83.6%', top: '-19px', borderRadius: '0px', right: '0px', zIndex: '1', border: 'none', height: 'auto', cursor: 'pointer', color: 'white', backgroundColor: 'transparent' }}>
                  <button className="btn btn-outline-secondary" style={{ position: 'fixed', borderRadius: '0px', border: 'none' }} onClick={togglePassword}>
                    {passwordType==="password"?<i className="fa fa-eye-slash"></i>:<i className="fa fa-eye"></i>}
                  </button>
                </div>
                {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>
            <div className="row mb-0 d-flex justify-content-center ml-auto mr-auto">
              <button type="submit" className="btn btn-primary w-auto">
                <strong>LOG IN</strong>
              </button>
              <button className="btn btn-danger w-auto" onClick={NavigateToMain} style={{ marginLeft: '40px' }}>
                <strong>CANCEL</strong>
              </button>
            </div>
        </form>
    </div>
    </div>
   </div>
  )
};

export default EmployeeLogin;
