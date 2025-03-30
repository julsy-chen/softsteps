import React from "react";

import { useRef } from "react";

import { PiDotsSixVerticalBold } from "react-icons/pi";

export function SubtaskDraggableHandle({ 
    highlightedSubtasksId, 
    handleDeleteSubtask, 
    isHighlighted, 
    handleFocusDraggableHandle, 
    handleBlurDraggableHandle, 
    subtaskId
}) {
    const MyDiv = useRef();

    function handleDrag() {
        console.log("handling drag")
    }

    const handleDeleteKey = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            handleDeleteSubtask(highlightedSubtasksId);
        }
        /*
        * what is this achieving?
        * when the delete key is pressed, all tasks that are highlighted should be deleted
        * the id should be gotten when the task is highlighted -  maybe in an array?
        * when the delete key is pressed, the delete task function can run with the argument being the id of the tasks
        */
    }

    return (
        <>
            <div>
                {/* <input type="checkbox" id="dragHandle" onClick={handleClickDraggableHandle}/> */}
                {/* <div class="taskSelector"/> */}
                <div
                    tabIndex={-1}
                    ref={MyDiv}
                    onFocus={handleFocusDraggableHandle}
                    onBlur={handleBlurDraggableHandle}
                    onKeyDown={(e) => handleDeleteKey(e)}
                > <PiDotsSixVerticalBold /> </div>
            </div>

        </>
    );
}