import express, { type Request, type Response } from "express"
import cors from "cors"
import pool from "./db"

const app = express()
const PORT = 3000;

app.use(express.json())

// 2. Enable CORS
app.use(cors({
    origin: 'http://localhost:5173' // Only allow requests from your React app
  }));

app.get("/", (_req: Request, res: Response) => {
    res.send('Express is running')
})

app.get("/api/tasks", async (_req: Request, res: Response) => {
    try {
        const query = 'SELECT * FROM tasks';
        const result = await pool.query(query);
        res.status(200).json({ success: true, data: result.rows })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: "Database query failed"
        })
    }
})

app.delete("/api/tasks/:id", async (req:Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const query = "DELETE FROM tasks WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0){
            return res.status(404).json({ error: "Task not found"})
        }
        res.status(200).json({
            message: 'Task deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task"})
    }
})


app.post("/api/tasks", async (req:Request, res: Response) => {
    const { title } = req.body;
    if (typeof title !== "string" || title.trim().length === 0){
        return res.status(400).json({ error: "Title is required"})
    }
    const cleanTitle = title.trim();
    try {
        const query = "INSERT INTO tasks (title, is_completed) VALUES ($1, $2) RETURNING *";
        const result = await pool.query(query, [cleanTitle, false]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to create task"})
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
