import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import EmployeeLogin from "./EmployeeLogin";
import EmployeeHome from "./EmployeeHome";

function App() 
{
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<EmployeeLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user_home" element={<EmployeeHome />} />
          <Route path="*" element={<EmployeeLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
