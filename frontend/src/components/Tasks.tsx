import { API_URL } from '../const';
import type { Task } from '../types/tasks'
import type { Dispatch, SetStateAction } from 'react';

interface TasksProps {
    tasksList: Task[];
    setTasks: Dispatch<SetStateAction<Task[]>>
}
const Tasks = ({tasksList, setTasks}:TasksProps) => {
    const deleteTask = async (id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/api/tasks/${id}`, {
          method: "DELETE"
        });
    
        if (!response.ok) throw new Error("Failed to delete task");
    
        setTasks((prev: any[]) => prev.filter(task => task.id !== id));
    }

    return (
    <>
    {tasksList.length > 0 ? <div>
        <h1>General</h1>
        {tasksList.map((task) => <div key={task.id} className='task'>{task.title}<button type="button" onClick={() => deleteTask(task.id)}>Delete Task</button></div>)}
        </div> : <p>No tasks found, please add one using the field below.</p>}
    </>
  )
}

export default Tasks