import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import './App.css'
import type { Task } from './types/tasks'
import type { ApiResponse } from './types/ApiResponse'
import { API_URL } from './const'

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [taskTitle, setTaskTitle] = useState<string>("")
  const [hasError, setHasError] = useState<boolean>(false);
  const [hasLoadingErr, setHasLoadingErr] = useState<boolean>(false);

  const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/api/tasks`);

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }

    const result: ApiResponse<Task[]> = await response.json();
    return result.data;
  }

  const addTask = async (): Promise<void> => {
    if (!taskTitle.trim()) {
      setHasError(true);
      return
    }
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({ title: taskTitle, is_completed: false})
    });  

    if (!response.ok) throw new Error("Failed to create task");

    const task: Task = await response.json();
    setTasks((prev) => [...prev, task]);
    setTaskTitle("");
    if (hasError){
      setHasError(false);
    }
  }

  const updateTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    if (hasError){
      setHasError(false)
    }
    if (hasLoadingErr){
      setHasLoadingErr(false)
    }
    const value = event.target.value;
    setTaskTitle(value)
  }

  const deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) throw new Error("Failed to delete task");

    setTasks(prev => prev.filter(task => task.id !== id));
  }

  const checkSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter"){
      addTask() 
    }
  }

  useEffect(() => {
    if (loading){
      try {
        fetchTasks().then((data) => {
          setTasks(data);
          setLoading(false);
        }).catch(err => {
          console.log(err)   
          setHasLoadingErr(true)
      })
      } catch (err) {
        console.log(err)
        setHasLoadingErr(true)
      } finally {
        setLoading(false);
      }
    }
  }, [])

  if (loading) return <h1>Loading tasks....</h1>
  
  return (
    <>
      <h1>Tasks List</h1>
      {tasks.length > 0 ? <div>
        {tasks.map((task) => <div key={task.id}>{task.title}<button type="button" onClick={() => deleteTask(task.id)}>Delete Task</button></div>)}
        </div> : <p>No tasks found</p>}
        <div>
          <input type="text" placeholder="Enter a task title" onChange={updateTaskTitle} value={taskTitle} onKeyDown={checkSubmit}/>
          <button onClick={addTask}>
            Add task
          </button>
          {hasError && <p>Please enter a task</p>}
        </div>
    </>
  )
}

export default App
