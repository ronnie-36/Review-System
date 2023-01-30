import mysql from "mysql2";
import 'dotenv/config';

let pool = mysql.createPool({
  supportBigNumbers: true,
  bigNumberStrings: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection(function (err, conn) {
  if (err) throw err;
  console.log("Database connected!");
  pool.releaseConnection(conn);
})

export default pool;