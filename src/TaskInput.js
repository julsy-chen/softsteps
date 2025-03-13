import React, { useState } from "react";

export function TaskInput({taskAction, isTaskDone, taskId, updateTaskInput, setTasksFn}) {
    const [isShiftPressed, setShiftPressed] = useState(false)
    const [input, setInput] = useState(taskAction || "")

    function handleTaskInput(e) {
        setInput(e.target.value)
        updateTaskInput(taskId, e.target.value)
    }

    const handleKeyDown = async (e) => {
        if (e.key === "Shift") {
            setShiftPressed(true)
        }
        
        if (e.key === "Enter" && isShiftPressed) {
            e.preventDefault();
            await generateToDoList(input)
        }
    }

    const handleKeyUp = (e) => {
        if (e.key === "Shift") {
            setShiftPressed(false)
        }
    }

    const generateToDoList = async (prompt) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/generate-todo/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: prompt.trim() }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();
            console.log(data)
            setTasksFn((prevTasks) => [...prevTasks, ...data.tasks]); // Add AI-generated tasks to the list
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <textarea 
            placeholder={"Enter task or 'shift-enter' for AI"}
            value={taskAction} 
            onChange = {handleTaskInput}
            onKeyDown={(e) => handleKeyDown(e)}
            onKeyUp={(e) => handleKeyUp(e)}
            className={isTaskDone? "checked-task": "unchecked-task"} 
            id="task-input"
        />
        // use onChange to update taskAction
        /*
        * When shift-enter is detected when focused in the task input field, a different placeholder text will be displayed - "Type in prompt and press Enter to generate AI response"
        * When enter is detected pass in the taskAction to Gemini API -> array of tasks and sub tasks 
        * Iterate through the array and add to the assembledTaskList which has to updsate taskIngredientsInOrder using setTasks
        */
    );
}