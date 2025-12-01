import { Request, Response } from "express";
import { pool } from "../../config/db";

const createTodo = async (id: string, title: string) => {
    const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`, [id, title]);
    return result;
}

const getTodos = async() => {
    const result = await pool.query(`SELECT * FROM todos`);
    return result;
}

const getSingleUserTodos = async(id: string) => {
    const result = await pool.query(`SELECT * FROM todos WHERE user_id=$1`, [id]);
    return result
}

export const todoService = {
    createTodo,
    getTodos,
    getSingleUserTodos,
    
}

