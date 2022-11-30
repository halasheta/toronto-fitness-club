import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/nav-bar"
import Home from "./pages/home";
import Studios from "./pages/studios";
import Classes from "./pages/classes";
import Subscriptions from "./pages/subscriptions";
import Profile from "./pages/profile";
import SignUp from './pages/signup';
import Login from './pages/login';

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Layout></Layout>}>
                  <Route index element={<Home/>}/>
                  <Route path="studios" element={<Studios/>}/>
                  <Route path="classes" element={<Classes/>}/>
                  <Route path="subscriptions" element={<Subscriptions/>}/>
                  <Route path="profile" element={<Profile/>}/>
                  <Route path="login" element={<Login/>}/>
                  <Route path="signup" element={<SignUp/>}/>
              </Route>
          </Routes>
      </BrowserRouter>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>

  );
}

export default App;
