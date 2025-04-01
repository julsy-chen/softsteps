import React from "react";

import { useState, useEffect } from "react";

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
    highlightedSubtasksId,
    toggleSubtaskCheckbox,
    subtaskCheckboxState,
    checkboxState
}) {
    const [isSubtaskDone, setIsTaskDone] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [isSubtaskChecked, setIsSubtaskChecked] = useState(checkboxState) //this doesn't seem right

    useEffect(() => {
        setIsSubtaskChecked(subtaskCheckboxState)
    }, [subtaskCheckboxState])

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
                    setIsTaskDone={setIsTaskDone}
                    toggleTaskCheckbox={toggleSubtaskCheckbox}
                    taskId={subtaskId}
                    checkboxState={subtaskCheckboxState}
                />
                <SubtaskInput 
                    subtaskAction={subtaskAction} 
                    isSubtaskDone={isSubtaskDone}
                    subtaskId={subtaskId}
                    updateSubtaskInput={updateSubtaskInput}
                    updateAllSubtasks={updateAllSubtasks}
                    subtaskIngredientsInOrder={subtaskIngredientsInOrder}
                    isTaskDone={isTaskDone}
                    isSubtaskChecked={isSubtaskChecked}
                    subtaskCheckboxState={subtaskCheckboxState}
                    checkboxState={checkboxState}
                />
            </div>
        </>
    )
}