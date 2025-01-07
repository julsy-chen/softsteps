import React from "react";

export function Checkbox({handleCheck}) { 

    return (
        <>
            <input type="checkbox" onClick={handleCheck} id="checkbox"></input>
        </>
    )
}