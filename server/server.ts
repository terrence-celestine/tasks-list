import express, { type Request, type Response } from "express"

const app = express()
const PORT = 3000;

app.use(express.json())

app.get("/", (_req: Request, res: Response) => {
    res.send('Express is running')
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
