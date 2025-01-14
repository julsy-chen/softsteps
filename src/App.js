import React from "react";
import { useState } from "react";
import { hot } from 'react-hot-loader/root';

import { Page } from "./Page";
import { MenuButton } from "./MenuButton";
import { NavBar } from "./NavBar";
import { Screen } from "./Screen";

export default function App() {
  const [showNavBar, setShowNavBar] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selecBbox, setSelectBox] = useState(false);

  function selectBox() {
    set
  }

  function handleToggle() {
    setShowNavBar(!showNavBar);
  }

  function handleClickApp() {
    setIsSelected(false)
    console.log(false)
  }

  function handleClickDraggableHandle() {
    setIsSelected(true)
    console.log(true)
  }

  return (
    <>      
      {/* <Screen /> */}
      <MenuButton handleToggle={handleToggle} />
      {showNavBar && <NavBar showNavBar={showNavBar} />}
      <Page onClick={handleClickApp} isSelected={isSelected} handleClickDraggableHandle={handleClickDraggableHandle} />
      <input type="checkbox" id="test"/>
      console.log()
    </>
    /*
    LISTEN TO IO FEEDBACK TONIGHT
    */
    
  );
}
