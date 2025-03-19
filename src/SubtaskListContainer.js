import React from "react";
import { useState } from "react";

import { Subtask } from "./Subtask";
import { BsBracesAsterisk } from "react-icons/bs";

export function SubtaskListContainer({ isSelected, isTaskDone, setSubtasksFn, setSubtasks, subtaskIngredientsInOrder, updateAllSubtasks }) {

    function deleteSubtask(deletedSubtaskId) {
        var filteredSubtaskList = subtaskIngredientsInOrder.filter(
            (currentTask) => currentTask.subtaskId !== deletedSubtaskId
        );
        var updateSubtaskListId = filteredSubtaskList.map((subtask, index) => ({
            ...subtask,
            subtaskId: index
        }));
        setSubtasks(updateSubtaskListId)
    }

    var highlightedTaskId = [];

    if (subtaskIngredientsInOrder[0] !== undefined) {
        var assembledSubtaskList = subtaskIngredientsInOrder.map((subtask) => (
            <Subtask
                deleteSubtask={deleteSubtask}
                highlightedTaskId={highlightedTaskId}
                key={subtask.subtaskId}
                subtaskId={subtask.subtaskId}
                subtaskAction={subtask.subtaskAction}
                setSubtasksFn={setSubtasksFn}
                isSelected={isSelected}
                updateSubtaskInput={updateSubtaskInput}
                subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                updateAllSubtasks={updateAllSubtasks}
                isTaskDone={isTaskDone}
            />
        ));
    }
    
    function updateSubtaskInput(subtaskId, subtaskInput) {
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