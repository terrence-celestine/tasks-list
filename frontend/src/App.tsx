import { useEffect, useState, type ChangeEvent } from 'react'
import './App.css'
import type { Task } from './types/tasks'
import type { ApiResponse } from './types/ApiResponse'

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [taskTitle, setTaskTitle] = useState<string>("")

  const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch("http://localhost:3000/api/tasks");

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const result: ApiResponse<Task[]> = await response.json();
    return result.data;
  }

  const addTask = async (): Promise<void> => {
    console.log("add task")
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ taskTitle, is_completed: false})
    });  

    if (!response.ok) throw new Error("Failed to create task");

    const task: Task = await response.json();
    setTasks((prev) => [...prev, task]);
    setTaskTitle("");
  }

  const updateTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTaskTitle(value)
  }

  useEffect(() => {
    if (loading){
      fetchTasks().then((data) => {
        setTasks(data);
        setLoading(false);
      })
    }
  })

  if (loading) return <div><h1>Loading tasks....</h1></div>
  
  return (
    <>
      <h1>Tasks List</h1>
      {tasks.length > 0 ? <ul>
        {tasks.map((task) => <li key={task.id}>{task.title}</li>)}
        </ul> : <p>No tasks found</p>}
        <div>
          <input type="text" placeholder="Enter a task title" onChange={updateTaskTitle} />
          <button onClick={addTask}>
            Add task
          </button>
        </div>
    </>
  )
}

export default App
