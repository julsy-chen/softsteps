import React from "react";

import { useRef } from "react";

import { PiDotsSixVerticalBold } from "react-icons/pi";

export function SubtaskDraggableHandle({ 
    highlightedSubtaskId, 
    handleDeleteSubtask, 
    handleFocusDraggableHandle
}) {
    const MyDiv = useRef();

    // function handleDrag() {
    //     console.log("handling drag")
    // }

    const handleDeleteKey = (e) => {
        if (e.key === "Delete" || e.key === "Backspace") {
            handleDeleteSubtask(highlightedSubtaskId); // when the delete key is pressed, all tasks that are highlighted should be deleted
        }
    }

    return (
        <>
            <div id="drag-handle"
                tabIndex={-1}
                ref={MyDiv}
                onFocus={handleFocusDraggableHandle}
                onKeyDown={(e) => handleDeleteKey(e)}
            > <PiDotsSixVerticalBold /> 
            </div>

        </>
    );
}