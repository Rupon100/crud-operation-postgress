import express from "express";
import { todoController } from "./todo.controller";

const router = express.Router();

// post todo
router.post('/', todoController.createTodo);

// get todos
router.get('/', todoController.getTodos);

// get single user all todos
router.get('/:id', todoController.getSingleUserTodos);


export const todoRoutes = router;