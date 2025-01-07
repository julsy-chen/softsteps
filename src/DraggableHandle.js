import React from "react";
/*
* maybe make this a checkbox so that when you click anywhere than the button it no longer highlights the current task
*/

export function DraggableHandle() {
    function handleClick() {
        console.log("handling click")
    }

    function handleDrag() {
        console.log("handling drag")
    }
    
    return (
       <>
        <button>^</button>
       </> 
    );
}