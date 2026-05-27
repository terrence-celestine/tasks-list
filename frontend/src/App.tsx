import { useEffect, useState } from 'react'
import './App.css'
import type { Task } from './types/tasks'
import type { ApiResponse } from './types/ApiResponse'

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch("http://localhost:3000/api/tasks");

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const result: ApiResponse<Task[]> = await response.json();
    return result.data;
  }

  useEffect(() => {
    fetchTasks().then((data) => {
      setTasks(data);
      setLoading(false);
    })
  })

  if (loading) return <div>Loading tasks....</div>
  
  return (
    <>
      {tasks.length > 0 && <ul>
        {tasks.map((task) => <li key={task.id}>{task.title}</li>)}
        </ul>}
    </>
  )
}

export default App
