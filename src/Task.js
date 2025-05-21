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
    updateTaskInput, 
    taskIngredientsInOrder, 
    updateAllTasks,
    addSubtask,
    updateSubtaskContent,
    subtasks,
    checkboxState,
    toggleTaskCheckbox,
    setTasks
}) {
    const [isTaskDone, setIsTaskDone] = useState(checkboxState); // is this actually needed
    const isHighlighted = highlightedTaskId.includes(taskId);
    const [isShiftPressedGlobal, setShiftPressedGlobal] = useState(false)
    const [subtaskIngredientsInOrder, setSubtasks] = useState(subtasks || []);

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
                    const subtasksRef = collection(db, "todos", taskId, "subtasks");
                    const snapshot = await getDocs(subtasksRef);
                    for (const docSnap of snapshot.docs) {
                        await deleteDoc(doc(db, "todos", taskId, "subtasks", docSnap.id));
                    }

                    const newSubtasks = [];

                    for (const input of subtaskInput) {
                        const subtaskActionInput = input["subtaskAction"];
                        const result = await addSubtask(taskId, subtaskActionInput);
                        if (result.success) {
                            newSubtasks.push({
                                subtaskId: result.subtaskId,
                                subtaskAction: result.subtask.subtaskAction,
                                order: result.subtask.order,
                                checkboxState: result.subtask.checkboxState,
                            });
                        }
                    }

                    // Replace local state (no appending)
                    setSubtasks(newSubtasks);

                    // Update task in global state
                    const updatedTasks = taskIngredientsInOrder.map(task =>
                        task.id === taskId
                            ? { ...task, subtasks: newSubtasks }
                            : task
                    );
                    updateAllTasks(updatedTasks);

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
                /> 
                <Checkbox 
                    checkboxState={checkboxState}
                    toggleTaskCheckbox={toggleTaskCheckbox}
                    setIsTaskDone={setIsTaskDone}
                    taskId={taskId}
                />
                <TaskInput 
                    taskAction={taskAction}
                    taskId={taskId}
                    updateTaskInput={updateTaskInput}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    setSubtasksFn={setSubtasksFn}
                    checkboxState={checkboxState}
                    isHighlighted={isHighlighted}
                /> 
            </div>
            <div className="checklist-subtask" id={isHighlighted ? "highlighted-task" : ""}>
                <SubtaskListContainer
                    setTasks={setTasks}
                    setSubtasksFn={setSubtasksFn}
                    setSubtasks={setSubtasks}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    updateAllSubtasks={updateAllSubtasks}
                    onSubtaskUpdate={handleSubtaskUpdate}
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