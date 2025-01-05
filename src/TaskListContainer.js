import React from "react";
import { useState } from "react";

import { Task } from "./Task";
import { NewTaskButton } from "./NewTaskButton";

export function TaskListContainer() {
    // type TaskIngredients { 
    //     key: int, 
    //     task: string
    // }

    // state variable "tasks": [<Task />] <-- NO 
    // [__, __, __]
    const [taskIngredientsInOrder, setTasks] = useState([
        {
            key: 1,
            task: "hello"
        }
    ]);

    function setTasksFn() {
        setTasks([
            ...taskIngredientsInOrder,
            {
                key: taskIngredientsInOrder.length + 1,
                task: ""
            }
        ])
    }
    /*
     * type TaskType {
        id: int,
        task: string
    }
     * listOfTasks: [TaskType] = [
    {id: 1,
    task: ""},
    {id: 2, 
    task: ""}
    ]


    */
   var assembledTaskList = [];

   for (let disassembledTask in taskIngredientsInOrder) {
    assembledTaskList.push(
        <Task key={disassembledTask.key} task={disassembledTask.task} setTasksFn={setTasksFn}/>
    )
   }
   console.log(assembledTaskList[0])

    return (
        <>
            <div>tasklistcontainer</div>
            {assembledTaskList}
        </>
    );
}