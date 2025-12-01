import { Request, Response } from "express";
import { pool } from "../../config/db";
import { todoService } from "./todo.service";


const createTodo = async(req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try{
        const result = await todoService.createTodo(user_id, title);
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
}

const getTodos = async(req: Request, res: Response) => {
    try{
        const result = await todoService.getTodos();
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
}

const getSingleUserTodos = async(req: Request, res: Response) => {
    try{
        const result = await todoService.getSingleUserTodos(req.params.id!);
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
}

export const todoController = {
    createTodo,
    getTodos,
    getSingleUserTodos,

}
