import React from "react";

export function Checkbox({
    setIsTaskDone,
    toggleTaskCheckbox,
    taskId,
    checkboxState
}) { 

function handleCheck() {
    setIsTaskDone(prev => {
        toggleTaskCheckbox(taskId, prev); // update in Firestore and local state
        return !prev;
    });
}

    return (
        <>
            <div>
                <input 
                    type="checkbox" 
                    onClick={handleCheck} 
                    defaultChecked={checkboxState}
                    id="checkbox"
                />
            </div>
        </>
    )
}