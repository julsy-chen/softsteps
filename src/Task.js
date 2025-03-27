import React from "react";

import { useState, useEffect } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";
import { SubtaskListContainer } from "./SubtaskListContainer";

export function Task({ 
    deleteTask, 
    setHighlightedTaskIdFn, 
    highlightedTaskId, 
    taskId, 
    taskAction, 
    setTasksFn, 
    isSelected, 
    updateTaskInput, 
    taskIngredientsInOrder, 
    updateAllTasks,
    addSubtask,
    deleteSubtask,
    updateSubtaskContent,
    subtasks
}) {
    const [isTaskDone, setIsTaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [subtaskIngredientsInOrder, setSubtasks] = useState(subtasks || []);
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

    useEffect(() => {
        setSubtasks(subtasks || []);
    }, [subtasks]);

    async function setSubtasksFn(subtaskInput) {
        try {
            // Create a temporary subtask for immediate feedback
            const tempSubtask = {
                subtaskId: `temp-${Date.now()}`,
                subtaskAction: subtaskInput,
                order: subtaskIngredientsInOrder.length
            };
            
            // Update local state immediately for better UX
            setSubtasks([...subtaskIngredientsInOrder, tempSubtask]);
            
            // Call backend
            const result = await addSubtask(taskId, subtaskInput);
            
            if (result && result.success) {
                // Update with actual data from backend
                const updatedSubtasks = subtaskIngredientsInOrder.filter(st => st.subtaskId !== tempSubtask.subtaskId);
                const newSubtask = {
                    subtaskId: result.subtaskId,
                    subtaskAction: subtaskInput,
                    order: result.subtask.order
                };
                setSubtasks([...updatedSubtasks, newSubtask].sort((a, b) => a.order - b.order));
            } else {
                // Remove temp subtask if failed
                setSubtasks(subtaskIngredientsInOrder.filter(st => st.subtaskId !== tempSubtask.subtaskId));
            }
        } catch (error) {
            console.error("Error adding subtask:", error);
            // Remove temp subtask if error
            setSubtasks(subtaskIngredientsInOrder);
        }
    }
     
    async function updateAllSubtasks(subtaskInput) {
        const formattedSubtasks = subtaskInput.map((subtask, index) => ({
            subtaskId: subtask.id || index,
            subtaskAction: subtask.taskInput || subtask.subtaskAction,
            order: subtask.order || index
        }));
        setSubtasks(formattedSubtasks);
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

    // Add a new function to handle subtask updates
    async function handleSubtaskUpdate(subtaskId, subtaskAction) {
        console.log('Task: Handling subtask update:', {
            taskId,
            subtaskId,
            subtaskAction
        });
        try {
            await updateSubtaskContent(taskId, subtaskId, subtaskAction);
        } catch (error) {
            console.error("Error in handleSubtaskUpdate:", error);
        }
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
                    onSubtaskUpdate={handleSubtaskUpdate}
                    deleteSubtask={(subtaskId) => deleteSubtask(taskId, subtaskId)}
                />
            </div>
            
        </>
    )
}