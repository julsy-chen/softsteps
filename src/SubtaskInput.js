import React, { useState, useEffect } from "react";

export function SubtaskInput({
    subtaskAction,
    subtaskId, 
    updateSubtaskInput, 
    updateAllSubtasks, 
    subtaskIngredientsInOrder,
    subtaskCheckboxState,
    checkboxState,
    isSubtaskHighlighted,
    isHighlighted
}) {
    const [isShiftPressed, setShiftPressed] = useState(false)
    const [input, setInput] = useState(subtaskAction)

    useEffect(() => {
        setInput(subtaskAction); // Sync external updates
    }, [subtaskAction]);

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

            const data = await response.json();
            
            const generatedTasks = data.map((item, i) => ({
                subtaskId: `${Date.now()}-${i}`, // or Firebase-generated IDs if applicable
                subtaskAction: item.task,
                checkboxState: false,
                order: subtaskIngredientsInOrder.length + i
            }));
            
            updateAllSubtasks([...subtaskIngredientsInOrder, ...generatedTasks]);
            

        } catch (error) {
            console.error("Error generating subtasks:", error);
        }
    };

    return (
        <textarea 
            placeholder={"Input subtask here and press \"shift-enter\" to generate AI response"}
            value={input} 
            onChange = {handleSubtaskInput}
            onKeyDown={(e) => handleKeyDown(e)}
            onKeyUp={(e) => handleKeyUp(e)}
            className={`task-textarea ${(subtaskCheckboxState || checkboxState)? "checked-task": "unchecked-task"} ${(isSubtaskHighlighted || isHighlighted) ? "highlighted-input" : ""}`} 
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