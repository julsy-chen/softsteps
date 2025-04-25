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
    setHighlightedSubtaskIdFn,
    highlightedSubtaskId,
    toggleSubtaskCheckbox,
    subtaskCheckboxState,
    checkboxState,
    isHighlighted
}) {
    const [isSubtaskDone, setIsTaskDone] = useState(false);
    const isSubtaskHighlighted = highlightedSubtaskId.includes(subtaskId);
    const [isSubtaskChecked, setIsSubtaskChecked] = useState(checkboxState) //this doesn't seem right

    useEffect(() => {
        setIsSubtaskChecked(subtaskCheckboxState)
    }, [subtaskCheckboxState])

    useEffect(() => {
        const handleClickOutside = (e) => {
          // If user clicks directly on the background (not on any task), clear selection
          if (e.target.closest(".checklist-task") === null) {
            setHighlightedSubtaskIdFn([]);
          }
        };
      
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    function handleFocusDraggableHandle() {
        if (isShiftPressedGlobal) {
            setHighlightedSubtaskIdFn(prev => {
                if (prev.includes(subtaskId)) return prev;
                return [...prev, subtaskId];
            });
        } else {
            setHighlightedSubtaskIdFn([subtaskId]);
        }
    }

    return (
        <>
            <div className="checklist-task" id={(isHighlighted || isSubtaskHighlighted)? "highlighted-task" : ""}>
                <NewSubtaskButton 
                    setSubtasksFn={setSubtasksFn}
                />
                <SubtaskDraggableHandle 
                    highlightedSubtaskId={highlightedSubtaskId} 
                    handleDeleteSubtask={handleDeleteSubtask} 
                    handleFocusDraggableHandle={handleFocusDraggableHandle}
                    isSubtaskHighlighted={isSubtaskHighlighted} 
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
                    isSubtaskHighlighted={isSubtaskHighlighted}
                    isHighlighted={isHighlighted}
                />
            </div>
        </>
    )
}