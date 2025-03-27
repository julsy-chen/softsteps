import React from "react";
import { useState, useEffect } from "react";

import { Task } from "./Task";
import { BsBracesAsterisk } from "react-icons/bs";

import { addDoc, collection } from "firebase/firestore";
import { 
    db, 
    getTasksBackend, 
    deleteTasksBackend, 
    updateTaskInputBackend,
    updateTaskOrderBackend,
    addSubtaskToTask,
    deleteSubtaskFromTask,
    updateSubtaskInput
} from "./firebase";

export function TaskListContainer({ isSelected }) {
    const [taskIngredientsInOrder, setTasks] = useState([]);
    const [highlightedTaskId, setHighlightedTaskId] = useState([]);

    // Fetch tasks when component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getTasksBackend(db);
                setTasks(tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    function setTasksFn(taskInput) {
        const addTasksBackend = async (taskInput) => {
            try {
                // Calculate the next order number
                const nextOrder = taskIngredientsInOrder.length;
                
                // Add to Firebase
                const docRef = await addDoc(collection(db, "todos"), {
                    taskInput: taskInput,
                    completed: false,
                    subtasks: [],
                    order: nextOrder
                });
                
                // Create new task object with Firebase document ID
                const newTask = {
                    id: docRef.id,
                    taskAction: taskInput,
                    order: nextOrder
                };
                
                // Update local state
                setTasks([
                    ...taskIngredientsInOrder,
                    newTask
                ]);
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
        
        addTasksBackend(taskInput);
    }

    function updateAllTasks(taskInput) {
        setTasks(taskInput);
        setTasksFn("");
    }

    function setHighlightedTaskIdFn(taskId) {
        setHighlightedTaskId(taskId);
    }

    async function deleteTask(deleteTaskList) {
        try {
            // delete from firebase first
            const success = await deleteTasksBackend(db, deleteTaskList);
            
            if (success) {
                // update local state
                var filteredTaskList = taskIngredientsInOrder.filter(
                    (currentTask) => !(deleteTaskList.includes(currentTask.id))
                );
                
                // Reorder remaining tasks
                const reorderedTasks = filteredTaskList.map((task, index) => ({
                    ...task,
                    order: index
                }));
                
                // Update orders in Firebase
                for (const task of reorderedTasks) {
                    await updateTaskOrderBackend(db, task.id, task.order);
                }
                
                setTasks(reorderedTasks);
            } else {
                console.error("Failed to delete tasks from firebase");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateTaskInput(taskId, taskAction) {
        try {
            // Update Firebase first
            const success = await updateTaskInputBackend(db, taskId, taskAction);
            
            if (success) {
                // Update local state only if Firebase update was successful
                const updatedTasks = taskIngredientsInOrder.map(task => 
                    task.id === taskId 
                        ? { ...task, taskAction: taskAction }
                        : task
                );
                setTasks(updatedTasks);
            } else {
                console.error("Failed to update task in firebase");
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function addSubtask(taskId, subtaskAction) {
        try {
            const result = await addSubtaskToTask(db, taskId, subtaskAction);
            if (result.success) {
                // Update local state with correct structure
                const updatedTasks = taskIngredientsInOrder.map(task => {
                    if (task.id === taskId) {
                        const newSubtask = {
                            subtaskId: result.subtaskId,
                            subtaskAction: subtaskAction,
                            order: result.subtask.order
                        };
                        const updatedSubtasks = [...(task.subtasks || []), newSubtask]
                            .sort((a, b) => a.order - b.order);
                        return {
                            ...task,
                            subtasks: updatedSubtasks
                        };
                    }
                    return task;
                });
                setTasks(updatedTasks);
            }
        } catch (error) {
            console.error("Error adding subtask:", error);
        }
    }

    async function deleteSubtask(taskId, subtaskId) {
        try {
            const success = await deleteSubtaskFromTask(db, taskId, subtaskId);
            if (success) {
                // Update local state
                const updatedTasks = taskIngredientsInOrder.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            subtasks: task.subtasks.filter(subtask => subtask.subtaskId !== subtaskId)
                        };
                    }
                    return task;
                });
                setTasks(updatedTasks);
            }
        } catch (error) {
            console.error("Error deleting subtask:", error);
        }
    }

    async function updateSubtaskContent(taskId, subtaskId, subtaskAction) {
        console.log('TaskListContainer: Updating subtask content:', {
            taskId,
            subtaskId,
            subtaskAction
        });
        
        try {
            const success = await updateSubtaskInput(db, taskId, subtaskId, subtaskAction);
            console.log('Update result:', success);
            
            if (success) {
                // Update local state
                const updatedTasks = taskIngredientsInOrder.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            subtasks: task.subtasks.map(subtask => 
                                subtask.subtaskId === subtaskId 
                                    ? { ...subtask, subtaskAction }
                                    : subtask
                            ).sort((a, b) => a.order - b.order)
                        };
                    }
                    return task;
                });
                console.log('Updated local state:', updatedTasks);
                setTasks(updatedTasks);
            } else {
                console.error('Failed to update subtask in Firebase');
            }
        } catch (error) {
            console.error("Error updating subtask:", error);
        }
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
            addSubtask={addSubtask}
            deleteSubtask={deleteSubtask}
            updateSubtaskContent={updateSubtaskContent}
            subtasks={task.subtasks || []}
        />
    ));

    return (
        <>
            {assembledTaskList}
        </>
    );
}