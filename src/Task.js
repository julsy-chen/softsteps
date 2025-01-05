import React from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";

export function Task({key, task, setTasksFn}) {
    return (
        <>
            <div className="checklist-task">
                <NewTaskButton setTasksFn={setTasksFn}/>
                <DraggableHandle/>
                <Checkbox/>
                <TaskInput taskAction={task}/> 
            </div>
        </>
    )
}