import React from "react";
import { useState } from "react";

import { Page } from "./Page";
import { ExpandButton } from "./ExpandButton";
import { NavBar } from "./NavBar";

export default function App() {
  const [showNavBar, setShowNavBar] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  function handleToggle() {
    setShowNavBar(!showNavBar);
  }

  function handleClickApp() {
    setIsSelected(false)

  }

  function handleClickDraggableHandle() {
    setIsSelected(true)
    console.log(true)
  }

  return (
    <>
      {/* <Screen /> */}
      <ExpandButton handleToggle={handleToggle} />
      {showNavBar && <NavBar showNavBar={showNavBar} />}
      <Page 
        onClick={handleClickApp} 
        isSelected={isSelected} 
        handleClickDraggableHandle={handleClickDraggableHandle} 
      />
      <input type="checkbox" id="test"/>
    </>
  );
}
