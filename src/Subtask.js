import React from "react";

import { useState } from "react";

import { NewSubtaskButton } from "./NewSubtaskButton";
import { SubtaskDraggableHandle } from "./SubtaskDraggableHandle";
import { Checkbox } from "./Checkbox";
import { SubtaskInput } from "./SubtaskInput";

export function Subtask({ 
    handleDeleteSubtask, 
    subtaskId, 
    subtaskAction, 
    setSubtasksFn, 
    isSelected, 
    updateSubtaskInput, 
    subtaskIngredientsInOrder, 
    updateAllSubtasks, 
    isTaskDone, 
    isShiftPressedGlobal,
    setHighlightedSubtasksIdFn,
    highlightedSubtasksId
}) {
    const [isSubtaskDone, setIsSubtaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    function handleFocusDraggableHandle() {
        if (isShiftPressedGlobal) {
            setHighlightedSubtasksIdFn([...highlightedSubtasksId, subtaskId])
        } else {
            setHighlightedSubtasksIdFn([subtaskId])
        }
        setIsHighlighted(true);
    }

    function handleBlurDraggableHandle() {
        if (!isShiftPressedGlobal) {
            setHighlightedSubtasksIdFn([])
        }
        setIsHighlighted(false)
    }

    function handleCheck() {
        setIsSubtaskDone(!isSubtaskDone);
    }

    return (
        <>
            <div className="checklist-task" id={isHighlighted ? "highlighted-task" : "non-highlighted-task"}>
                <NewSubtaskButton 
                    setSubtasksFn={setSubtasksFn}
                />
                <SubtaskDraggableHandle 
                    highlightedSubtasksId={highlightedSubtasksId} 
                    handleDeleteSubtask={handleDeleteSubtask} 
                    handleFocusDraggableHandle={handleFocusDraggableHandle} 
                    handleBlurDraggableHandle={handleBlurDraggableHandle} 
                    isHighlighted={isHighlighted} 
                    subtaskId={subtaskId}
                />
                <Checkbox 
                    handleCheck={handleCheck}
                />
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