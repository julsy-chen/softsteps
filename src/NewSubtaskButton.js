import React from "react";

export function NewSubtaskButton({setSubtasksFn}) {
    function handleClick() {
        setSubtasksFn("");
    }

    return (
        <>
            <button onClick={handleClick}>+</button>
        </>
    );
}