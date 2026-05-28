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

app.post("/api/tasks", async (req:Request, res: Response) => {
    const { title } = req.body;
    
    try {
        const query = "INSERT INTO tasks (title, is_completed) VALUES ($1, $2) RETURNING *";
        const result = await pool.query(query, [title, false]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to create task"})
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
