import React from "react";

export function Checkbox({handleCheck}) { 

    return (
        <>
            <div>
                <input 
                    type="checkbox" 
                    onClick={handleCheck} 
                    id="checkbox"
                />
            </div>
        </>
    )
}