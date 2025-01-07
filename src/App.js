import React from "react";
import { useState } from "react";
import { hot } from 'react-hot-loader/root';

import { Page } from "./Page";
import { MenuButton } from "./MenuButton";
import { NavBar } from "./NavBar";

export default function App() {
  const [showNavBar, setShowNavBar] = useState(false);

  function handleClick() {
    setShowNavBar(!showNavBar);
  }

  return (
    <>
      <MenuButton handleClick={handleClick}/>
      {showNavBar && <NavBar showNavBar={showNavBar}/>}
      <Page />
    </>
    /*
    LISTEN TO IO FEEDBACK TONIGHT
    */
    
  );
}
