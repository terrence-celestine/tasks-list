import { Pool } from "pg"

const pool = new Pool({
    user: 'admin',
    host: "localhost",
    database: "test_server",
    password: "Animes38!",
    port: 5432
})

export default pool