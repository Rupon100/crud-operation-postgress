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
 
};
initDB();




app.get("/", (req: Request, res: Response) => {
  res.send("Hello lol!");
});


// post users
app.post("/users", async (req: Request, res: Response) => {
  
    const {name, email} = req.body;

    try{
        const result = await pool.query(`INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`, [name, email]);

        console.log(result.rows[0]);

        res.status(200).json({
            success: true,
            message: "data inserted successfully!",
            data: result.rows[0]
        })

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

});

// get all users
app.get("/users", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM users`);
        res.status(200).json({
            success: true,
            message: "users retrieved successfully!",
            data: result.rows
        })
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
})

// get single users
app.get("/users/:id", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [req.params.id])

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: `No user for ${req.params.id}`
            })
        }else{
            res.status(200).send({
                message: req.params,
                data: result.rows
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message 
        })
    }
})


// update single users
app.put("/users/:id", async(req: Request, res: Response) => {
    const {name, email} = req.body;
    try{
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name, email, req.params.id])

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: `No user for ${req.params.id}`
            })
        }else{
            res.status(200).send({
                message: "User updated successfully!",
                data: result.rows
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message 
        })
    }
})


// delete user
app.delete("/users/:id", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id])

        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: `No user for ${req.params.id}`
            })
        }else{
            res.status(200).send({
                message: req.params,
                data: "deleted successfully"
            })
        }
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: "server error",
            error: err.message 
        })
    }
})

app.listen(port, () => {
  console.log(`Application running: https://localhost:${port}`);
});
