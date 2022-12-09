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
import StudiosAPIContext, { useStudioAPIContext } from "./contexts/StudiosAPIContext";
import CreateStudio from "./components/Studio/CreateStudio";
import UserAPIContext, {useUserAPIContext} from "./contexts/UserAPIContext";
import StudioProfile from "./components/Studio/StudioProfile";
import Subscription from "./components/Subscription";
import EditStudio from "./components/Studio/EditStudio";
import StudioMap from "./components/Studio/StudioMap";
import CreateClass from "./components/Class/CreateClass";
import Payments from "./pages/payments";
import ClassesAPIContext, {useClassesAPIContext} from "./contexts/ClassesAPIContext";
import ClassSchedule from "./components/Class/ClassSchedule";
import EditClass from "./components/Class/EditClass";
import ClassTypePage from "./pages/ClassTypePage";

function App() {
    const studios = (
        <StudiosAPIContext.Provider value={ useStudioAPIContext() }>
            <Studios/>
        </StudiosAPIContext.Provider>
    )

    const classes = (
        <ClassesAPIContext.Provider value={ useClassesAPIContext() }>
            <Classes/>
        </ClassesAPIContext.Provider>
    )

    const classTypes = (
        <ClassesAPIContext.Provider value={ useClassesAPIContext() }>
            <ClassTypePage/>
        </ClassesAPIContext.Provider>
    )

  return (
      <UserAPIContext.Provider value={ useUserAPIContext() }>
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<Layout/>}>
                      <Route index element={<ClassSchedule/>}/>

                      {/* studios paths */}
                      <Route path="studios/" element={ studios }/>
                      <Route path="studios/add/" element={<CreateStudio/>}/>
                      <Route path="studios/:id/profile/" element={<StudioProfile/>}/>
                      <Route path="studios/:id/edit/" element={<EditStudio/>}/>
                      <Route path="studios/map/" element={<StudioMap/>}/>



                      {/* classes paths */}
                      <Route path="classes/" element={ classes }/>
                      <Route path="studios/:id/classes/add/" element={<CreateClass/>}/>
                      <Route path="classes/schedule/" element={<ClassSchedule/>}/>
                      <Route path="classes/:id/edit/" element={<EditClass/>}/>
                      <Route path="classes/types/" element={ classTypes }/>

                      {/* subscriptions paths */}
                      <Route path="subscriptions/" element={<Subscriptions/>}/>
                      <Route path="subscriptions/add" element={<Subscription/>}/>

                      {/* accounts paths */}
                      <Route path="profile/" element={<Profile/>}/>
                      <Route path="login/" element={<Login/>}/>
                      <Route path="signup/" element={<SignUp/>}/>

                      {/* payments paths */}
                      <Route path="payments/" element={<Payments/>}/>
                  </Route>
              </Routes>
          </BrowserRouter>
      </UserAPIContext.Provider>
  );
}

export default App;
