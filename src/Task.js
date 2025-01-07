import React from "react";
import { useState } from "react";

import { NewTaskButton } from "./NewTaskButton";
import { DraggableHandle } from "./DraggableHandle";
import { Checkbox } from "./Checkbox";
import { TaskInput } from "./TaskInput";

export function Task({key, task, setTasksFn}) {
    const [isChecked, setIsChecked] = useState(false);

    function handleCheck() {
        setIsChecked(!isChecked)
    }

    return (
        <>
            <div className="checklist-task">
                <NewTaskButton setTasksFn={setTasksFn}/>
                <DraggableHandle/> 
                <Checkbox handleCheck={handleCheck}/>
                <TaskInput taskAction={task} isChecked={isChecked}/> 
            </div>
        </>
    )
}