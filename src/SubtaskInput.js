import React, { useState } from "react";

export function SubtaskInput({subtaskAction, isSubtaskDone, subtaskId, updateSubtaskInput, updateAllSubtasks, subtaskIngredientsInOrder, isTaskDone }) {
    const [isShiftPressed, setShiftPressed] = useState(false)
    const [input, setInput] = useState(subtaskAction || "")

    function handleSubtaskInput(e) {
        setInput(e.target.value)
        updateSubtaskInput(subtaskId, e.target.value)
    }

    const handleKeyDown = async (e) => {
        if (e.key === "Shift") {
            setShiftPressed(true);
        } else if (e.key === "Enter") {
            e.preventDefault()
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
            // add generated tasks to the to-do list using setTasksFn
            for (var i = 0; i < data.length; i++) {
                console.log(subtaskIngredientsInOrder)
                subtaskIngredientsInOrder.push({
                    subtaskId: subtaskIngredientsInOrder.length,
                    subtaskAction: data[i]["task"]
                })
            }
            const subtaskInput = subtaskIngredientsInOrder
            updateAllSubtasks(subtaskInput);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <textarea 
            placeholder={"Input subtask here and press \"shift-enter\" to generate AI response"}
            value={subtaskAction} 
            onChange = {handleSubtaskInput}
            onKeyDown={(e) => handleKeyDown(e)}
            onKeyUp={(e) => handleKeyUp(e)}
            className={(isSubtaskDone || isTaskDone)? "checked-task": "unchecked-task"} 
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