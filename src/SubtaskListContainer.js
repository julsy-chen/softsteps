import React from "react";
import { useState } from "react";

import { Subtask } from "./Subtask";
import { BsBracesAsterisk } from "react-icons/bs";

export function SubtaskListContainer({ 
    isSelected, 
    isTaskDone, 
    setSubtasksFn, 
    setSubtasks, 
    subtaskIngredientsInOrder, 
    updateAllSubtasks,
    onSubtaskUpdate,
    deleteSubtask
}) {
    async function handleDeleteSubtask(subtaskId) {
        try {
            // Call the parent's deleteSubtask function
            await deleteSubtask(subtaskId);
        } catch (error) {
            console.error("Error deleting subtask:", error);
        }
    }

    async function handleUpdateSubtask(subtaskId, subtaskAction) {
        console.log("SubtaskListContainer: updating subtask", { subtaskId, subtaskAction });
        try {
            await onSubtaskUpdate(subtaskId, subtaskAction);
        } catch (error) {
            console.error("Error updating subtask:", error);
        }
    }

    var highlightedTaskId = [];

    if (subtaskIngredientsInOrder[0] !== undefined) {
        var assembledSubtaskList = subtaskIngredientsInOrder.map((subtask) => (
            <Subtask
                deleteSubtask={handleDeleteSubtask}
                highlightedTaskId={highlightedTaskId}
                key={subtask.subtaskId}
                subtaskId={subtask.subtaskId}
                subtaskAction={subtask.subtaskAction}
                setSubtasksFn={setSubtasksFn}
                isSelected={isSelected}
                updateSubtaskInput={handleUpdateSubtask}
                subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                updateAllSubtasks={updateAllSubtasks}
                isTaskDone={isTaskDone}
            />
        ));
    }
    
    function updateSubtaskInput(subtaskId, subtaskInput) {
        console.log("updateSubtaskInput")
        subtaskIngredientsInOrder[subtaskId].subtaskAction = subtaskInput;
        setSubtasks([...subtaskIngredientsInOrder]);
    }

    // for (let disassembledTask in taskIngredientsInOrder) {
    //     assembledTaskList.push(
    //         <Task deleteTask={deleteTask} highlightedTaskId={highlightedTaskId} taskId={disassembledTask.id} task={disassembledTask.task} setTasksFn={setTasksFn} isSelected={isSelected} />
    //     )
    // }

    return (
        <>
            {assembledSubtaskList}
        </>
    );
}