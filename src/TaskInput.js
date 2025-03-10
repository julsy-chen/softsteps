import React from "react";

export function TaskInput({taskAction, isTaskDone, taskId, updateTaskInput}) {
    // const [taskIput, setTaskInput] = useState("")

    function handleTaskInput(e) {
        updateTaskInput(taskId, e.target.value)
    }

    return (
        <textarea 
            placeholder={taskAction ? taskAction : "Enter task or 'shift-space' for AI"} 
            onChange = {handleTaskInput}
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