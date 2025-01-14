import React from "react";
import { useState } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";

export function Task({key, task, setTasksFn, isSelected, handleClickDraggableHandle}) {
    const [isTaskDone, setIsTaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    function handleFocusDraggableHandle() {
        setIsHighlighted(true);
        console.log("HEELLOOOOOO")
    }

    function handleBlurDraggableHandle() {
        setIsHighlighted(false)
        console.log("HOLY HSIT DOES THIS WORK")
    }

    function handleCheck() {
        setIsTaskDone(!isTaskDone);
    }

    function handleClick() {
        setIsSelected(!isSelected);
        console.log(isSelected)
    }

    return (
        <>
            <div className="checklist-task" id={isHighlighted ? "highlighted-task" : "non-highlighted-task"}>
                <NewTaskButton setTasksFn={setTasksFn}/>
                <DraggableHandle handleFocusDraggableHandle={handleFocusDraggableHandle} handleBlurDraggableHandle={handleBlurDraggableHandle} isHighlighted={isHighlighted}/> 
                <Checkbox handleCheck={handleCheck}/>
                <TaskInput taskAction={task} isTaskDone={isTaskDone}/> 
            </div>
        </>
    )
}