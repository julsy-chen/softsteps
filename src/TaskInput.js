import React from "react";

export function TaskInput({taskAction, isChecked}) {
    return (
        <textarea placeholder={taskAction ? taskAction : "Enter task or 'shift-space' for AI"} className={isChecked ? "checked-task": "unchecked-task"} id="task-input"/>
    );
}