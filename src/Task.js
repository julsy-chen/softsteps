import React from "react";

import { useState } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";
import { SubtaskListContainer } from "./SubtaskListContainer";

export function Task({ deleteTask, highlightedTaskId, taskId, taskAction, setTasksFn, isSelected, updateTaskInput, taskIngredientsInOrder, updateAllTasks}) {
    const [isTaskDone, setIsTaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [subtaskIngredientsInOrder, setSubtasks] = useState([]);

    function setSubtasksFn(subtaskInput) {
        setSubtasks([
            ...subtaskIngredientsInOrder,
            {
                subtaskId: subtaskIngredientsInOrder.length,
                subtaskAction: subtaskInput
            }
        ]);
    }

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
                <NewTaskButton 
                    setSubtasksFn={setSubtasksFn}
                    setTasksFn={setTasksFn}
                />
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
                    taskId={taskId}
                    updateTaskInput={updateTaskInput}
                    updateAllTasks={updateAllTasks}
                    taskIngredientsInOrder={taskIngredientsInOrder}
                /> 
            </div>
            <div className="subtask-list">
                <SubtaskListContainer
                    isTaskDone={isTaskDone}
                    setSubtasksFn={setSubtasksFn}
                    setSubtasks={setSubtasks}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                />
            </div>
            
        </>
    )
}