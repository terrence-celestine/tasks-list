import type { ChangeEvent, KeyboardEvent } from "react";

interface AddTaskProps {
    taskTitle: string;
    checkSubmit?: (event: KeyboardEvent<HTMLInputElement>) => void;
    addTask: VoidFunction;
    updateTaskTitle: (event: ChangeEvent<HTMLInputElement>) => void
}

const AddTask = ({taskTitle, addTask, checkSubmit,  updateTaskTitle}: AddTaskProps) => {
  return (
    <div id="add-task-container">
        <input id="input-field" type="text" placeholder="Enter a task title" onChange={updateTaskTitle} value={taskTitle} onKeyDown={checkSubmit}/>
          <button onClick={addTask}>
            Add task
          </button>
    </div>
  )
}

export default AddTask