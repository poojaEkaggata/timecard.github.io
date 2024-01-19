import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Validation from './LoginValidation';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'font-awesome/css/font-awesome.min.css';

function Login()
{
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
    const [values, setValues] = useState({
        email: 'admin@admin.com',
        password: ''
    });
    const [errors, setErrors] = useState({});
    function handleInput(event)
    {
        event.preventDefault();
        setValues(prev=>({...prev,[event.target.name]:[event.target.value]}));
    }
    axios.defaults.withCredentials=true;
    function handleSubmit(event)
    {
        event.preventDefault();
        setErrors(Validation(values));
        /* if(errors.email === "" && errors.password === "") { */
            axios.post(
                'http://localhost:8081/login', values
            ).then(res => 
            {
                if(res.data==="Success")
                {
                    navigate('/home');
                    Swal.fire('You have logged in successfully.');
                }
                else
                {
                    navigate('/');
                    Swal.fire('No Admin User Existed! \n Please check your password.');
                }
            })
            .catch(err=>console.log(err));
        /* } */
    }
    let navigate = useNavigate(); 
    function NavigateToMain(e)
    { 
      e.preventDefault();
      let path=`/`; 
      navigate(path);
    }
  return (
   <div>
   <div className="d-flex justify-content-center align-items-center bg-black vh-100">
   <div className="bg-white p-5 rounded w-25 h-auto">
        <form onSubmit={handleSubmit}>
            <p className="text-align-center d-flex justify-content-center ml-auto mr-auto fw-bold mb-3 mt-0">LOG IN</p>
            <div className="mb-3 ml-3 mr-3">
                <label htmlFor="email" className="mb-2"><strong>User Name</strong></label>
                <input type="email" placeholder="Enter User Name" className="form-control rounded-0" name="email" onChange={handleInput} value="admin@admin.com" disabled />
                {errors.email && <span className="text-danger">{errors.email}</span>}
            </div>
            <div className="mb-5 ml-3 mr-3" style={{ width: 'auto', position: 'relative' }}>
                <label htmlFor="password" className="mb-2"><strong>Password</strong></label>
                <input type={passwordType} onChange={handleInput} name="password" className="form-control rounded-0" placeholder="Enter Password" />
                <div style={{ position: 'fixed', top: '48%', borderRadius: '0px', left: '56.8%',right: 'auto', zIndex: '1', border: 'none', height: '30px', cursor: 'pointer', color: 'white', backgroundColor: 'transparent' }}>
                    <button className="btn btn-outline-secondary" style={{ position: 'fixed', borderRadius: '0px', border: 'none' }} onClick={togglePassword}>
                        {passwordType==="password"?<i className="fa fa-eye-slash"></i>:<i className="fa fa-eye"></i>}
                    </button>
                </div>
                {errors.password && <span className="text-danger">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary w-100 d-flex justify-content-center ml-5 mr-5 mb-3">
                <strong>LOG IN</strong>
            </button>
            <Link to="/" className="btn btn-danger w-100 d-flex justify-content-center ml-3 mr-3 mb-3 text-decoration-none" onClick={NavigateToMain}>
                <strong>CANCEL</strong>
            </Link>
        </form>
    </div>
    </div>
   </div>
  )
};

export default Login;
