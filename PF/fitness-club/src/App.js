import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navigation from "./pages/nav-bar/navigation"
import Home from "./pages/home/home";
import Studios from "./pages/studios/studios";
import Classes from "./pages/classes/classes";
import Subscriptions from "./pages/subscriptions/subscriptions";
import Profile from "./pages/profile/profile";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigation></Navigation>}>
                  <Route index element={<Home/>}/>
                  <Route path="studios" element={<Studios/>}/>
                  <Route path="classes" element={<Classes/>}/>
                  <Route path="subscriptions" element={<Subscriptions/>}/>
                  <Route path="profile" element={<Profile/>}/>
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
