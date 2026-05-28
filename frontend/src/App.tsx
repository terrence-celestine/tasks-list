import { useEffect, useState, type ChangeEvent } from 'react'
import './App.css'
import type { Task } from './types/tasks'
import type { ApiResponse } from './types/ApiResponse'

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [taskTitle, setTaskTitle] = useState<string>("")
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch("http://localhost:3000/api/tasks");

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const result: ApiResponse<Task[]> = await response.json();
    return result.data;
  }

  const addTask = async (): Promise<void> => {
    if (!taskTitle.trim()) {
      setHasError(true);
    }
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ title: taskTitle, is_completed: false})
    });  

    if (!response.ok) throw new Error("Failed to create task");

    const task: Task = await response.json();
    setTasks((prev) => [...prev, task]);
    setTaskTitle("");
  }

  const updateTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const trimmedTask = value.trim();
    setTaskTitle(trimmedTask)
  }

  useEffect(() => {
    if (loading){
      fetchTasks().then((data) => {
        setTasks(data);
        setLoading(false);
      })
    }
  }, [])

  if (loading) return <h1>Loading tasks....</h1>
  
  return (
    <>
      <h1>Tasks List</h1>
      {tasks.length > 0 ? <ul>
        {tasks.map((task) => <li key={task.id}>{task.title}</li>)}
        </ul> : <p>No tasks found</p>}
        <div>
          <input type="text" placeholder="Enter a task title" onChange={updateTaskTitle} value={taskTitle} />
          <button onClick={addTask}>
            Add task
          </button>
          {hasError && <p>Please enter a task</p>}
        </div>
    </>
  )
}

export default App
