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
    const [highlightedTaskId, setHighlightedTaskId] = useState([]);

    function setTasksFn(taskInput) {
        setTasks([
            ...taskIngredientsInOrder,
            {
                id: taskIngredientsInOrder.length,
                taskAction: taskInput
            }
        ]);
    }

    function updateAllTasks(taskInput) {
        setTasks(taskInput);
        setTasksFn("");
    }

    function setHighlightedTaskIdFn(taskId) {
        setHighlightedTaskId(taskId);
    }

    function deleteTask(deleteTaskList) {
        var filteredTaskList = taskIngredientsInOrder.filter(
            (currentTask) => !(deleteTaskList.includes(currentTask.id))
        );
        var updateTaskListId = filteredTaskList.map((task, index) => ({
            ...task,
            id: index
        }));
        setTasks(updateTaskListId)
    }

    var assembledTaskList = taskIngredientsInOrder.map((task) => (
        <Task
            deleteTask={deleteTask}
            setHighlightedTaskIdFn={setHighlightedTaskIdFn}
            highlightedTaskId={highlightedTaskId}
            key={task.id}
            taskId={task.id}
            taskAction={task.taskAction}
            setTasksFn={setTasksFn}
            isSelected={isSelected}
            updateTaskInput={updateTaskInput}
            taskIngredientsInOrder={taskIngredientsInOrder}
            updateAllTasks={updateAllTasks}
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