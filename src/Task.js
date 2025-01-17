import React from "react";
import { useState } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";

export function Task({ deleteTask, highlightedTaskId, taskId, taskAction, setTasksFn, isSelected }) {
    const [isTaskDone, setIsTaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    function handleFocusDraggableHandle() {
        setIsHighlighted(true);
        highlightedTaskId.push(taskId)
    }

    function handleBlurDraggableHandle() {
        setIsHighlighted(false)
        highlightedTaskId.pop()
    }

    function handleCheck() {
        setIsTaskDone(!isTaskDone);
    }

    return (
        <>
            <div className="checklist-task" id={isHighlighted ? "highlighted-task" : "non-highlighted-task"}>
                <NewTaskButton setTasksFn={setTasksFn}/>
                <DraggableHandle 
                    highlightedTaskId={highlightedTaskId} 
                    deleteTask={deleteTask} 
                    handleFocusDraggableHandle={handleFocusDraggableHandle} 
                    handleBlurDraggableHandle={handleBlurDraggableHandle} 
                    isHighlighted={isHighlighted} 
                    taskId={taskId}
                /> 
                <Checkbox handleCheck={handleCheck}/>
                <TaskInput 
                    taskAction={taskAction} 
                    isTaskDone={isTaskDone}
                /> 
            </div>
        </>
    )
}