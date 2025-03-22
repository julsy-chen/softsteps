import React from "react";

import { useState, useEffect } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";
import { SubtaskListContainer } from "./SubtaskListContainer";

export function Task({ deleteTask, setHighlightedTaskIdFn, highlightedTaskId, taskId, taskAction, setTasksFn, isSelected, updateTaskInput, taskIngredientsInOrder, updateAllTasks}) {
    const [isTaskDone, setIsTaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [subtaskIngredientsInOrder, setSubtasks] = useState([]);
    const [isShiftPressedGlobal, setShiftPressedGlobal] = useState(false)

    useEffect(() => {
            // code that we want to run
            const handleKeyDown = (e) => {
                if (e.key === "Shift") {
                    setShiftPressedGlobal(true);
                }
            }

            const handleKeyUp = (e) => {
                if (e.key === "Shift") {
                    setShiftPressedGlobal(false);
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

    function setSubtasksFn(subtaskInput) {
        setSubtasks([
            ...subtaskIngredientsInOrder,
            {
                subtaskId: subtaskIngredientsInOrder.length,
                subtaskAction: subtaskInput
            }
        ]);
    }
     
    function updateAllSubtasks(subtaskInput) {
        setSubtasks(subtaskInput);
        setSubtasksFn("");
    }

    function handleFocusDraggableHandle() {
        if (isShiftPressedGlobal) {
            highlightedTaskId.push(taskId)
            setHighlightedTaskIdFn(highlightedTaskId)
        } else {
            setHighlightedTaskIdFn([taskId])
        }
        setIsHighlighted(true);
    }

    function handleBlurDraggableHandle() {
        if (!isShiftPressedGlobal) {
            setHighlightedTaskIdFn([])
        }
        setIsHighlighted(false)
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
                    isShiftPressedGlobal={isShiftPressedGlobal}
                />
                <DraggableHandle 
                    highlightedTaskId={highlightedTaskId} 
                    deleteTask={deleteTask} 
                    handleFocusDraggableHandle={handleFocusDraggableHandle} 
                    handleBlurDraggableHandle={handleBlurDraggableHandle} 
                    isHighlighted={isHighlighted} 
                    taskId={taskId}
                    isShiftPressedGlobal={isShiftPressedGlobal}
                /> 
                <Checkbox 
                    handleCheck={handleCheck}
                    isShiftPressedGlobal={isShiftPressedGlobal}
                />
                <TaskInput 
                    taskAction={taskAction} 
                    isTaskDone={isTaskDone}
                    taskId={taskId}
                    updateTaskInput={updateTaskInput}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    updateAllSubtasks={updateAllSubtasks}
                /> 
            </div>
            <div className="subtask-list">
                <SubtaskListContainer
                    isTaskDone={isTaskDone}
                    setSubtasksFn={setSubtasksFn}
                    setSubtasks={setSubtasks}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    updateAllSubtasks={updateAllSubtasks}
                />
            </div>
            
        </>
    )
}