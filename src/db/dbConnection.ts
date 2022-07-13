import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();


export async function dbConnection() {
    const mysqlConnection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: 3306,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME
  });

  return mysqlConnection;
  
}

