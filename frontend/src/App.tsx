import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import './App.css'
import type { Task } from './types/tasks'
import type { ApiResponse } from './types/ApiResponse'
import { API_URL } from './const'
import Sidebar from './components/Sidebar'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

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
    console.log(value)
    setTaskTitle(value)
  }

  const checkSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    console.log("chekc")
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
      <div id="App">
        <Sidebar/>
        <div id="tasks-container">
        <div>
          <Tasks tasksList={tasks} setTasks={setTasks}/>
          <AddTask taskTitle={taskTitle} updateTaskTitle={updateTaskTitle} addTask={addTask} checkSubmit={checkSubmit}/>
          {hasError && <p>Please enter a task</p>}
          </div>
          </div>
        </div>
    </>
  )
}

export default App
