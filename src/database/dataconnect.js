import pg from "pg";

const Pool = pg.Pool;

// const pool = new Pool({
// 	connectionString: process.env.DATABASE_URL,
// 	ssl: {
// 		rejectUnauthorized: false,
// 	},
// })

const pool = new Pool({
  database: "song",
  host: "localhost",
  port: 8000,
  user: "root",
  password: "",
});

export default pool;
