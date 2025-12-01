import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

const app = express();
const port = config.port;


// parser - middleware
app.use(express.json());
// app.use(express.urlencoded()); // for form data

// database 
initDB();

 


app.get("/", logger, (req: Request, res: Response) => {
  res.send(`Hello lol! ${new Date().toISOString()}`);
});


// post users
// app.post("/users", );
app.use('/users', userRoutes);

// get all users
app.use("/users", userRoutes);


// get single users
app.get("/users", userRoutes);


// update single users
app.put("/users", userRoutes);


// delete user
app.delete("/users", userRoutes);

 


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
