import React from "react";
import { useState, useEffect } from "react";

export function NewTaskButton({setTasksFn, setSubtasksFn}) {
    const [isShiftPressed, setShiftPressed] = useState(false)

    useEffect(() => {
        // code that we want to run
        const handleKeyDown = (e) => {
            if (e.key === "Shift") {
                setShiftPressed(true);
            }
        }

        const handleKeyUp = (e) => {
            if (e.key === "Shift") {
                setShiftPressed(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        //return function
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        }

    }, []); // dependency array

    function handleClick() {
        if (isShiftPressed) {
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