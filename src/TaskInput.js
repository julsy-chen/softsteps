import React from "react";

export function TaskInput({taskAction}) {
    return (
        <input placeholder={taskAction ? taskAction : "Enter task or 'shift-space' for AI"}/>
    );
}