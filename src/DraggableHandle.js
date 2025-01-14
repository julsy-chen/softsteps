import React from "react";
import { useRef, useState } from "react";
/*
* maybe make this a checkbox so that when you click anywhere than the button it no longer highlights the current task
*/

export function DraggableHandle({isHighlighted, handleFocusDraggableHandle, handleBlurDraggableHandle}) {


    const MyDiv = useRef();

    function handleDrag() {
        console.log("handling drag")
    }
    
    return (
       <>
        <div>
            {/* <input type="checkbox" id="dragHandle" onClick={handleClickDraggableHandle}/> */}
            {/* <div class="taskSelector"/> */}
            <div tabIndex={-1} ref={MyDiv} onFocus={handleFocusDraggableHandle} onBlur={handleBlurDraggableHandle}> [click to highlight task]</div>
        </div>
        
       </> 
    );
}