import React from "react";

import { PiDotsSixVerticalBold } from "react-icons/pi";
import { useRef} from "react";
/*
* maybe make this a checkbox so that when you click anywhere than the button it no longer highlights the current task
*/

export function DraggableHandle({ highlightedTaskId, deleteTask, isHighlighted, handleFocusDraggableHandle, handleBlurDraggableHandle, taskId }) {
    const MyDiv = useRef();

    function handleDrag() {
        console.log("handling drag")
    }

    const handleDeleteKey = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            deleteTask(highlightedTaskId[0]);
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