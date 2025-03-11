import React from "react";
import { useState } from "react";

import { Task } from "./Task";
import { BsBracesAsterisk } from "react-icons/bs";

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

    function deleteTask(deletedTaskId) {
        var filteredTaskList = taskIngredientsInOrder.filter(
            (currentTask) => currentTask.id !== deletedTaskId
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
            key={task.id}
            taskId={task.id}
            taskAction={task.taskAction}
            setTasksFn={setTasksFn}
            isSelected={isSelected}
            updateTaskInput={updateTaskInput}
        />
    ));

    function updateTaskInput(taskId, taskInput) {
        taskIngredientsInOrder[taskId].taskAction = taskInput;
        setTasks([...taskIngredientsInOrder]);
    }

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