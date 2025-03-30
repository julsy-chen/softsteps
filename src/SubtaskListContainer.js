import React from "react";
import { useState } from "react";

import { Subtask } from "./Subtask";
import { BsBracesAsterisk } from "react-icons/bs";

import {
    db, 
    deleteSubtaskFromTask,
    updateSubtaskOrderBackend
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
    setHighlightedSubtasksIdFn,
    highlightedSubtasksId
}) {

    async function handleDeleteSubtask(deleteSubtaskList) {
        try {
            console.log(subtaskIngredientsInOrder)
            console.log(deleteSubtaskList)
            console.log("handleDeleteSubtask")
            
            const success = await deleteSubtaskFromTask(db, taskId, deleteSubtaskList);

            if (success) {
                // update local state
                var filteredSubtaskList = subtaskIngredientsInOrder.filter(
                    (currentSubtask) => !(deleteSubtaskList.includes(currentSubtask.subtaskId))
                )

                const reorderedSubtasks = filteredSubtaskList.map((subtask, index) => ({
                    ...subtask,
                    order: index
                }))
                

                // update order in firebase
                for (const subtask of reorderedSubtasks) {
                    await updateSubtaskOrderBackend(db, taskId, subtask.subtaskId, subtask.order)
                }
                console.log("reorderedSubtasks: ", reorderedSubtasks)
                updateAllSubtasks(reorderedSubtasks) // update UI to take away deleted tasks
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
                setHighlightedSubtasksIdFn={setHighlightedSubtasksIdFn}
                highlightedSubtasksId={highlightedSubtasksId}
            />
        ));
    }
    
    function updateSubtaskInput(subtaskId, subtaskInput) {
        console.log("updateSubtaskInput")
        subtaskIngredientsInOrder[subtaskId].subtaskAction = subtaskInput;
        setSubtasks([...subtaskIngredientsInOrder]);
    }

    return (
        <>
            <div className="subtask-list">
                {assembledSubtaskList}
            </div>
            
        </>
    );
}