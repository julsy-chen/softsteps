import React from "react";
import { useState } from "react";

export function NewTaskButton({setTasksFn, setSubtasksFn, isShiftPressedGlobal}) {

    function handleClick() {
        if (isShiftPressedGlobal) {
            setSubtasksFn("")
        } else {
            setTasksFn("");
        }
    }

    return (
        <>
            <button 
                onClick={handleClick}
            >+</button>
        </>
    );
}