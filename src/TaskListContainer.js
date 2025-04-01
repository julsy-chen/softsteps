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
    updateSubtaskInput,
    updateTaskCompleted
} from "./firebase";

export function TaskListContainer({ isSelected }) {
    const [taskIngredientsInOrder, setTasks] = useState([]);
    const [highlightedTaskId, setHighlightedTaskId] = useState([]);
    const [highlightedSubtasksId, setHighlightedSubtasksId] = useState([]);

    // Fetch tasks when component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getTasksBackend(db);
                console.log("tasks:", tasks)
                setTasks(tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    function setTasksFn(taskInput) {
        const addTasksBackend = async (taskInput) => {
            console.log(taskInput)
            try {
                // Calculate the next order number
                const nextOrder = taskIngredientsInOrder.length;
                
                // Add to Firebase
                const docRef = await addDoc(collection(db, "todos"), {
                    taskInput: taskInput,
                    checkboxState: false,
                    order: nextOrder
                });
                
                // Create new task object with Firebase document ID
                const newTask = {
                    id: docRef.id,
                    taskAction: taskInput,
                    order: nextOrder,
                    subtasks: [],
                    checkboxState: false
                };
                
                // Update local state
                setTasks(prev => [...prev, newTask])
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
        addTasksBackend(taskInput);
    }

    async function toggleTaskCheckbox(taskId, currentState) {
        try {
            const success = await updateTaskCompleted(db, taskId, !currentState);
            if (success) {
                setTasks(prev =>
                    prev.map(task =>
                        task.id === taskId
                            ? { ...task, checkboxState: !currentState }
                            : task
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling checkbox state for task:", error);
        }
    }

    function updateAllTasks(taskInput) {
        setTasks(taskInput);
        setTasksFn("");
    }

    function setHighlightedTaskIdFn(taskId) {
        setHighlightedTaskId(taskId);
    }

    function setHighlightedSubtasksIdFn(selectedSubtaskIds) {
        setHighlightedSubtasksId(selectedSubtaskIds)
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
                
                if (reorderedTasks.length === 0) {
                    // Auto-create one blank task
                    const docRef = await addDoc(collection(db, "todos"), {
                        taskInput: "",
                        checkboxState: false,
                        subtasks: [],
                        order: 0
                    });
                
                    const newTask = {
                        id: docRef.id,
                        taskAction: "",
                        order: 0
                    };
                
                    setTasks([newTask]);
                } else {
                    setTasks(reorderedTasks);
                }
                
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function updateTaskInput(taskId, taskAction) {
        try {
            // 1. Update Firebase
            const success = await updateTaskInputBackend(db, taskId, taskAction);
    
            if (success) {
                // 2. Update local task state
                const updatedTasks = taskIngredientsInOrder.map(task => 
                    task.id === taskId 
                        ? { ...task, taskAction } 
                        : task
                );
    
                setTasks(updatedTasks);
            }

        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    async function addSubtask(taskId, subtaskAction) {
        try {
            const result = await addSubtaskToTask(db, taskId, subtaskAction);
    
            if (result.success) {
                setTasks(prevTasks =>
                    prevTasks.map(task => {
                        if (task.id === taskId) {
                            const updatedSubtasks = [
                                ...(task.subtasks || []),
                                {
                                    subtaskId: result.subtaskId,
                                    subtaskAction: result.subtask.subtaskAction,
                                    order: result.subtask.order,
                                    checkboxState: result.subtask.checkboxState
                                }
                            ].sort((a, b) => a.order - b.order);
    
                            return {
                                ...task,
                                subtasks: updatedSubtasks
                            };
                        }
                        return task;
                    })
                );
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
        try {
            const success = await updateSubtaskInput(db, taskId, subtaskId, subtaskAction);
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
            setHighlightedSubtasksIdFn={setHighlightedSubtasksIdFn}
            highlightedTaskId={highlightedTaskId}
            highlightedSubtasksId={highlightedSubtasksId}
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
            checkboxState={task.checkboxState}
            toggleTaskCheckbox={toggleTaskCheckbox}
        />
    ));

    return (
        <>
            {assembledTaskList}
        </>
    );
}