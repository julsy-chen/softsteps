import React from "react"

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";

export function Task() {
    return (
        <>
            <div className="checklist-task">
                <NewTaskButton/>
                <DraggableHandle/>
                <Checkbox/>
                <TaskInput/> 
            </div>
        </>
    )
}