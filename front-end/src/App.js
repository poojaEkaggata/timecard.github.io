import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Main from "./Main";
//import Login from "./Login";
import Home from "./Home";
import EmployeeLogin from "./EmployeeLogin";
import EmployeeHome from "./EmployeeHome";
//import MainAdmin from './MainAdmin';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Layout />}> */}
            {/* <Route index path="/" element={<Main />} /> */}
            <Route index path="/" element={<EmployeeLogin />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/home" element={<Home />} />
            <Route path="/user_login" element={<EmployeeLogin />} />
            <Route path="/user_home" element={<EmployeeHome />} />
            {/* <Route path="/dashboard" element={<MainAdmin />} /> */}
            {/* <Route path="*" element={<NoPage />} /> */}
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
