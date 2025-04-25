import React from "react";

import { useState, useEffect } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";
import { SubtaskListContainer } from "./SubtaskListContainer";

import {
    addDoc, 
    collection,
    getDocs,
    deleteDoc,
    doc
} from "firebase/firestore"

import {
    db
} from "./firebase"

export function Task({ 
    deleteTask, 
    setHighlightedTaskIdFn,
    setHighlightedSubtaskIdFn,  
    highlightedTaskId, 
    highlightedSubtaskId,
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
    const isHighlighted = highlightedTaskId.includes(taskId);
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

    useEffect(() => {
        const handleClickOutside = (e) => {
          // If user clicks directly on the background (not on any task), clear selection
          if (e.target.closest(".checklist-task") === null) {
            setHighlightedTaskIdFn([]);
          }
        };
      
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    async function setSubtasksFn(subtaskInput) {
        const addSubtasksBackend = async (subtaskInput) => {
            try {
                if (typeof subtaskInput === "string") { 
                    await addSubtask(taskId, subtaskInput); 
                } else {
                    // bulk replace case (e.g., Gemini gen)
                    const subtasksRef = collection(db, "todos", taskId, "subtasks");
                    const snapshot = await getDocs(subtasksRef);
                    for (const docSnap of snapshot.docs) {
                        await deleteDoc(doc(db, "todos", taskId, "subtasks", docSnap.id));
                    }
    
                    const newSubtasks = []; 
                    // BUG
                    // so the bug here is that in handleDeleteSubtask(SubtaskListContainer), 
                    // setSubtasksFn(reorderedSubtasks) is called which comes here - 
                    // but new tasks are then created which creates that visual bug and weird looking stuff
    
                    for (const input of subtaskInput) {
                        const subtaskActionInput = input["subtaskAction"];
                        console.log("subtaskActionInput: ", subtaskActionInput)
                        const result = await addSubtask(taskId, subtaskActionInput);
                        if (result.success) {
                            newSubtasks.push({
                                subtaskId: result.subtaskId,
                                subtaskAction: result.subtask.subtaskAction,
                                order: result.subtask.order,
                                checkboxState: result.subtask.checkboxState
                            });
                        }
                    }

                    console.log("newSubtasks: ", newSubtasks)
    
                    // Update global + local state
                    const updatedTasks = taskIngredientsInOrder.map(task =>
                        task.id === taskId
                            ? { ...task, subtasks: newSubtasks }
                            : task
                    );
    
                    updateAllTasks(updatedTasks);
                    setSubtasks(newSubtasks);
                }
            } catch (error) {
                console.error("Error adding subtask:", error);
            }
        };
    
        await addSubtasksBackend(subtaskInput);
    }
    
     
    async function updateAllSubtasks(subtaskInput) {
        setSubtasks(subtaskInput);
    }

    function handleFocusDraggableHandle() {
        if (isShiftPressedGlobal) {
            setHighlightedTaskIdFn(prev => {
                if (prev.includes(taskId)) return prev;
                return [...prev, taskId];
            });
        } else {
            setHighlightedTaskIdFn([taskId]);
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
            <div className="checklist-task" id={isHighlighted ? "highlighted-task" : ""}>
                <NewTaskButton 
                    setSubtasksFn={setSubtasksFn}
                    setTasksFn={setTasksFn}
                    isShiftPressedGlobal={isShiftPressedGlobal}
                />
                <DraggableHandle 
                    highlightedTaskId={highlightedTaskId} 
                    deleteTask={deleteTask} 
                    handleFocusDraggableHandle={handleFocusDraggableHandle}
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
                    isHighlighted={isHighlighted}
                /> 
            </div>
            <div className="checklist-subtask" id={isHighlighted ? "highlighted-task" : ""}>
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
                    setHighlightedSubtaskIdFn={setHighlightedSubtaskIdFn}
                    highlightedSubtaskId={highlightedSubtaskId}
                    checkboxState={checkboxState}
                    isHighlighted={isHighlighted}
                />
            </div>
        </>
    )
}