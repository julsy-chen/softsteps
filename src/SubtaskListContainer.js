import React from "react";
import { useState } from "react";

import { Subtask } from "./Subtask";
import { BsBracesAsterisk } from "react-icons/bs";

import {
    db, 
    deleteSubtaskFromTask,
    updateSubtaskOrderBackend,
    updateSubtaskCompleted
} from "./firebase"

export function SubtaskListContainer({ 
    isSelected, 
    isTaskDone, 
    setSubtasksFn, 
    setSubtasks, 
    subtaskIngredientsInOrder, 
    updateAllSubtasks,
    onSubtaskUpdate,
    deleteSubtask, 
    isShiftPressedGlobal,
    taskId,
    setHighlightedSubtaskIdFn,
    highlightedSubtaskId,
    checkboxState,
    isHighlighted
}) {
    async function handleDeleteSubtask(deleteSubtaskList) {
        try {
            const success = await deleteSubtaskFromTask(db, taskId, deleteSubtaskList); // subtask is successfully being deleted from database

            if (success) {
                // update local state
                var filteredSubtaskList = subtaskIngredientsInOrder.filter(
                    (subtask) => !(deleteSubtaskList.includes(subtask.subtaskId))
                )

                const reorderedSubtasks = filteredSubtaskList.map((subtask, index) => ({
                    ...subtask,
                    order: index
                }))
                
                // update order in firebase
                for (const subtask of reorderedSubtasks) {
                    await updateSubtaskOrderBackend(db, taskId, subtask.subtaskId, subtask.order)
                }
                setSubtasks(reorderedSubtasks) // update UI to take away deleted tasks
            }
        } catch (error) {
            console.error("Error deleting subtask:", error);
        }
    }

    async function handleUpdateSubtask(subtaskId, subtaskAction) {
        try {
            await onSubtaskUpdate(subtaskId, subtaskAction);
        } catch (error) {
            console.error("Error updating subtask:", error);
        }
    }

    async function toggleSubtaskCheckbox(subtaskId, currentState) {
        try {
            const success = await updateSubtaskCompleted(db, taskId, subtaskId, !currentState);
            if (success) {
                setSubtasks(prev =>
                    prev.map(subtask =>
                        subtask.subtaskId === subtaskId
                            ? { ...subtask, checkboxState: !currentState }
                            : subtask
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling checkbox state for subtask:", error);
        }
    }

    if (subtaskIngredientsInOrder[0] !== undefined) {
        var assembledSubtaskList = subtaskIngredientsInOrder.map((subtask) => (
            <Subtask
                handleDeleteSubtask={handleDeleteSubtask}
                key={subtask.subtaskId}
                subtaskId={subtask.subtaskId}
                subtaskAction={subtask.subtaskAction}
                setSubtasksFn={setSubtasksFn}
                isSelected={isSelected}
                updateSubtaskInput={handleUpdateSubtask}
                subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                updateAllSubtasks={updateAllSubtasks}
                isTaskDone={isTaskDone}
                isShiftPressedGlobal={isShiftPressedGlobal}
                setHighlightedSubtaskIdFn={setHighlightedSubtaskIdFn}
                highlightedSubtaskId={highlightedSubtaskId}
                toggleSubtaskCheckbox={toggleSubtaskCheckbox}
                subtaskCheckboxState={subtask.checkboxState}
                checkboxState={checkboxState}
                isHighlighted={isHighlighted}
            />
        ));
    }
    
    function updateSubtaskInput(subtaskId, subtaskInput) {
        console.log("updateSubtaskInput")
        subtaskIngredientsInOrder[subtaskId].subtaskAction = subtaskInput;
        setSubtasks([...subtaskIngredientsInOrder]);
    } // is this needed

    return (
        <>
            <div className="subtask-list">
                {assembledSubtaskList}
            </div>
            
        </>
    );
}