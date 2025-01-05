import React from "react";

export function NewTaskButton({setTasksFn}) {
    function handleClick() {
        setTasksFn();
        /*
        * trigger setTasks to add new task component to the array tasks
        * the new task should be added underneath the task of which the add button was pressed from
        */
    }

    return (
        <>
            <button onClick={handleClick}>+</button>
        </>
    );
}