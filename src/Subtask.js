import React from "react";

import { useState } from "react";

import { NewSubtaskButton } from "./NewSubtaskButton";
import { SubtaskDraggableHandle } from "./SubtaskDraggableHandle";
import { Checkbox } from "./Checkbox";
import { SubtaskInput } from "./SubtaskInput";

export function Subtask({ deleteSubtask, highlightedTaskId, subtaskId, subtaskAction, setSubtasksFn, isSelected, updateSubtaskInput, subtaskIngredientsInOrder, updateAllSubtasks, isTaskDone }) {
    const [isSubtaskDone, setIsSubtaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    function handleFocusDraggableHandle() {
        setIsHighlighted(true);
        highlightedTaskId.push(subtaskId)
    }

    function handleBlurDraggableHandle() {
        setIsHighlighted(false)
        highlightedTaskId.pop()
    }

    function handleCheck() {
        setIsSubtaskDone(!isSubtaskDone);
    }

    return (
        <>
            <div className="checklist-task" id={isHighlighted ? "highlighted-task" : "non-highlighted-task"}>
                <NewSubtaskButton setSubtasksFn={setSubtasksFn}/>
                <SubtaskDraggableHandle 
                    highlightedTaskId={highlightedTaskId} 
                    deleteSubtask={deleteSubtask} 
                    handleFocusDraggableHandle={handleFocusDraggableHandle} 
                    handleBlurDraggableHandle={handleBlurDraggableHandle} 
                    isHighlighted={isHighlighted} 
                    subtaskId={subtaskId}
                />
                <Checkbox handleCheck={handleCheck}/>
                <SubtaskInput 
                    subtaskAction={subtaskAction} 
                    isSubtaskDone={isSubtaskDone}
                    subtaskId={subtaskId}
                    updateSubtaskInput={updateSubtaskInput}
                    updateAllSubtasks={updateAllSubtasks}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    isTaskDone={isTaskDone}
                />
            </div>
        </>
    )
}