import React from "react";

export function ExpandButton({handleToggle}) {
    return (
        <>
            <button onClick={handleToggle}>Click to Expand</button>
        </>
    )
}