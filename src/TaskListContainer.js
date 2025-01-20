import React from "react";
import { useState } from "react";

import { Task } from "./Task";

export function TaskListContainer({ isSelected }) {
    const [taskIngredientsInOrder, setTasks] = useState([
        {
            id: 0,
            taskAction: ""
        }
    ]);

    function setTasksFn() {
        setTasks([
            ...taskIngredientsInOrder,
            {
                id: taskIngredientsInOrder.length,
                taskAction: ""
            }
        ]);
    }

    function deleteTask(taskIndex) {
        var filteredTaskList = taskIngredientsInOrder.filter(
            (task) => task.id !== taskIndex
        );

        var updateTaskListId = filteredTaskList.map((task, index) => ({
            ...task,
            id: index
        }));
        setTasks(updateTaskListId)
    }

    var highlightedTaskId = [];
    // var assembledTaskList = [];

    var assembledTaskList = taskIngredientsInOrder.map((task) => (
        <Task
            deleteTask={deleteTask}
            highlightedTaskId={highlightedTaskId}
            taskId={task.id}
            taskAction={task.taskAction}
            setTasksFn={setTasksFn}
            isSelected={isSelected}
        />
    ));

    // for (let disassembledTask in taskIngredientsInOrder) {
    //     assembledTaskList.push(
    //         <Task deleteTask={deleteTask} highlightedTaskId={highlightedTaskId} taskId={disassembledTask.id} task={disassembledTask.task} setTasksFn={setTasksFn} isSelected={isSelected} />
    //     )
    // }

    return (
        <>
            {assembledTaskList}
        </>
    );
}