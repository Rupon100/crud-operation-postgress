import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path"

const app = express();
const port = 5000;

dotenv.config({path: path.join(process.cwd() ,".env")});

// parser - middleware
app.use(express.json());
// app.use(express.urlencoded()); // for form data

// DB
const pool = new Pool({
  connectionString: `${process.env.CONNECTING_STRING}`,
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
        `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        );
        `);
  } catch (err) {
    console.log("DB error: ", err);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello lol!");
});

app.post("/", async (req: Request, res: Response) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: "API is working!",
  });
});

app.listen(port, () => {
  console.log(`Application running: https://localhost:${port}`);
});
