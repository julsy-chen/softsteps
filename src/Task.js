import React from "react";

import { useState, useEffect } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";
import { SubtaskListContainer } from "./SubtaskListContainer";

import {
    addDoc, 
    collection
} from "firebase/firestore"

import {
    db
} from "./firebase"

export function Task({ 
    deleteTask, 
    setHighlightedTaskIdFn,
    setHighlightedSubtasksIdFn,  
    highlightedTaskId, 
    highlightedSubtasksId,
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
    subtasks,
    checkboxState,
    toggleTaskCheckbox
}) {
    const [isTaskDone, setIsTaskDone] = useState(checkboxState);
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
        // Only sync if the incoming subtasks are different from current local state
        const areSubtasksEqual = JSON.stringify(subtaskIngredientsInOrder) === JSON.stringify(subtasks);
        if (!areSubtasksEqual) {
            setSubtasks(subtasks || []);
        }
    }, [subtasks]);

    async function setSubtasksFn(subtaskInput) {
        const addSubtasksBackend = async (subtaskInput) => {
            try {
                if (typeof subtaskInput === "string") { // subtaskInput was a string
                    const nextOrder = subtaskIngredientsInOrder.length;
                
                    const docRef = await addDoc(collection(db, "todos", taskId, "subtasks"), {
                        subtaskAction: subtaskInput, 
                        checkboxState: false,
                        order: nextOrder
                    })
                    
                    const newSubtask = {
                        subtaskId: docRef.id,
                        subtaskAction: subtaskInput,
                        order: nextOrder,
                        checkboxState: checkboxState
                    }

                    await addSubtask(taskId, subtaskInput); 
                    setSubtasks(prev => [...prev, newSubtask]);
                } else { // subtaskInput was an array
                    const newSubtasks = []

                    for (const input of subtaskInput) {
                        const subtaskActionInput = input["subtaskAction"]
                        await addSubtask(taskId, subtaskActionInput)
                    }

                    setSubtasks(prev => [...prev, ...newSubtasks]);
                }
            } catch (error) {
                console.error("Error adding subtask:", error);
            }
        }
        await addSubtasksBackend(subtaskInput)
    }
     
    async function updateAllSubtasks(subtaskInput) {
        setSubtasks(subtaskInput);
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
            setIsHighlighted(false)
        }
    }

    // Add a new function to handle subtask updates
    async function handleSubtaskUpdate(subtaskId, subtaskAction) {
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
                    checkboxState={checkboxState}
                    toggleTaskCheckbox={toggleTaskCheckbox}
                    isShiftPressedGlobal={isShiftPressedGlobal}
                    setIsTaskDone={setIsTaskDone}
                    taskId={taskId}
                />
                <TaskInput 
                    taskAction={taskAction} 
                    isTaskDone={isTaskDone}
                    taskId={taskId}
                    updateTaskInput={updateTaskInput}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    updateAllSubtasks={updateAllSubtasks}
                    setSubtasksFn={setSubtasksFn}
                    checkboxState={checkboxState}
                /> 
            </div>
                <SubtaskListContainer
                    isTaskDone={isTaskDone}
                    setSubtasksFn={setSubtasksFn}
                    setSubtasks={setSubtasks}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    updateAllSubtasks={updateAllSubtasks}
                    onSubtaskUpdate={handleSubtaskUpdate}
                    deleteSubtask={(subtaskId) => deleteSubtask(taskId, subtaskId)}
                    isShiftPressedGlobal={isShiftPressedGlobal}
                    taskId={taskId}
                    setHighlightedSubtasksIdFn={setHighlightedSubtasksIdFn}
                    highlightedSubtasksId={highlightedSubtasksId}
                    checkboxState={checkboxState}
                />
        </>
    )
}