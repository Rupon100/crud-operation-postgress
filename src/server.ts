import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";

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
app.use("/users", userRoutes);


// update single users
app.use("/users", userRoutes);


// delete user
app.use("/users", userRoutes);

 


//--------todos crud--------
app.use('/todos', todoRoutes)

// get todos by user
app.get("/todos",  todoRoutes)

// get a single users all todos
app.get('/todos', todoRoutes)



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
