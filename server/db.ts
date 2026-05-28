import { Pool } from "pg"

const pool = new Pool({
    user: 'postgres',
    host: "localhost",
    database: "tasks",
    password: "Animes38!",
    port: 5432
})

export default pool