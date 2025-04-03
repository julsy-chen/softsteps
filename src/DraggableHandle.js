import React from "react";

import { useRef } from "react";

import { PiDotsSixVerticalBold } from "react-icons/pi";

export function DraggableHandle({ highlightedTaskId, deleteTask, isHighlighted, handleFocusDraggableHandle, taskId, isShiftPressedGlobal }) {
    const MyDiv = useRef();

    function handleDrag() {
        console.log("handling drag")
    }

    const handleDeleteKey = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            deleteTask(highlightedTaskId);
        }
        /*
        * what is this achieving?
        * when the delete key is pressed, all tasks that are highlighted should be deleted
        * the id should be gotten when the task is highlighted -  maybe in an array?
        * when the delete key is pressed, the delete task function can run with the argument being the id of the tasks
        */
    }

    /*
    * handle focus and blur used to determine the logic for draggable handles
    * when onFocus & shift is false, highlightedTaskId will be set to the task (empty and add)
    * when onFocus & shift is true, highlightedTaskId will push the taskId
    * when onBlur & shift is false, highlightedTaskId will empty
    */

    return (
        <>
            <div>
                <div
                    tabIndex={-1}
                    ref={MyDiv}
                    onFocus={handleFocusDraggableHandle}
                    onKeyDown={(e) => handleDeleteKey(e)}
                > <PiDotsSixVerticalBold /> </div>
            </div>

        </>
    );
}