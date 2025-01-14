import React from "react";

export function TaskInput({taskAction, isTaskDone}) {
    return (
        <textarea placeholder={taskAction ? taskAction : "Enter task or 'shift-space' for AI"} className={isTaskDone? "checked-task": "unchecked-task"} id="task-input"/>
    );
}