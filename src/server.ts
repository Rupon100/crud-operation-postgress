import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";

const app = express();
const port = config.port;


// parser - middleware
app.use(express.json());
// app.use(express.urlencoded()); // for form data

// database 
initDB();

// logger middleware
const logger = (req: Request, res: Response, next: () => void) => {
    console.log(`${new Date().toISOString()} LEMME CCK YOU PASSPORT!`);
    next();
}




app.get("/", logger,(req: Request, res: Response) => {
  res.send(`Hello lol! ${new Date().toISOString()}`);
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
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);

        console.log(result)

        if(result.rowCount === 0){
            res.status(404).json({
                success: false,
                message: `User deleted successfully!`
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

// delete all users


//--------todos crud--------
app.post('/todos', async(req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try{
        const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [user_id, title]);
        res.status(201).json({
            success: true,
            message: "Todo created successfully!",
            data: result.rows[0]
        })
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: "server error!"
        })
    }
})

// get todos by user
app.get("/todos", async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM todos`);
        res.status(200).json({
            success: true,
            message: "todos retrieved successfully!",
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

// get a single users all todos
app.get('/todos/:id', async(req: Request, res: Response) => {
    try{
        const result = await pool.query(`SELECT * FROM todos WHERE user_id=$1`, [req.params.id]);
        console.log(result.rows[0]);
        res.status(200).json({
            success: true,
            message: `All todos for id: ${req.params.id}`,
            data: result.rows
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Internal server error!"
        })
    }
})


app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
})


app.listen(port, () => {
  console.log(`Application running: https://localhost:${port}`);
});
